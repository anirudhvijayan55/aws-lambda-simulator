import sys
import io
import time
import uuid
import datetime
import traceback
import random

class CloudWatchLogger:
    def __init__(self):
        self.logs = []
        self._add_system_log("CloudWatch Log Stream initialized for AWS Lambda service.")

    def _add_system_log(self, message, log_type="INFO"):
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        entry = {
            "id": str(uuid.uuid4())[:8],
            "timestamp": timestamp,
            "type": log_type,
            "message": message,
            "stream": "syslog"
        }
        self.logs.insert(0, entry)
        if len(self.logs) > 300:
            self.logs.pop()

    def log_invocation(self, function_name, request_id, status, duration_ms, memory_mb, stdout, stderr):
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # CloudWatch START event
        self.logs.insert(0, {
            "id": str(uuid.uuid4())[:8],
            "timestamp": timestamp,
            "type": "START",
            "message": f"START RequestId: {request_id} Version: $LATEST (Function: {function_name})",
            "stream": function_name
        })

        # Stdout logs
        if stdout:
            for line in stdout.strip().split("\n"):
                if line:
                    self.logs.insert(0, {
                        "id": str(uuid.uuid4())[:8],
                        "timestamp": timestamp,
                        "type": "LOG",
                        "message": f"[STDOUT] {line}",
                        "stream": function_name
                    })

        # Stderr / Error logs
        if stderr:
            for line in stderr.strip().split("\n"):
                if line:
                    self.logs.insert(0, {
                        "id": str(uuid.uuid4())[:8],
                        "timestamp": timestamp,
                        "type": "ERROR",
                        "message": f"[STDERR] {line}",
                        "stream": function_name
                    })

        # CloudWatch REPORT event
        billed_duration = int(((duration_ms + 99) // 100) * 100)
        max_mem_used = min(memory_mb, max(16, int(memory_mb * (0.35 + random.random() * 0.4))))
        
        status_flag = "SUCCESS" if status == 200 else "ERROR"
        report_msg = (
            f"REPORT RequestId: {request_id} Duration: {duration_ms:.2f} ms "
            f"Billed Duration: {billed_duration} ms Memory Size: {memory_mb} MB "
            f"Max Memory Used: {max_mem_used} MB Status: {status_flag}"
        )
        
        self.logs.insert(0, {
            "id": str(uuid.uuid4())[:8],
            "timestamp": timestamp,
            "type": "REPORT" if status == 200 else "REPORT_ERROR",
            "message": report_msg,
            "stream": function_name
        })

    def get_logs(self, stream_filter=None, limit=100):
        if stream_filter and stream_filter != "all":
            return [l for l in self.logs if l["stream"] == stream_filter][:limit]
        return self.logs[:limit]

    def clear(self):
        self.logs = []
        self._add_system_log("CloudWatch logs cleared by user.")


class LambdaExecutor:
    def __init__(self):
        self.logger = CloudWatchLogger()
        self.stats = {
            "total_invocations": 0,
            "successful_invocations": 0,
            "failed_invocations": 0,
            "total_execution_time_ms": 0,
            "chaos_mode_enabled": False,
            "chaos_failure_type": "none" # "none", "timeout", "oom", "throttle"
        }

    def execute_python_code(self, function_name, code, event_payload=None, memory_mb=512, timeout_sec=10):
        self.stats["total_invocations"] += 1
        request_id = str(uuid.uuid4())
        start_time = time.time()

        # Handle Chaos Failure Simulation
        if self.stats["chaos_mode_enabled"]:
            fail_type = self.stats["chaos_failure_type"]
            if fail_type == "timeout":
                time.sleep(0.15)
                duration_ms = timeout_sec * 1000.0
                err_msg = f"Task timed out after {timeout_sec}.00 seconds (Chaos Simulation: Timeout)"
                self.stats["failed_invocations"] += 1
                self.logger.log_invocation(function_name, request_id, 504, duration_ms, memory_mb, "", err_msg)
                return {
                    "statusCode": 504,
                    "requestId": request_id,
                    "durationMs": duration_ms,
                    "billedDurationMs": timeout_sec * 1000,
                    "memorySizeMb": memory_mb,
                    "logs": err_msg,
                    "output": None,
                    "error": "TaskTimedOutException"
                }
            elif fail_type == "oom":
                duration_ms = 45.0
                err_msg = f"Memory limit exceeded ({memory_mb} MB limit reached). Runtime killed (Chaos Simulation)."
                self.stats["failed_invocations"] += 1
                self.logger.log_invocation(function_name, request_id, 500, duration_ms, memory_mb, "", err_msg)
                return {
                    "statusCode": 500,
                    "requestId": request_id,
                    "durationMs": duration_ms,
                    "billedDurationMs": 100,
                    "memorySizeMb": memory_mb,
                    "logs": err_msg,
                    "output": None,
                    "error": "OutOfMemoryException"
                }
            elif fail_type == "throttle":
                duration_ms = 5.0
                err_msg = "Rate Exceeded. ConcurrentInvocationLimitExceeded (429 Too Many Requests)."
                self.stats["failed_invocations"] += 1
                self.logger.log_invocation(function_name, request_id, 429, duration_ms, memory_mb, "", err_msg)
                return {
                    "statusCode": 429,
                    "requestId": request_id,
                    "durationMs": duration_ms,
                    "billedDurationMs": 100,
                    "memorySizeMb": memory_mb,
                    "logs": err_msg,
                    "output": None,
                    "error": "TooManyRequestsException"
                }

        # Standard execution in StringIO sandbox
        old_stdout = sys.stdout
        old_stderr = sys.stderr
        stdout_capture = io.StringIO()
        stderr_capture = io.StringIO()
        sys.stdout = stdout_capture
        sys.stderr = stderr_capture

        output_val = None
        status_code = 200
        error_type = None

        try:
            # Prepare execution global namespace
            global_scope = {
                "__name__": "__main__",
                "event": event_payload or {},
                "context": {
                    "function_name": function_name,
                    "aws_request_id": request_id,
                    "memory_limit_in_mb": memory_mb
                }
            }
            
            # Execute user code
            exec(code, global_scope)

            # If lambda_handler is defined, call it
            if "lambda_handler" in global_scope and callable(global_scope["lambda_handler"]):
                output_val = global_scope["lambda_handler"](event_payload or {}, global_scope["context"])
            elif "handler" in global_scope and callable(global_scope["handler"]):
                output_val = global_scope["handler"](event_payload or {}, global_scope["context"])

        except Exception as e:
            status_code = 500
            error_type = type(e).__name__
            stderr_capture.write(traceback.format_exc())
        finally:
            sys.stdout = old_stdout
            sys.stderr = old_stderr

        duration_ms = round((time.time() - start_time) * 1000.0, 2)
        stdout_str = stdout_capture.getvalue()
        stderr_str = stderr_capture.getvalue()

        if status_code == 200:
            self.stats["successful_invocations"] += 1
        else:
            self.stats["failed_invocations"] += 1

        self.stats["total_execution_time_ms"] += duration_ms

        self.logger.log_invocation(
            function_name, request_id, status_code, duration_ms, memory_mb, stdout_str, stderr_str
        )

        return {
            "statusCode": status_code,
            "requestId": request_id,
            "durationMs": duration_ms,
            "billedDurationMs": int(((duration_ms + 99) // 100) * 100),
            "memorySizeMb": memory_mb,
            "stdout": stdout_str,
            "stderr": stderr_str,
            "output": str(output_val) if output_val is not None else None,
            "error": error_type
        }

executor = LambdaExecutor()
