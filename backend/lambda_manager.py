import uuid
import datetime

INITIAL_LAMBDA_FUNCTIONS = [
    {
        "id": "fn-pandas-analytics",
        "name": "pandas-student-analytics-processor",
        "description": "Module 5: Data Processing with Pandas & NumPy (Filtering, Sorting & Department Aggregations)",
        "runtime": "python3.11",
        "handler": "lambda_handler",
        "memoryMb": 1024,
        "timeoutSec": 15,
        "layer": "NumPy-Pandas-DataScience-Layer",
        "trigger": "API Gateway (HTTP POST /analytics)",
        "code": """import numpy as np
import pandas as pd

def lambda_handler(event, context):
    print(f"Executing Lambda Function: {context['function_name']}")
    print(f"Request ID: {context['aws_request_id']}")

    # Sample dataset representing student academic performance
    data = [
        {'id': 1, 'name': 'Alice', 'dept': 'CS', 'marks': 92, 'grade': 'A+'},
        {'id': 2, 'name': 'Bob', 'dept': 'ECE', 'marks': 78, 'grade': 'B'},
        {'id': 3, 'name': 'Charlie', 'dept': 'CS', 'marks': 85, 'grade': 'A'},
        {'id': 4, 'name': 'Diana', 'dept': 'ME', 'marks': 65, 'grade': 'C'},
        {'id': 5, 'name': 'Eve', 'dept': 'ECE', 'marks': 91, 'grade': 'A+'},
        {'id': 6, 'name': 'Frank', 'dept': 'CS', 'marks': 72, 'grade': 'B'},
        {'id': 7, 'name': 'Grace', 'dept': 'ME', 'marks': 88, 'grade': 'A'},
        {'id': 8, 'name': 'Hank', 'dept': 'ECE', 'marks': 55, 'grade': 'D'}
    ]

    df = pd.DataFrame(data)
    
    # Event filter inputs
    min_marks = event.get('min_marks', 70)
    target_dept = event.get('dept', 'All')

    print(f"Filtering dataset: Dept='{target_dept}', Min Marks={min_marks}")

    if target_dept != 'All':
        df = df[df['dept'] == target_dept]
    
    filtered_df = df[df['marks'] >= min_marks]

    avg_marks = float(np.mean(filtered_df['marks'])) if not filtered_df.empty else 0.0

    print(f"Total matching records: {len(filtered_df)}")
    print(f"Calculated average marks: {avg_marks:.2f}")

    return {
        "status": "success",
        "total_records": len(filtered_df),
        "average_marks": round(avg_marks, 2),
        "dataset_summary": filtered_df.to_dict(orient='records')
    }
""",
        "sampleEvent": {"dept": "CS", "min_marks": 75},
        "created_at": "2026-10-06 09:00:00",
        "last_modified": "2026-10-06 09:00:00"
    },
    {
        "id": "fn-flowchart-logic",
        "name": "flow-control-algorithm-evaluator",
        "description": "Module 1 & 2: Flowchart Decision Trees, Algorithm Logic & Control Flow",
        "runtime": "python3.11",
        "handler": "lambda_handler",
        "memoryMb": 512,
        "timeoutSec": 5,
        "layer": "Standard-Python-Library",
        "trigger": "CloudWatch Scheduled Event",
        "code": """def lambda_handler(event, context):
    print("Initiating Flowchart Evaluation Step...")
    number = event.get('number', 42)

    steps = []
    steps.append({"step": "Start", "status": "COMPLETED"})
    steps.append({"step": f"Read Input: N = {number}", "status": "COMPLETED"})

    if number > 0:
        result = "Positive"
        steps.append({"step": "Condition N > 0 evaluated TRUE", "status": "BRANCH_TAKEN"})
        steps.append({"step": 'Output: "Positive"', "status": "COMPLETED"})
    elif number == 0:
        result = "Zero"
        steps.append({"step": "Condition N == 0 evaluated TRUE", "status": "BRANCH_TAKEN"})
        steps.append({"step": 'Output: "Zero"', "status": "COMPLETED"})
    else:
        result = "Negative"
        steps.append({"step": "Condition evaluated FALSE", "status": "BRANCH_TAKEN"})
        steps.append({"step": 'Output: "Negative"', "status": "COMPLETED"})

    steps.append({"step": "End", "status": "COMPLETED"})

    print(f"Evaluation complete. Result: {result}")
    return {
        "input_number": number,
        "classification": result,
        "execution_flow": steps
    }
""",
        "sampleEvent": {"number": 15},
        "created_at": "2026-10-06 09:05:00",
        "last_modified": "2026-10-06 09:05:00"
    },
    {
        "id": "fn-collections-sorter",
        "name": "sorting-searching-benchmark",
        "description": "Module 3: Collection Data Structures (Lists, Dicts) & Sorting/Searching Algorithms",
        "runtime": "python3.11",
        "handler": "lambda_handler",
        "memoryMb": 512,
        "timeoutSec": 10,
        "layer": "Standard-Python-Library",
        "trigger": "API Gateway (HTTP POST /sort)",
        "code": """import time

def bubble_sort(arr):
    n = len(arr)
    comparisons = 0
    swaps = 0
    a = list(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            comparisons += 1
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swaps += 1
    return a, comparisons, swaps

def lambda_handler(event, context):
    input_arr = event.get('arr', [64, 34, 25, 12, 22, 11, 90])
    target = event.get('search_target', 22)

    print(f"Sorting array of size {len(input_arr)}...")
    sorted_arr, comps, swaps = bubble_sort(input_arr)

    # Binary search simulation
    found_idx = -1
    low, high = 0, len(sorted_arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if sorted_arr[mid] == target:
            found_idx = mid
            break
        elif sorted_arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1

    print(f"Sorting complete. Comparisons: {comps}, Swaps: {swaps}")
    print(f"Binary search for {target}: {'Found at index ' + str(found_idx) if found_idx != -1 else 'Not Found'}")

    return {
        "original_array": input_arr,
        "sorted_array": sorted_arr,
        "metrics": {"comparisons": comps, "swaps": swaps},
        "search_result": {"target": target, "found": found_idx != -1, "index": found_idx}
    }
""",
        "sampleEvent": {"arr": [42, 15, 88, 3, 27, 9], "search_target": 27},
        "created_at": "2026-10-06 09:10:00",
        "last_modified": "2026-10-06 09:10:00"
    },
    {
        "id": "fn-queue-dispatcher",
        "name": "sqs-stack-queue-processor",
        "description": "Module 4: Modular Programming, Stack & Queue Data Structures with SQS Trigger",
        "runtime": "python3.11",
        "handler": "lambda_handler",
        "memoryMb": 256,
        "timeoutSec": 5,
        "layer": "Standard-Python-Library",
        "trigger": "Amazon SQS Event Source",
        "code": """def lambda_handler(event, context):
    print("Processing SQS Queue batch payload...")
    records = event.get('Records', [
        {"messageId": "msg-101", "body": "Task: Generate Daily Report"},
        {"messageId": "msg-102", "body": "Task: Sync Student Grades"}
    ])

    stack = []
    processed = []

    for rec in records:
        msg_id = rec.get("messageId")
        payload = rec.get("body")
        print(f"Pushing to Stack: {msg_id}")
        stack.append((msg_id, payload))

    print(f"Stack size after ingest: {len(stack)}")

    while stack:
        current = stack.pop()
        print(f"Popping from Stack & Executing: {current[0]}")
        processed.append({
            "messageId": current[0],
            "status": "PROCESSED",
            "timestamp": "2026-10-06 10:00:00"
        })

    return {
        "batch_size": len(records),
        "processed_tasks": processed,
        "queue_status": "EMPTY"
    }
""",
        "sampleEvent": {
            "Records": [
                {"messageId": "msg-001", "body": "Compute Grade Averages"},
                {"messageId": "msg-002", "body": "Export CSV Report"}
            ]
        },
        "created_at": "2026-10-06 09:15:00",
        "last_modified": "2026-10-06 09:15:00"
    }
]


