import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

const API_BASE_URL = 'http://localhost:3000';
const USER_ID = 'job-search-user';

function App() {
  const [step, setStep] = useState(1);
  const [roleInput, setRoleInput] = useState('');
  const [resumeInput, setResumeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [researchResult, setResearchResult] = useState(null);

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
    if (action === 'Research a company') {
      setStep(4);
    } else {
      console.log(`${action} clicked - ready for implementation`);
    }
  };

  const handleCompanyResearch = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setLoading(true);
    try {
      const prompt = `I am thinking about applying for a role at the company ${companyName.trim()}, and I would like to learn the following:

- Is the company public, private, or a startup?
- If a startup, tell me about their funding?
- Are they profitable?
- How does the company make money?
- Tell me about their business outlook.
- Tell me about employee sentiment over the last 2 years. If there's a lot of info, organize by department, such as software engineering, product, service, human resources, sales, etc. If there isn't enough info by department, summarize the sentiment as a whole. Focus on work/life balance, confidence in leadership, salary and benefits, mission, satisfaction with co-workers.

Organize the response into logical sections. First, info about the company, funding and business outlook and then move onto employee sentiment.`;

      const response = await fetch(`${API_BASE_URL}/agent/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: USER_ID,
          taskType: 'research',
          prompt: prompt,
          options: {
            includeContext: true,
            maxTokens: 2000
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setResearchResult(result.response);
        setStep(5);
      } else {
        console.error('Research failed:', result.error);
        alert('Research failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during research:', error);
      alert('Error during research. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(researchResult).then(() => {
      alert('Research copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    });
  };

  const handleBackToTasks = () => {
    setStep(3);
    setCompanyName('');
    setResearchResult(null);
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

        {step === 4 && (
          <div className="step-container">
            <form onSubmit={handleCompanyResearch}>
              <label htmlFor="company-input">Company Name</label>
              <input
                id="company-input"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name (e.g., Google, Microsoft, Stripe)"
                disabled={loading}
              />
              <button type="submit" disabled={loading || !companyName.trim()}>
                {loading ? 'Researching...' : 'Research'}
              </button>
            </form>
          </div>
        )}

        {step === 5 && (
          <div className="step-container">
            <div className="research-results">
              <h2>Research Results</h2>
              <div className="research-content">
                {researchResult && (
                  <div className="research-text">
                    <ReactMarkdown>{researchResult}</ReactMarkdown>
                  </div>
                )}
              </div>
              <div className="research-actions">
                <button onClick={handleCopyToClipboard} className="copy-button">
                  Copy to Clipboard
                </button>
                <button onClick={handleBackToTasks} className="back-button">
                  Back to Tasks
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
