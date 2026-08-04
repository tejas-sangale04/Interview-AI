import { useState } from 'react';
import '../style/jobsearch.scss';

const JobSearch = () => {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('India');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Helper function to extract date from job object
  const getJobDate = (job) => {
    return (
      job.posted_time ||
      job.postedTime ||
      job.posted_date ||
      job.postingDate ||
      job.posting_date ||
      job.date ||
      job.datePosted ||
      job.timestamp ||
      null
    );
  };

  // Helper function to extract URL from job object
  const getJobUrl = (job) => {
    return (
      job.url ||
      job.job_url ||
      job.jobUrl ||
      job.link ||
      job.job_link ||
      job.jobLink ||
      job.apply_url ||
      job.applyUrl ||
      null
    );
  };

  // Helper function to parse date strings and return timestamp for sorting
  const parseDate = (dateStr) => {
    if (!dateStr) return 0;
    
    // Handle various date formats
    // "X days ago", "X hours ago", "X months ago"
    const timeAgoMatch = dateStr.match(/(\d+)\s+(day|hour|month|week|minute)s?\s+ago/i);
    if (timeAgoMatch) {
      const amount = parseInt(timeAgoMatch[1]);
      const unit = timeAgoMatch[2].toLowerCase();
      const now = new Date();
      
      if (unit === 'minute') now.setMinutes(now.getMinutes() - amount);
      else if (unit === 'hour') now.setHours(now.getHours() - amount);
      else if (unit === 'day') now.setDate(now.getDate() - amount);
      else if (unit === 'week') now.setDate(now.getDate() - amount * 7);
      else if (unit === 'month') now.setMonth(now.getMonth() - amount);
      
      return now.getTime();
    }
    
    // Try to parse as standard date
    try {
      return new Date(dateStr).getTime();
    } catch {
      return 0;
    }
  };

  // Sort jobs by date (latest first)
  const sortJobsByDate = (jobsList) => {
    return [...jobsList].sort((a, b) => {
      const dateA = getJobDate(a);
      const dateB = getJobDate(b);
      return parseDate(dateB) - parseDate(dateA);
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!role.trim() || !location.trim()) {
      setError('Both role and location are required');
      return;
    }

    setLoading(true);
    setError('');
    setJobs([]);

    try {
      // Combine location with country
      const fullLocation = country === 'India' 
        ? `${location.trim()}, ${country}`
        : location.trim();

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/jobs/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          role: role.trim(),
          location: fullLocation,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log('Jobs received:', data.data.jobs);
        if (data.data.jobs.length > 0) {
          console.log('Sample job object:', data.data.jobs[0]);
          console.log('Job URL field:', getJobUrl(data.data.jobs[0]));
        }
        // Sort jobs by date (latest first)
        const sortedJobs = sortJobsByDate(data.data.jobs);
        setJobs(sortedJobs);
        setSearched(true);
      } else {
        setError(data.message || 'Failed to fetch jobs');
      }
    } catch (err) {
      setError(`Failed to search jobs: ${err.message}`);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-search-page">
      <div className="search-container">
        <h1 className="page-title">Find Your Next Opportunity</h1>
        <p className="page-subtitle">Search for jobs that match your skills and location</p>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Role / Keywords</label>
              <input
                type="text"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Software Engineer, React Developer"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">City / Location</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Pune, Mumbai, Bangalore"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="form-input"
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="Singapore">Singapore</option>
              </select>
            </div>

            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Searching...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  Search Jobs
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}
      </div>

      {loading && (
        <div className="loading-state">
          <div className="loader"></div>
          <p>Searching for jobs...</p>
        </div>
      )}

      {searched && !loading && jobs.length === 0 && (
        <div className="no-results">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3>No jobs found</h3>
          <p>Try different keywords or location</p>
        </div>
      )}

      {jobs.length > 0 && (
        <div className="results-container">
          <div className="results-header">
            <h2>{jobs.length} Jobs Found</h2>
          </div>

          <div className="jobs-grid">
            {jobs.map((job, index) => {
              const jobUrl = getJobUrl(job);
              return (
                <a 
                  key={index} 
                  href={jobUrl || '#'} 
                  target={jobUrl ? "_blank" : "_self"}
                  rel={jobUrl ? "noopener noreferrer" : undefined}
                  className={`job-card ${!jobUrl ? 'job-card--disabled' : ''}`}
                  onClick={(e) => {
                    if (!jobUrl) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="job-card-header">
                    <h3 className="job-title">{job.title}</h3>
                    <span className="job-company">{job.company}</span>
                  </div>

                  <div className="job-details">
                    {job.location && (
                      <div className="job-detail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {job.location}
                      </div>
                    )}

                    {getJobDate(job) && (
                      <div className="job-detail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {getJobDate(job)}
                      </div>
                    )}
                  </div>

                  {jobUrl && (
                    <div className="apply-btn-container">
                      <span className="apply-btn">
                        View Job
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </span>
                    </div>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearch;
