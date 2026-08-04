import { useNavigate } from 'react-router-dom';
import '../style/landing.scss';
import '../style/extra.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page navy-gradient-bg">
      {/* Navigation */}
      <nav className="landing-nav nav-gradient">
        <div className="nav-container">
          <div className="logo">
            <img src="/logoo.png" alt="Interview AI Logo" className="logo-img" />
            <span>Interview AI</span>
          </div>
          <div className="nav-links">
            <button onClick={() => navigate('/login')} className="nav-btn nav-btn--login">
              Login
            </button>
            <button onClick={() => navigate('/register')} className="nav-btn nav-btn--signup nav-gradient-btn">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge badge-gradient">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="16 12 12 8 8 12" />
              <line x1="12" y1="16" x2="12" y2="8" />
            </svg>
            <span>Powered by Advanced AI Technology</span>
          </div>
          
          <h1 className="hero-title">
            Land Your Dream Job with
            <span className="gradient-text hero-gradient-text"> AI-Powered </span>
            Interview Preparation
          </h1>
          
          <p className="hero-description">
            Transform your resume into a winning interview strategy. Our AI analyzes job descriptions 
            and creates personalized preparation plans tailored to your unique profile.
          </p>
          
          <div className="hero-cta">
            <button onClick={() => navigate('/register')} className="cta-btn cta-btn--primary gradient-primary shadow-glow">
              Start Your Free Analysis
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="cta-btn cta-btn--secondary">
              See How It Works
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">95%</span>
              <span className="stat-label">Success Rate</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">30 sec</span>
              <span className="stat-label">Analysis Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-header">
          <span className="section-badge">Features</span>
          <h2 className="section-title">Everything You Need to Succeed</h2>
          <p className="section-description">
            Comprehensive AI-powered tools designed to give you a competitive edge
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card card-gradient-hover">
            <div className="feature-icon feature-icon--purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h3 className="feature-title">Smart Resume Analysis</h3>
            <p className="feature-description">
              AI-powered deep analysis of your resume to identify strengths, gaps, and opportunities for improvement.
            </p>
          </div>

          <div className="feature-card card-gradient-hover">
            <div className="feature-icon feature-icon--blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="feature-title">Job Description Matching</h3>
            <p className="feature-description">
              Instantly compare your profile against any job posting and receive a detailed compatibility score.
            </p>
          </div>

          <div className="feature-card card-gradient-hover">
            <div className="feature-icon feature-icon--green">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="feature-title">Personalized Strategy</h3>
            <p className="feature-description">
              Get custom interview preparation plans tailored to your experience and target role requirements.
            </p>
          </div>

          <div className="feature-card card-gradient-hover">
            <div className="feature-icon feature-icon--orange">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <h3 className="feature-title">Instant Reports</h3>
            <p className="feature-description">
              Receive comprehensive analysis reports in seconds, complete with actionable insights and recommendations.
            </p>
          </div>

          <div className="feature-card card-gradient-hover">
            <div className="feature-icon feature-icon--pink">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="feature-title">Multiple Profiles</h3>
            <p className="feature-description">
              Save and manage different interview strategies for various roles and career paths.
            </p>
          </div>

          <div className="feature-card card-gradient-hover">
            <div className="feature-icon feature-icon--cyan">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
            </div>
            <h3 className="feature-title">AI-Powered Insights</h3>
            <p className="feature-description">
              Leverage cutting-edge AI to uncover hidden patterns and optimize your interview performance.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <span className="section-badge">Process</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-description">
            Get started in just three simple steps
          </p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <h3 className="step-title">Upload Your Resume</h3>
            <p className="step-description">
              Upload your resume or quickly describe your experience. We support PDF and DOCX formats.
            </p>
          </div>

          <div className="step-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h3 className="step-title">Add Job Description</h3>
            <p className="step-description">
              Paste the job description of your target position for accurate analysis and matching.
            </p>
          </div>

          <div className="step-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
            </div>
            <h3 className="step-title">Get Your Strategy</h3>
            <p className="step-description">
              Receive your personalized interview strategy with insights, tips, and practice questions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-bottom">
          <p>&copy; 2026 Interview AI. All rights reserved.</p>
          <div className="social-links">
            <a href="#twitter" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
            <a href="#linkedin" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="#github" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
