// Default Lambda functions (mirrors INITIAL_LAMBDA_FUNCTIONS in backend/lambda_manager.py)

export const INITIAL_LAMBDA_FUNCTIONS = [
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
    "code": "import numpy as np\nimport pandas as pd\n\ndef lambda_handler(event, context):\n    print(f\"Executing Lambda Function: {context['function_name']}\")\n    print(f\"Request ID: {context['aws_request_id']}\")\n\n    # Sample dataset representing student academic performance\n    data = [\n        {'id': 1, 'name': 'Alice', 'dept': 'CS', 'marks': 92, 'grade': 'A+'},\n        {'id': 2, 'name': 'Bob', 'dept': 'ECE', 'marks': 78, 'grade': 'B'},\n        {'id': 3, 'name': 'Charlie', 'dept': 'CS', 'marks': 85, 'grade': 'A'},\n        {'id': 4, 'name': 'Diana', 'dept': 'ME', 'marks': 65, 'grade': 'C'},\n        {'id': 5, 'name': 'Eve', 'dept': 'ECE', 'marks': 91, 'grade': 'A+'},\n        {'id': 6, 'name': 'Frank', 'dept': 'CS', 'marks': 72, 'grade': 'B'},\n        {'id': 7, 'name': 'Grace', 'dept': 'ME', 'marks': 88, 'grade': 'A'},\n        {'id': 8, 'name': 'Hank', 'dept': 'ECE', 'marks': 55, 'grade': 'D'}\n    ]\n\n    df = pd.DataFrame(data)\n    \n    # Event filter inputs\n    min_marks = event.get('min_marks', 70)\n    target_dept = event.get('dept', 'All')\n\n    print(f\"Filtering dataset: Dept='{target_dept}', Min Marks={min_marks}\")\n\n    if target_dept != 'All':\n        df = df[df['dept'] == target_dept]\n    \n    filtered_df = df[df['marks'] >= min_marks]\n\n    avg_marks = float(np.mean(filtered_df['marks'])) if not filtered_df.empty else 0.0\n\n    print(f\"Total matching records: {len(filtered_df)}\")\n    print(f\"Calculated average marks: {avg_marks:.2f}\")\n\n    return {\n        \"status\": \"success\",\n        \"total_records\": len(filtered_df),\n        \"average_marks\": round(avg_marks, 2),\n        \"dataset_summary\": filtered_df.to_dict(orient='records')\n    }\n",
    "sampleEvent": {
      "dept": "CS",
      "min_marks": 75
    },
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
    "code": "def lambda_handler(event, context):\n    print(\"Initiating Flowchart Evaluation Step...\")\n    number = event.get('number', 42)\n\n    steps = []\n    steps.append({\"step\": \"Start\", \"status\": \"COMPLETED\"})\n    steps.append({\"step\": f\"Read Input: N = {number}\", \"status\": \"COMPLETED\"})\n\n    if number > 0:\n        result = \"Positive\"\n        steps.append({\"step\": \"Condition N > 0 evaluated TRUE\", \"status\": \"BRANCH_TAKEN\"})\n        steps.append({\"step\": 'Output: \"Positive\"', \"status\": \"COMPLETED\"})\n    elif number == 0:\n        result = \"Zero\"\n        steps.append({\"step\": \"Condition N == 0 evaluated TRUE\", \"status\": \"BRANCH_TAKEN\"})\n        steps.append({\"step\": 'Output: \"Zero\"', \"status\": \"COMPLETED\"})\n    else:\n        result = \"Negative\"\n        steps.append({\"step\": \"Condition evaluated FALSE\", \"status\": \"BRANCH_TAKEN\"})\n        steps.append({\"step\": 'Output: \"Negative\"', \"status\": \"COMPLETED\"})\n\n    steps.append({\"step\": \"End\", \"status\": \"COMPLETED\"})\n\n    print(f\"Evaluation complete. Result: {result}\")\n    return {\n        \"input_number\": number,\n        \"classification\": result,\n        \"execution_flow\": steps\n    }\n",
    "sampleEvent": {
      "number": 15
    },
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
    "code": "import time\n\ndef bubble_sort(arr):\n    n = len(arr)\n    comparisons = 0\n    swaps = 0\n    a = list(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            comparisons += 1\n            if a[j] > a[j + 1]:\n                a[j], a[j + 1] = a[j + 1], a[j]\n                swaps += 1\n    return a, comparisons, swaps\n\ndef lambda_handler(event, context):\n    input_arr = event.get('arr', [64, 34, 25, 12, 22, 11, 90])\n    target = event.get('search_target', 22)\n\n    print(f\"Sorting array of size {len(input_arr)}...\")\n    sorted_arr, comps, swaps = bubble_sort(input_arr)\n\n    # Binary search simulation\n    found_idx = -1\n    low, high = 0, len(sorted_arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if sorted_arr[mid] == target:\n            found_idx = mid\n            break\n        elif sorted_arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n\n    print(f\"Sorting complete. Comparisons: {comps}, Swaps: {swaps}\")\n    print(f\"Binary search for {target}: {'Found at index ' + str(found_idx) if found_idx != -1 else 'Not Found'}\")\n\n    return {\n        \"original_array\": input_arr,\n        \"sorted_array\": sorted_arr,\n        \"metrics\": {\"comparisons\": comps, \"swaps\": swaps},\n        \"search_result\": {\"target\": target, \"found\": found_idx != -1, \"index\": found_idx}\n    }\n",
    "sampleEvent": {
      "arr": [
        42,
        15,
        88,
        3,
        27,
        9
      ],
      "search_target": 27
    },
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
    "code": "def lambda_handler(event, context):\n    print(\"Processing SQS Queue batch payload...\")\n    records = event.get('Records', [\n        {\"messageId\": \"msg-101\", \"body\": \"Task: Generate Daily Report\"},\n        {\"messageId\": \"msg-102\", \"body\": \"Task: Sync Student Grades\"}\n    ])\n\n    stack = []\n    processed = []\n\n    for rec in records:\n        msg_id = rec.get(\"messageId\")\n        payload = rec.get(\"body\")\n        print(f\"Pushing to Stack: {msg_id}\")\n        stack.append((msg_id, payload))\n\n    print(f\"Stack size after ingest: {len(stack)}\")\n\n    while stack:\n        current = stack.pop()\n        print(f\"Popping from Stack & Executing: {current[0]}\")\n        processed.append({\n            \"messageId\": current[0],\n            \"status\": \"PROCESSED\",\n            \"timestamp\": \"2026-10-06 10:00:00\"\n        })\n\n    return {\n        \"batch_size\": len(records),\n        \"processed_tasks\": processed,\n        \"queue_status\": \"EMPTY\"\n    }\n",
    "sampleEvent": {
      "Records": [
        {
          "messageId": "msg-001",
          "body": "Compute Grade Averages"
        },
        {
          "messageId": "msg-002",
          "body": "Export CSV Report"
        }
      ]
    },
    "created_at": "2026-10-06 09:15:00",
    "last_modified": "2026-10-06 09:15:00"
  }
]
