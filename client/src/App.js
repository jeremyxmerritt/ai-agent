import React, { useState } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:3000';
const USER_ID = 'job-search-user';

function App() {
  const [step, setStep] = useState(1);
  const [roleInput, setRoleInput] = useState('');
  const [resumeInput, setResumeInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    if (!roleInput.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/agent/context`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: USER_ID,
          type: 'qa',
          data: {
            question: 'What type of role are you looking for?',
            answer: roleInput.trim()
          }
        })
      });

      if (response.ok) {
        setStep(2);
        setRoleInput('');
      } else {
        console.error('Failed to submit role information');
      }
    } catch (error) {
      console.error('Error submitting role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeSubmit = async (e) => {
    e.preventDefault();
    if (!resumeInput.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/agent/context`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: USER_ID,
          type: 'document',
          data: {
            title: 'resume',
            content: resumeInput.trim()
          }
        })
      });

      if (response.ok) {
        setStep(3);
        setResumeInput('');
      } else {
        console.error('Failed to submit resume');
      }
    } catch (error) {
      console.error('Error submitting resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action) => {
    console.log(`${action} clicked - ready for implementation`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Job Search Agent</h1>
        
        {step === 1 && (
          <div className="step-container">
            <form onSubmit={handleRoleSubmit}>
              <label htmlFor="role-input">What type of role are you looking for?</label>
              <input
                id="role-input"
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                placeholder="e.g., Software Engineer, Product Manager, Data Scientist"
                disabled={loading}
              />
              <button type="submit" disabled={loading || !roleInput.trim()}>
                {loading ? 'Submitting...' : 'Next'}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="step-container">
            <form onSubmit={handleResumeSubmit}>
              <label htmlFor="resume-input">
                Provide your resume below. (Copy/paste for now--don't worry about formatting)
              </label>
              <textarea
                id="resume-input"
                value={resumeInput}
                onChange={(e) => setResumeInput(e.target.value)}
                placeholder="Paste your resume content here..."
                rows="15"
                disabled={loading}
              />
              <button type="submit" disabled={loading || !resumeInput.trim()}>
                {loading ? 'Submitting...' : 'Next'}
              </button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="step-container">
            <h2>What would you like to do?</h2>
            <div className="action-buttons">
              <button onClick={() => handleActionClick('Research a company')}>
                Research a company
              </button>
              <button onClick={() => handleActionClick('Write a cover letter')}>
                Write a cover letter
              </button>
              <button onClick={() => handleActionClick('Customize my resume')}>
                Customize my resume
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
