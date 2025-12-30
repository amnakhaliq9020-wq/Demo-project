import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL || 'http://localhost:5000';

const VerifyEmail = () => {
    const { userId, token } = useParams();
    const [message, setMessage] = useState('Verifying your email...');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await axios.post(`${baseURL}/users/verify/${userId}/${token}`);
                setMessage(response.data.message || 'Email verified successfully!');
                setIsSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                setMessage(error.response?.data?.message || 'Error verifying email. The link may be expired or invalid.');
                setIsSuccess(false);
            }
        };

        if (userId && token) {
            verifyUser();
        }
    }, [userId, token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                {isSuccess ? (
                    <div>
                        <div className="text-green-500 text-6xl mb-4">✓</div>
                        <h1 className="text-2xl font-bold text-green-600 mb-4">Email Verified!</h1>
                        <p className="text-gray-600 mb-4">{message}</p>
                        <p className="text-sm text-gray-500">Redirecting to login page...</p>
                    </div>
                ) : (
                    <div>
                        <div className="text-red-500 text-6xl mb-4">✗</div>
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h1>
                        <p className="text-gray-600 mb-4">{message}</p>
                        <button 
                            onClick={() => navigate('/login')}
                            className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600"
                        >
                            Go to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
