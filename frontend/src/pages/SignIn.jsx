import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, signUp } from '../features/UserSlice';
import { useNavigate } from 'react-router-dom';
import ErrorDialog from '../components/ErrorDialog';
import SuccessDialog from '../components/SuccessDialog';
import GoogleSignIn from '../components/GoogleSignIn';
import Spinner from '../components/Spinner';

function SignIn() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullname, setFullName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, user, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error.message);
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation for Login
    if (isLogin) {
      if (!email || !email.trim()) {
        setErrorMessage('Email is required');
        return;
      }
      if (!password || !password.trim()) {
        setErrorMessage('Password is required');
        return;
      }
    }

    // Validation for Sign Up
    if (!isLogin) {
      if (!fullname || !fullname.trim()) {
        setErrorMessage('Full name is required');
        return;
      }
      if (!email || !email.trim()) {
        setErrorMessage('Email is required');
        return;
      }
      if (!username || !username.trim()) {
        setErrorMessage('Username is required');
        return;
      }
      if (!password || !password.trim()) {
        setErrorMessage('Password is required');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
      }
    }

    if (isLogin) {
      dispatch(login({ email, password })).then((result) => {
        if (result.type.includes('fulfilled')) {
          setEmail('');
          setPassword('');
          setSuccessMessage('Login successful!');
          setTimeout(() => {
            setSuccessMessage('');
          }, 2000);
        } else {
          // Error is already handled by useEffect watching error state
        }
      });
    } else {
      dispatch(signUp({ fullname, email, username, password })).then((result) => {
        if (result.type.includes('fulfilled')) {
          setFullName('');
          setEmail('');
          setUsername('');
          setPassword('');
          setConfirmPassword('');
          setSuccessMessage('Signup successful! Please check your email to verify your account before logging in.');
          setTimeout(() => {
            setSuccessMessage('');
            setIsLogin(true); // Switch to login form
          }, 4000);
        } else {
          // Error is already handled by useEffect watching error state
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row  bg-gray-200 px-8 md:px-20">
      <div className="flex flex-col items-center justify-center lg:ml-36 w-full p-4 md:p-6 md:w-1/2">
        <h1 className="text-6xl font-bold mb-4 text-primary">VidShare</h1>
        <p className="text-xl text-black">Share your favorite videos with the world.</p>
      </div>
      <div className="flex flex-col justify-center items-center w-full p-4 md:p-6 md:w-1/2 lg:mr-36">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Login' : 'Signup'}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm">Full Name</label>
                <input
                  name="fullname"
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm">Email</label>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            {!isLogin && (
              <div>
                <label className="block text-sm">Username</label>
                <input
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm">Password</label>
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
                minLength={isLogin ? 1 : 6}
              />
              {!isLogin && password && password.length < 6 && (
                <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={
                loading || 
                (isLogin && (!email.trim() || !password.trim())) || 
                (!isLogin && (!fullname.trim() || !email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim() || password.length < 6))
              } 
              className={`w-full bg-primary text-white py-2 rounded ${
                loading || 
                (isLogin && (!email.trim() || !password.trim())) || 
                (!isLogin && (!fullname.trim() || !email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim() || password.length < 6))
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-teal-600'
              }`}
            >
              {loading ? <Spinner loading={loading} size={20} /> : isLogin ? 'Login' : 'Signup'}
            </button>



          </form>
          <div className="mt-4 text-center">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button onClick={() => setIsLogin(false)} className="text-primary hover:underline">
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button onClick={() => setIsLogin(true)} className="text-primary hover:underline">
                  Log in
                </button>
              </p>

            )}
            <div className="mt-4 flex items-center justify-center">
              <hr className='w-1/2' />
              <p className="mx-2">OR</p>
              <hr className="w-1/2" />
            </div>

            <GoogleSignIn />

          </div>
        </div>
        {errorMessage && <ErrorDialog message={errorMessage} onClose={() => setErrorMessage('')} />}


        {successMessage && <SuccessDialog message={successMessage} onClose={() => setSuccessMessage('')} />}
      </div>
    </div>
  );
}

export default SignIn;
