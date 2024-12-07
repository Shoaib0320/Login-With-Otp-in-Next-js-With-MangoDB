'use client';
import { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [otpSent, setOtpSent] = useState(false); // Track OTP sent status

    // Function to handle OTP sending
    const handleSendOtp = async (e) => {
        e.preventDefault();

        try {
            setMessage(''); // Clear previous messages
            const res = await fetch('/api/sendOtp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message || 'OTP sent successfully.');
                setOtpSent(true); // Mark OTP as sent
            } else {
                setMessage(data.error || 'Failed to send OTP.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An unexpected error occurred while sending OTP.');
        }
    };

    // Function to handle OTP verification
    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        try {
            setMessage(''); // Clear previous messages
            const res = await fetch('/api/verifyOtp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message || 'OTP verified successfully. You are signed in.');
            } else {
                setMessage(data.error || 'Failed to verify OTP.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An unexpected error occurred while verifying OTP.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded-md shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6">Sign In with OTP</h1>
            <form>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={otpSent} // Disable email input once OTP is sent
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={otpSent} // Disable password input once OTP is sent
                    />
                </div>

                {!otpSent && (
                    <button
                        type="button"
                        className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                        onClick={handleSendOtp}
                    >
                        Send OTP
                    </button>
                )}

                {otpSent && (
                    <>
                        <div className="mb-4">
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
                            <input
                                type="text"
                                id="otp"
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleVerifyOtp}
                            className="w-full bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600 transition duration-200"
                        >
                            Verify OTP
                        </button>
                    </>
                )}

                {message && (
                    <p className={`mt-4 text-center font-semibold ${otpSent ? 'text-green-500' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}







