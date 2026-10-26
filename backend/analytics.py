class AnalyticsEngine:
    def __init__(self):
        self.latency_history = [24.5, 32.1, 18.9, 45.2, 28.0, 110.4, 21.0, 35.8, 19.4, 40.1]
        self.invocation_hourly = [12, 28, 45, 89, 120, 154, 210, 180, 140, 95, 60, 40]

    def record_invocation(self, duration_ms, is_success):
        self.latency_history.append(duration_ms)
        if len(self.latency_history) > 100:
            self.latency_history.pop(0)

    def calculate_cost(self, monthly_requests=1000000, avg_duration_ms=100, memory_mb=512):
        # AWS Lambda Pricing Model:
        # Request Charge: $0.20 per 1,000,000 requests
        # Compute Charge: $0.0000166667 per GB-second
        # AWS Lambda Free Tier: 1M free requests / month & 400,000 GB-seconds / month

        memory_gb = memory_mb / 1024.0
        duration_sec = avg_duration_ms / 1000.0
        total_gb_seconds = monthly_requests * duration_sec * memory_gb

        # Free tier deductions
        billable_requests = max(0, monthly_requests - 1000000)
        billable_gb_seconds = max(0, total_gb_seconds - 400000)

        request_cost = (billable_requests / 1000000.0) * 0.20
        compute_cost = billable_gb_seconds * 0.0000166667
        total_cost = request_cost + compute_cost

        return {
            "monthlyRequests": monthly_requests,
            "avgDurationMs": avg_duration_ms,
            "memoryMb": memory_mb,
            "totalGbSeconds": round(total_gb_seconds, 2),
            "billableRequests": billable_requests,
            "billableGbSeconds": round(billable_gb_seconds, 2),
            "requestCost": round(request_cost, 4),
            "computeCost": round(compute_cost, 4),
            "totalCostMonthly": round(total_cost, 2),
            "freeTierCovered": total_cost == 0.0
        }

    def get_performance_metrics(self, stats):
        total = stats.get("total_invocations", 0)
        succ = stats.get("successful_invocations", 0)
        fail = stats.get("failed_invocations", 0)

        latencies = sorted(self.latency_history) if self.latency_history else [0]
        p50 = latencies[int(len(latencies) * 0.5)]
        p95 = latencies[int(len(latencies) * 0.95)] if len(latencies) >= 20 else max(latencies)
        p99 = latencies[int(len(latencies) * 0.99)] if len(latencies) >= 100 else max(latencies)
        avg_lat = sum(latencies) / len(latencies) if latencies else 0.0

        error_rate = round((fail / total * 100.0), 1) if total > 0 else 0.0
        success_rate = round((succ / total * 100.0), 1) if total > 0 else 100.0

        return {
            "totalInvocations": total,
            "successfulInvocations": succ,
            "failedInvocations": fail,
            "errorRatePercent": error_rate,
            "successRatePercent": success_rate,
            "latencyMetrics": {
                "avgMs": round(avg_lat, 2),
                "p50Ms": round(p50, 2),
                "p95Ms": round(p95, 2),
                "p99Ms": round(p99, 2)
            },
            "recentLatencySamples": self.latency_history[-15:],
            "hourlyInvocationTrend": self.invocation_hourly
        }

analytics_engine = AnalyticsEngine()
