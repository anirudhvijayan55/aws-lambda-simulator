# Educational AWS Service Simulator: AWS Lambda & CloudWatch

> **Assignment Title**: AWS Service Simulation & Enhancement Assignment  
> **Simulated AWS Service**: **AWS Lambda** (Serverless Python Compute Service) & **Amazon CloudWatch** (Observability & Logging)  
> **Enhancement**: CloudWatch Analytics Engine, Chaos/Failure Injection Testing, & AWS Lambda Cost Estimator  

---

## 1. Project Title
**Educational AWS Service Simulator — AWS Lambda & CloudWatch Serverless Compute Platform**

## 2. Project Description
This application is a full-stack, cloud-inspired web application created directly from the original Python simulator project. It transforms Python learning scripts, data processing workflows (NumPy & Pandas), control flows, flowcharts, search/sorting algorithms, and stack/queue data structures into **AWS Lambda Serverless Functions**. 

Users can configure simulated Lambda memory allocations, timeout limits, and event triggers, execute Python handlers, view real-time CloudWatch execution log streams, simulate failure conditions (chaos engineering), and analyze monthly AWS billing estimates.

---

## 3. AWS Service Being Simulated
- **Primary AWS Service**: **AWS Lambda** (Serverless Compute)
- **Supporting AWS Services**: **Amazon CloudWatch** (Logs & Metrics), **Amazon SQS** (Queue Event Trigger), **Amazon API Gateway** (HTTP Trigger).

---

## 4. Problem Statement
Deploying and managing real AWS cloud infrastructure for educational coursework often requires AWS accounts, access keys, billing setups, and carries risks of unintended charges or key leaks. This project provides a risk-free, local **Educational AWS Service Simulator** that mirrors real AWS Lambda execution models, CloudWatch streams, and billing calculations.

---

## 5. Objectives
1. Recreate the original Python simulator as a modern full-stack web application.
2. Accurately map Python logic (algorithms, Pandas data processing, control flows) to AWS Lambda handler functions.
3. Provide an intuitive AWS Cloud Console dashboard interface (Slate theme, status pills, metrics, live logs).
4. Implement a meaningful enhancement: **CloudWatch Analytics, Chaos Failure Injection Engine, & Cost Estimator**.
5. Enable reliable single-command local execution and simple cloud deployment via Render / Heroku / Vercel.

---

## 6. How This Project Maps to the Real AWS Service

| Original Python Simulator Feature | Corresponding AWS Service Concept | AWS API / Operation | Web Console Feature |
| :--- | :--- | :--- | :--- |
| **Python Code Execution Engine** | AWS Lambda Execution Sandbox | `lambda:Invoke` | Interactive Invocation Studio (`/simulator`) |
| **Module 5: Pandas/NumPy Data Processing** | AWS Lambda Data Layer | Lambda Layer (`numpy-pandas`) | Student Analytics Data Filtering Template |
| **Module 1 & 2: Flowcharts & Control Flow** | AWS Step Functions | `states:StartExecution` | Decision Tree Flowchart Evaluator |
| **Module 3: Sorting & Searching** | Lambda Performance Profiling | Compute Benchmarking | Sorting & Search Metric Evaluator |
| **Module 4: Stack & Queue Handlers** | Amazon SQS Trigger | `sqs:SendMessage` → Lambda | Queue Task Batch Dispatcher |
| **Terminal Output & Print Statements** | Amazon CloudWatch Logs | `logs:FilterLogEvents` | Live CloudWatch Log Streams (`/logs`) |

---

## 7. Features
- **AWS Console Dashboard**: Key metrics, active functions count, success/error rates, live CloudWatch log preview.
- **Interactive Lambda Workshop**: Code editor, event JSON payload builder, memory slider (128MB–3072MB), timeout slider (1s–60s).
- **Resource Manager**: Create, list, edit, and delete simulated Lambda functions and layers.
- **CloudWatch Log Viewer**: Real-time structured log streams with `START`, `[STDOUT]`, `REPORT` (Billed Duration), and `ERROR` filters.
- **Enhancement 1 — Chaos Failure Injection**: Simulate 504 Timeout, 500 Out of Memory (OOM), and 429 Concurrency Throttling errors.
- **Enhancement 2 — AWS Cost Calculator**: Calculate monthly AWS Lambda billing based on memory size, duration, and invocation volume.
- **Reset Simulation**: One-click reset for session metrics and logs.

