import os
from flask import Flask, request, jsonify
from flask_cors import CORS

from backend.simulator import executor
from backend.lambda_manager import lambda_mgr
from backend.analytics import analytics_engine

app = Flask(__name__)
CORS(app)  # Enable CORS for local Vite dev server and production frontend

@app.route("/api/status", methods=["GET"])
def get_status():
    return jsonify({
        "service": "AWS Lambda Serverless Compute Simulator",
        "status": "RUNNING",
        "awsRegion": "us-east-1 (N. Virginia)",
        "activeFunctionsCount": len(lambda_mgr.get_all()),
        "totalInvocations": executor.stats["total_invocations"],
        "successfulInvocations": executor.stats["successful_invocations"],
        "failedInvocations": executor.stats["failed_invocations"],
        "chaosModeEnabled": executor.stats["chaos_mode_enabled"],
        "chaosFailureType": executor.stats["chaos_failure_type"]
    })

@app.route("/api/functions", methods=["GET"])
def list_functions():
    return jsonify({
        "functions": lambda_mgr.get_all()
    })

@app.route("/api/functions", methods=["POST"])
def create_function():
    data = request.json or {}
    if not data.get("name"):
        return jsonify({"error": "Function name is required"}), 400
    
    new_fn = lambda_mgr.create(data)
    executor.logger._add_system_log(f"Created new Lambda function '{new_fn['name']}' ({new_fn['id']}).")
    return jsonify({"function": new_fn, "message": "Function created successfully"}), 201

@app.route("/api/functions/<function_id>", methods=["GET"])
def get_function(function_id):
    fn = lambda_mgr.get_by_id(function_id)
    if not fn:
        return jsonify({"error": "Function not found"}), 404
    return jsonify({"function": fn})

@app.route("/api/functions/<function_id>", methods=["PUT"])
def update_function(function_id):
    data = request.json or {}
    updated = lambda_mgr.update(function_id, data)
    if not updated:
        return jsonify({"error": "Function not found"}), 404
    
    executor.logger._add_system_log(f"Updated configuration for function '{updated['name']}' ({function_id}).")
    return jsonify({"function": updated, "message": "Function updated successfully"})

@app.route("/api/functions/<function_id>", methods=["DELETE"])
def delete_function(function_id):
    fn = lambda_mgr.get_by_id(function_id)
    fn_name = fn["name"] if fn else function_id
    success = lambda_mgr.delete(function_id)
    if not success:
        return jsonify({"error": "Function not found"}), 404
    
    executor.logger._add_system_log(f"Deleted Lambda function '{fn_name}' ({function_id}).")
    return jsonify({"message": "Function deleted successfully"})

@app.route("/api/simulate/invoke", methods=["POST"])
def invoke_function():
    data = request.json or {}
    function_id = data.get("functionId")
    code = data.get("code")
    event_payload = data.get("event", {})
    memory_mb = data.get("memoryMb", 512)
    timeout_sec = data.get("timeoutSec", 10)

    fn_name = "custom-adhoc-execution"
    if function_id:
        fn = lambda_mgr.get_by_id(function_id)
        if fn:
            fn_name = fn["name"]
            if not code:
                code = fn["code"]
            memory_mb = data.get("memoryMb", fn["memoryMb"])
            timeout_sec = data.get("timeoutSec", fn["timeoutSec"])

    if not code:
        return jsonify({"error": "Python code is required for execution"}), 400

    result = executor.execute_python_code(
        function_name=fn_name,
        code=code,
        event_payload=event_payload,
        memory_mb=memory_mb,
        timeout_sec=timeout_sec
    )

    analytics_engine.record_invocation(result["durationMs"], result["statusCode"] == 200)

    return jsonify({
        "functionName": fn_name,
        "result": result
    })

@app.route("/api/simulate/chaos", methods=["POST"])
def configure_chaos():
    data = request.json or {}
    enabled = data.get("enabled", False)
    failure_type = data.get("failureType", "none") # "none", "timeout", "oom", "throttle"

    executor.stats["chaos_mode_enabled"] = enabled
    executor.stats["chaos_failure_type"] = failure_type

    msg = f"Chaos Engine updated: Enabled={enabled}, FailureType='{failure_type}'"
    executor.logger._add_system_log(msg, log_type="WARNING" if enabled else "INFO")

    return jsonify({
        "chaosModeEnabled": enabled,
        "chaosFailureType": failure_type,
        "message": msg
    })

@app.route("/api/logs", methods=["GET"])
def get_logs():
    stream_filter = request.args.get("stream", "all")
    limit = int(request.args.get("limit", 100))
    logs = executor.logger.get_logs(stream_filter=stream_filter, limit=limit)
    return jsonify({
        "logs": logs,
        "total": len(logs)
    })

@app.route("/api/logs/clear", methods=["POST"])
def clear_logs():
    executor.logger.clear()
    return jsonify({"message": "Logs cleared successfully"})

@app.route("/api/analytics", methods=["GET"])
def get_analytics():
    metrics = analytics_engine.get_performance_metrics(executor.stats)
    return jsonify({"metrics": metrics})

@app.route("/api/analytics/cost-estimate", methods=["POST"])
def calculate_cost_estimate():
    data = request.json or {}
    monthly_requests = int(data.get("monthlyRequests", 1000000))
    avg_duration_ms = float(data.get("avgDurationMs", 100))
    memory_mb = int(data.get("memoryMb", 512))

    cost_result = analytics_engine.calculate_cost(
        monthly_requests=monthly_requests,
        avg_duration_ms=avg_duration_ms,
        memory_mb=memory_mb
    )

    return jsonify({"costEstimate": cost_result})

@app.route("/api/simulate/reset", methods=["POST"])
def reset_simulation():
    executor.stats["total_invocations"] = 0
    executor.stats["successful_invocations"] = 0
    executor.stats["failed_invocations"] = 0
    executor.stats["total_execution_time_ms"] = 0
    executor.stats["chaos_mode_enabled"] = False
    executor.stats["chaos_failure_type"] = "none"

    lambda_mgr.reset_to_defaults()
    executor.logger.clear()
    executor.logger._add_system_log("Entire AWS Lambda simulation state has been reset to defaults.")

    return jsonify({
        "message": "Simulation state reset successfully",
        "functionsCount": len(lambda_mgr.get_all())
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)
