import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add useNavigate for manual redirect

function RegisterForm({ setIsLoggedIn, setUser }) {
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");
    const navigate = useNavigate(); // For manual redirect

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setStatus("Email and password are required!");
            return;
        }

        if (isSignup) {
            if (!name || !phone || !location) {
                setStatus("All fields are required for signup!");
                return;
            }
            if (isNaN(phone) || phone.trim() === "") {
                setStatus("Phone must be a valid number!");
                return;
            }
        }

        try {
            const endpoint = isSignup ? "/signup" : "/login";
            const payload = isSignup 
                ? { name, email, phone, location, password }
                : { email, password };
            console.log("Sending payload:", payload);
            const response = await axios.post(`http://localhost:8000${endpoint}`, payload);
            if (response.data.success) {
                setStatus(isSignup ? "Signup Successful!" : "Login Successful!");
                setUser(response.data.user);
                setIsLoggedIn(true);
                navigate('/dashboard'); // Manual redirect to ensure navigation
            } else {
                setStatus(response.data.message || (isSignup ? "Signup Failed" : "Login Failed"));
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setStatus(err.response.data.message);
            } else {
                setStatus("Error: " + err.message);
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h3>{isSignup ? "Sign Up" : "Login"} to Online Material Management</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {isSignup && (
                        <>
                            <div className="form-group">
                                <label>Name</label>
                                <input 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input 
                                    type="number"
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input 
                                    value={location} 
                                    onChange={(e) => setLocation(e.target.value)} 
                                />
                            </div>
                        </>
                    )}
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <button type="submit" className="submit-btn">
                        {isSignup ? "Sign Up" : "Login"}
                    </button>
                    <br /><br />
                    <div className="text-center mt-4">
                        <button 
                            type="button"
                            onClick={() => setIsSignup(!isSignup)} 
                            className="text-blue-500 hover:underline"
                        >
                            {isSignup ? "Already registered? Login" : "Not signed up yet? Sign Up"}
                        </button>
                    </div>
                    <div className="status-message">{status}</div>
                </form>
            </div>
        </div>
    );
}

export default RegisterForm;