---

## 8. Technology Stack
- **Frontend**: React, Vite, HTML5, CSS3 (AWS Dark Console Theme), JavaScript (ES6+), React Router DOM.
- **Backend**: Python 3, Flask, Flask-CORS, NumPy, Pandas, Gunicorn.
- **API Protocol**: RESTful JSON API.

---

## 9. Project Structure

```
Python_simulator-main/
├── backend/
│   ├── app.py                 # Flask REST API endpoints
│   ├── simulator.py           # Lambda execution engine & CloudWatch logger
│   ├── lambda_manager.py      # Lambda functions CRUD & pre-built templates
│   ├── analytics.py           # Metrics, latency & AWS cost calculator
│   ├── requirements.txt       # Python dependencies
│   └── Procfile               # Cloud deployment configuration
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx        # AWS Console navigation sidebar
│   │   └── TopBar.jsx         # Header bar with simulation status & quick run
│   ├── context/
│   │   └── AppContext.jsx     # State manager & REST API connector
│   ├── pages/
│   │   ├── Dashboard.jsx      # Overview dashboard
│   │   ├── ServiceSimulator.jsx# Lambda handler invocation studio
│   │   ├── Resources.jsx      # Deployed Lambda functions manager
│   │   ├── ActivityLogs.jsx   # CloudWatch log stream viewer
│   │   ├── Analytics.jsx      # Chaos testing & cost calculator
│   │   └── SettingsAbout.jsx  # AWS mapping guide & demo specs
│   ├── App.jsx                # Main layout and routing
│   └── index.css              # AWS Console theme styling
├── start_simulator.sh         # One-click startup script
├── git_push_guide.sh          # Git repository setup script
├── README.md                  # Complete project documentation
└── package.json
```

---

## 10. Installation Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+ and npm

### Local Setup (Automatic)
Run the launcher script:
```bash
bash start_simulator.sh
```

### Local Setup (Manual)
1. **Backend**:
   ```bash
   pip install -r backend/requirements.txt
   PYTHONPATH=. python3 backend/app.py
   ```
   *Flask backend starts at http://localhost:5001*

2. **Frontend** (in a second terminal):
   ```bash
   npm install
   npm run dev
   ```
   *Vite frontend starts at http://localhost:5173*

---

