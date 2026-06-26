import React, { useState } from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useauth'


export default function Login () {

  const navigate = useNavigate()

  const {loading, handleLogin} = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("");
    setSuccess("");
    
    const result = await handleLogin({ email, password })
    if(result.success){
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        navigate('/');
      },1500);
    }else{
      setError(result.error || "Invalid Email or Password");
    }
  }

  if(loading){
    return (<main className='loading-screen'>
            <div className='spinner'></div>
            <h2>Authenticating...</h2>
            </main>)
  }

  return (
    <main className='auth-page'>
    <div className="form-container">
      <h1>Login</h1>

      {error && <div className='feedback-message error-message'>{error}</div>}
      {success && <div className='feedback-message success-message'>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor='email'>Email</label>
          <input 
            value={email}
            onChange={(e) => {setEmail(e.target.value)}}
            type='email' id='email' placeholder='Enter email address' />
        </div>
        <div className='input-group'>
          <label htmlFor='password'>Password</label>
          <input 
            value={password}
            onChange={(e) => {setPassword(e.target.value)}}
            type='password' id='password' name='password' placeholder='Enter passowrd'/>
        </div>

        <button className='button primary-button'>Login</button>
      </form>

    <p>Don't have an account? <Link to={"/register"}>Register</Link></p>

      </div>
    </main>
  )
}

