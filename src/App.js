// src/App.js
import { useState } from 'react';
import './App.css';

function App() {
  const [cronExpression, setCronExpression] = useState('');
  const [command, setCommand] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

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
    finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Crontab Expression Validator</h1>
        <p className="subtitle">Validate and understand your cron expressions</p>
      </div>

      <div className="main-content">
        <div className="info-card">
          <h3>What is a Crontab?</h3>
          <p>
            Crontab (CRON TABle) is a Unix/Linux utility that allows users to schedule tasks to run
            automatically at specified intervals. It is a powerful tool for automation that enables
            users to manage repeated tasks efficiently. For. eg., Running a script at regular intervals.
          </p>
          <div className="examples-container">
            <h3>Common Examples</h3>
            <div className="examples-grid">
              <div className="example-item">
                <code>* * * * *</code>
                <span>Your command runs every minute</span>
              </div>
              <div className="example-item">
                <code>*/15 * * * *</code>
                <span>Your command runs every 15 minutes</span>
              </div>
              <div className="example-item">
                <code>0 * * * *</code>
                <span>Your command runs every hour</span>
              </div>
              <div className="example-item">
                <code>0 0 * * *</code>
                <span>Your command runs every day at midnight</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Enter your cron expression</label>
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
              placeholder="It can be a shell or bash file or any command like ls, etc."
              className="command-input"
            />
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? (
              <div className="loader">
                <div className="spinner"></div>
                <span>Validating...</span>
              </div>
            ) : (
              'Validate Expression'
            )}
          </button>


        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {result && (
          <div className={`result-container ${isLoading ? 'loading' : ''}`}>
            <div className="result-section">
              <h3>Your cron job's expression looks like</h3>
              <code className="expression-code">{result.expression}</code>
            </div>

            <div className="result-section">
              <h3>What does my expression mean?
              </h3>
              <p>Your command executes {result.explanation}</p>
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

        <div className="footer">
          <span>
            Built by{' '}
            <a
              href='https://kashyab.vercel.app/'
              target="_blank"
              rel="noopener noreferrer"
            >
              Kashyab Murali
            </a>
            {' '} in November 2024
          </span>
        </div>


      </div>
    </div>
  );
}

export default App;