class LambdaManager:
    def __init__(self):
        self.functions = list(INITIAL_LAMBDA_FUNCTIONS)

    def get_all(self):
        return self.functions

    def get_by_id(self, function_id):
        for fn in self.functions:
            if fn["id"] == function_id:
                return fn
        return None

    def create(self, data):
        new_id = f"fn-{str(uuid.uuid4())[:8]}"
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        new_fn = {
            "id": new_id,
            "name": data.get("name", f"custom-lambda-{new_id}"),
            "description": data.get("description", "Custom simulated AWS Lambda function"),
            "runtime": data.get("runtime", "python3.11"),
            "handler": data.get("handler", "lambda_handler"),
            "memoryMb": int(data.get("memoryMb", 512)),
            "timeoutSec": int(data.get("timeoutSec", 10)),
            "layer": data.get("layer", "Standard-Python-Library"),
            "trigger": data.get("trigger", "API Gateway (HTTP POST)"),
            "code": data.get("code", "# Write Python code here\ndef lambda_handler(event, context):\n    print('Hello from Lambda!')\n    return {'statusCode': 200, 'body': 'OK'}\n"),
            "sampleEvent": data.get("sampleEvent", {}),
            "created_at": now,
            "last_modified": now
        }
        self.functions.append(new_fn)
        return new_fn

    def update(self, function_id, data):
        fn = self.get_by_id(function_id)
        if not fn:
            return None
        
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        if "name" in data: fn["name"] = data["name"]
        if "description" in data: fn["description"] = data["description"]
        if "code" in data: fn["code"] = data["code"]
        if "memoryMb" in data: fn["memoryMb"] = int(data["memoryMb"])
        if "timeoutSec" in data: fn["timeoutSec"] = int(data["timeoutSec"])
        if "layer" in data: fn["layer"] = data["layer"]
        if "trigger" in data: fn["trigger"] = data["trigger"]
        if "sampleEvent" in data: fn["sampleEvent"] = data["sampleEvent"]
        fn["last_modified"] = now
        return fn

    def delete(self, function_id):
        initial_len = len(self.functions)
        self.functions = [f for f in self.functions if f["id"] != function_id]
        return len(self.functions) < initial_len

    def reset_to_defaults(self):
        self.functions = list(INITIAL_LAMBDA_FUNCTIONS)
        return self.functions

lambda_mgr = LambdaManager()
