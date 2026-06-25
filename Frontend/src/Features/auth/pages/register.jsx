import React,{useState} from 'react';
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useauth';

export default function Register () {

  const navigate = useNavigate()
  const [username, setUsername] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const {loading, handleRegister} = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("");
    const result = await handleRegister({username,email,password})
    if(result.success){
      navigate('/')
    }else{
      setError(result.error)
    }
  }

  if(loading){
    return (<main><h1>Loading....</h1></main>)
  }

  return (
    <main>
      <div className='form-container'>
      <h1>Register</h1>
      {error && <div style={{color: "red", marginBottom: "10px"}}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className='input-group'>
          <label htmlFor='email'>Username</label>
          <input 
          onChange={(e) => {setUsername(e.target.value)}}
          type='username' id='username' placeholder='Enter Username'></input>
        </div>
        <div className='input-group'>
          <label htmlFor='username'>Email</label>
          <input 
          onChange={(e) => {setemail(e.target.value)}}
          type='email' id='email' placeholder='Enter email address'></input>
        </div>
        <div className='input-group'>
          <label htmlFor='password'>Password</label>
          <input 
          onChange={(e) => {setPassword(e.target.value)}}
          type='password' id='password' placeholder='Enter your password'></input>
        </div>

        <button className='button primary-button'>Register</button>
      </form>
      <p>Already have an account? <Link to={"/login"}>Login</Link></p>
      </div>
    </main>
    
  );
};