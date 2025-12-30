import React, { useState } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../features/UserSlice';

const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;
const googleClientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;

const GoogleSignIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState(null);

    const responseGoogleSuccess = async (credentialResponse) => {
        try {
            setError(null);
            const res = await axios.post(`${baseURL}/auth/google`, {
                token: credentialResponse.credential
            });
        
            if(res.status === 200 && res.data.accessToken) {
                localStorage.setItem('accessToken', res.data.accessToken);
                if (res.data.user?.refreshToken) {
                    localStorage.setItem('refreshToken', res.data.user.refreshToken);
                } else if (res.data.refreshToken) {
                    localStorage.setItem('refreshToken', res.data.refreshToken);
                }
                
                // Get current user and update Redux store
                await dispatch(getCurrentUser());
                
                // Navigate to home
                navigate('/');
            }
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            setError(error.response?.data?.message || 'Google sign-in failed. Please try again.');
            setTimeout(() => setError(null), 5000);
        }
    };

    const responseGoogleFailure = (response) => {
        console.log("Google login failed:", response);
        setError('Google sign-in was cancelled or failed.');
        setTimeout(() => setError(null), 5000);
    };

    // If Google Client ID is not configured, show message
    if (!googleClientId || googleClientId === 'your_google_client_id' || googleClientId === 'test') {
        return (
            <div className="w-full flex flex-col items-center justify-center mt-6">
                <p className="text-sm text-gray-500 mb-2">Google Sign-In not configured</p>
                <p className="text-xs text-gray-400">Add GOOGLE_CLIENT_ID to .env file</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center justify-center mt-6">
            <GoogleOAuthProvider clientId={googleClientId}>
                <GoogleLogin
                    onSuccess={responseGoogleSuccess}
                    onError={responseGoogleFailure}
                    useOneTap={false}
                />
            </GoogleOAuthProvider>
            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
};

export default GoogleSignIn;