## 11. API Documentation

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/status` | GET | Returns overall simulator status and invocation counts |
| `/api/functions` | GET | List all deployed Lambda functions |
| `/api/functions` | POST | Create a new Lambda function |
| `/api/functions/<id>` | DELETE | Delete a Lambda function |
| `/api/simulate/invoke` | POST | Execute a Lambda function with an event payload |
| `/api/simulate/chaos` | POST | Configure failure/chaos injection parameters |
| `/api/logs` | GET | Fetch CloudWatch structured log entries |
| `/api/logs/clear` | POST | Clear CloudWatch log history |
| `/api/analytics` | GET | Fetch performance, latency, and error metrics |
| `/api/analytics/cost-estimate` | POST | Compute AWS monthly cost estimation |
| `/api/simulate/reset` | POST | Reset session state to defaults |

---

## 12. Deployment Instructions

### Deploying to GitHub Pages (static, no backend needed)
GitHub Pages only serves static files, so the production build runs the simulator entirely in the browser:
- `src/lib/localBackend.js` is a JavaScript port of the Flask API (`backend/*.py`) — same routes, same JSON responses.
- Python Lambda handlers execute in-browser via **Pyodide** (CPython compiled to WebAssembly); NumPy/Pandas layers are loaded on demand.
- Functions, CloudWatch logs and metrics are persisted in `localStorage`.

Steps:
1. Push the repository to GitHub (branch `main`).
2. In the repo go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds with Vite and publishes `dist/` on every push.
4. The site is served at `https://<username>.github.io/<repo-name>/`.

To use the Flask backend instead, set `VITE_API_URL` (e.g. `VITE_API_URL=http://localhost:5001`) before `npm run dev` / `npm run build`.

### Deploying to Render (full-stack with Flask backend)
1. Push your repository to GitHub using `bash git_push_guide.sh`.
2. Create a new **Web Service** on [Render.com](https://render.com).
3. Connect your GitHub repository.
4. Set **Build Command**: `pip install -r backend/requirements.txt && npm install && npm run build`
5. Set **Start Command**: `gunicorn backend.app:app`

---

## 13. Faculty Demonstration Script (2–3 Minutes)

1. **Introduction (30s)**:
   - "Good morning Professor. This project is an Educational AWS Service Simulator focused on **AWS Lambda** and **Amazon CloudWatch**."
   - "It converts Python scripts, algorithm logic, and Pandas data processing into serverless Lambda handlers."

2. **Dashboard Overview (30s)**:
   - "On the Dashboard, we see our active simulated AWS region (`us-east-1`), total invocations count, success rate, and active functions."

3. **Lambda Invocation & Handler Execution (45s)**:
   - "Under *Service Simulator*, we select `pandas-student-analytics-processor`. This function runs Pandas data filtering inside a simulated Lambda runtime layer."
   - "Click **Execute Lambda Handler**. Notice the response: HTTP Status 200 OK, Request ID, execution duration (ms), billed duration, stdout log, and structured JSON output."

4. **CloudWatch Logs & Observability (30s)**:
   - "Under *Activity / Logs*, we view the live CloudWatch log stream showing `START`, `[STDOUT]`, and `REPORT` lines with billed duration details."

5. **Enhancement & Chaos Failure Testing (45s)**:
   - "Under *Analytics & Enhancement*, we demonstrate two features:"
     - **AWS Lambda Cost Estimator**: Calculates estimated monthly USD billing based on memory allocation and request volume using official AWS pricing formulas.
     - **Chaos Failure Injection Engine**: Enable Chaos Mode with 'Execution Timeout', then run an invocation to demonstrate how a simulated 504 Gateway Timeout error is handled gracefully and logged in CloudWatch.

---

## 14. Possible Faculty Viva Questions & Answers

**Q1: Why did you choose AWS Lambda for this simulation?**  
*Answer*: AWS Lambda is the leading serverless compute service in AWS. It allows developers to run Python code on-demand in response to events without managing virtual machines, making it the ideal target for transforming Python code scripts into cloud microservices.

**Q2: How does your simulator calculate Billed Duration?**  
*Answer*: Real AWS Lambda rounds execution duration up to the nearest 100 ms (minimum 1 ms). Our simulator uses the exact formula: `billedDuration = ceil(durationMs / 100) * 100` to mirror AWS CloudWatch report behavior.

**Q3: What is the enhancement in your project beyond basic AWS simulation?**  
*Answer*: We implemented two major enhancements: (1) **Chaos Failure Injection**, which simulates realistic cloud failures (Execution Timeout, Out of Memory, Throttling) to evaluate system resilience, and (2) an interactive **AWS Lambda Cost Estimator** based on official AWS pricing math.

**Q4: How does the application preserve original Python simulator functionality?**  
*Answer*: All original Python topics (Data Types, Flowcharts, Arrays, Pandas DataFrames, Sorting algorithms, Stack/Queue operations) are preserved as pre-configured Lambda Function templates that execute inside our Python Flask sandbox.

---

## 15. Security & Best Practices
- **No Real AWS Credentials**: This is an educational simulator. No AWS Access Keys or Secret Keys are used or required.
- **Input Validation**: Bad input or invalid JSON payloads return helpful 400/500 error cards without crashing the backend server.
