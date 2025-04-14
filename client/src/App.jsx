import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import Dashboard from "./Dashboard";
import './styles.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    return (
        <BrowserRouter>
            <h1 className="text-blue-500 text-center">Online Material Management System</h1>
            <Routes>
                <Route 
                    path="/" 
                    element={isLoggedIn ? <Navigate to="/dashboard" /> : <RegisterForm setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
                />
                <Route 
                    path="/dashboard" 
                    element={isLoggedIn && user ? <Dashboard setIsLoggedIn={setIsLoggedIn} user={user} /> : <Navigate to="/" />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;