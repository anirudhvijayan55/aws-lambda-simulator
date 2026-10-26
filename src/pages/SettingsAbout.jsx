function SettingsAbout() {
  return (
    <div className="settings-about-page">
      <div className="page-header">
        <div className="badge-aws" style={{ marginBottom: 8, display: 'inline-block' }}>Educational Specs</div>
        <h1 className="page-title">AWS Service Mapping & Project Guide</h1>
        <p className="page-subtitle">Detailed conceptual mapping of Python simulator features to real AWS Lambda concepts</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 14, color: 'var(--aws-orange)' }}>
          📌 How this Project Maps to the Real AWS Service
        </h2>
        <div className="table-container">
          <table className="aws-table">
            <thead>
              <tr>
                <th>Original Python Feature</th>
                <th>Corresponding AWS Concept</th>
                <th>AWS API / Service Operation</th>
                <th>Web Console Implementation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Python Code Runner & Sandbox</strong></td>
                <td>AWS Lambda Compute Runtime</td>
                <td><code>lambda:Invoke</code></td>
                <td>Interactive Code Editor & Handler Invocation Studio</td>
              </tr>
              <tr>
                <td><strong>Module 5: Pandas/NumPy Data Processing</strong></td>
                <td>AWS Lambda Data Science Layer</td>
                <td>Lambda Layer Integration</td>
                <td>Pre-packaged Pandas dataframe filter & aggregation template</td>
              </tr>
              <tr>
                <td><strong>Module 1 & 2: Flowcharts & Decisions</strong></td>
                <td>AWS Step Functions / Workflow</td>
                <td><code>states:StartExecution</code></td>
                <td>Decision tree flow evaluator Lambda function</td>
              </tr>
              <tr>
                <td><strong>Module 3: Sorting & Search Visualizers</strong></td>
                <td>Compute Benchmarking</td>
                <td>Lambda Execution Profiling</td>
                <td>Bubble sort & binary search metric evaluator</td>
              </tr>
              <tr>
                <td><strong>Module 4: Stack & Queue Handlers</strong></td>
                <td>Amazon SQS Event Source Trigger</td>
                <td><code>sqs:SendMessage</code> → Lambda</td>
                <td>Queue batch payload dispatcher handler</td>
              </tr>
              <tr>
                <td><strong>Activity & Execution Output</strong></td>
                <td>Amazon CloudWatch Logs</td>
                <td><code>logs:FilterLogEvents</code></td>
                <td>CloudWatch structured stream & Billed Duration reports</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>
          🎯 Faculty Demonstration Flow (2–3 Minutes)
        </h2>
        <ol style={{ paddingLeft: 20, fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <li><strong>Step 1 (Dashboard Overview):</strong> Show the AWS Lambda Console Dashboard. Point out the active simulated region, Lambda functions count, and CloudWatch stream preview.</li>
          <li><strong>Step 2 (Lambda Invocation):</strong> Navigate to <em>Service Simulator</em>. Select <code>pandas-student-analytics-processor</code>. Explain how Pandas data processing runs inside the Lambda runtime. Click <strong>Execute Lambda Handler</strong>. Show status 200 OK, Billed Duration, stdout logs, and returned JSON payload.</li>
          <li><strong>Step 3 (CloudWatch Logs):</strong> Click <em>Activity / Logs</em>. Show live CloudWatch <code>START</code>, <code>[STDOUT]</code>, and <code>REPORT</code> log lines with billed duration.</li>
          <li><strong>Step 4 (Enhancement Demo):</strong> Click <em>Analytics & Enhancement</em>. Demonstrate the <strong>AWS Lambda Cost Estimator</strong> by sliding monthly requests to 5,000,000. Then enable <strong>Chaos Failure Injection</strong> (Execution Timeout), run an invocation in the simulator, and show the simulated 504 error response and CloudWatch alert.</li>
          <li><strong>Step 5 (Reset):</strong> Click <strong>Reset Simulation</strong> in the top bar to return to initial clean state.</li>
        </ol>
      </div>
    </div>
  )
}

export default SettingsAbout
