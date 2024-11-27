// src/App.js
import { useState } from 'react';
import './App.css';

function App() {
  const [cronExpression, setCronExpression] = useState('');
  const [command, setCommand] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const [minutes, hours, day_of_month, month, day_of_week] = cronExpression.trim().split(/\s+/);
      
      if (!minutes || !hours || !day_of_month || !month || !day_of_week) {
        throw new Error('Invalid cron expression format');
      }

      const response = await fetch('https://backend-decrontab.onrender.com/api/v1/validate-crontab', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          minutes,
          hours,
          day_of_month,
          month,
          day_of_week,
          command
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to validate expression');
      }
      
      setResult(data);
    } catch (error) {
      setError(error.message);
      setResult(null);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Crontab Expression Validator</h1>
        <p className="subtitle">Validate and understand your cron expressions</p>
      </div>

      <div className="main-content">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Cron Expression</label>
            <input
              type="text"
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              placeholder="* * * * *"
              className="cron-input"
            />
            <div className="input-help">Format: minute hour day-of-month month day-of-week</div>
          </div>

          <div className="input-group">
            <label>Command</label>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Enter command to execute"
              className="command-input"
            />
          </div>

          <button type="submit" className="submit-button">
            Validate Expression
          </button>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {result && (
          <div className="result-container">
            <div className="result-section">
              <h3>Expression</h3>
              <code className="expression-code">{result.expression}</code>
            </div>

            <div className="result-section">
              <h3>Explanation</h3>
              <p>{result.explanation}</p>
            </div>

            <div className="result-section">
              <h3>Next Execution Times</h3>
              <ul className="execution-times">
                {result.next_executions.map((time, index) => (
                  <li key={index}>{time}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="examples-container">
          <h3>Common Examples</h3>
          <div className="examples-grid">
            <div className="example-item">
              <code>* * * * *</code>
              <span>Every minute</span>
            </div>
            <div className="example-item">
              <code>*/15 * * * *</code>
              <span>Every 15 minutes</span>
            </div>
            <div className="example-item">
              <code>0 * * * *</code>
              <span>Every hour</span>
            </div>
            <div className="example-item">
              <code>0 0 * * *</code>
              <span>Every day at midnight</span>
            </div>
            <div className="example-item">
              <code>0 9 * * 1-5</code>
              <span>Every weekday at 9 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;