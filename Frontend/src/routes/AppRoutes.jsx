import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import UserRegister from '../pages/auth/UserRegister';
import ChooseRegister from '../pages/auth/ChooseRegister';
import UserLogin from '../Pages/auth/UserLogin';
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import Home from '../Pages/general/Home'
import Saved from '../pages/general/Saved';
import BottomNav from '../components/BottomNav';
import CreateFood from '../pages/food-partner/CreateFood';
import Profile from '../pages/food-partner/Profile';

// Route guard - redirects to login if no user
const ProtectedRoute = ({ element }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            localStorage.clear();
            return null;
        }
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Listen for storage changes
        const handleStorageChange = () => {
            const savedUser = localStorage.getItem('user');
            console.log("🔐 Storage changed - user:", savedUser);
            try {
                const parsedUser = savedUser ? JSON.parse(savedUser) : null;
                setUser(parsedUser);
            } catch {
                console.log("🔐 Corrupted user - clearing");
                localStorage.clear();
                setUser(null);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    if (!user) {
        console.log("🔐 NO USER - showing login");
        return <UserLogin />;
    }
    console.log("🔐 USER EXISTS - showing protected content");
    return element;
};

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<ChooseRegister />} />
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
                <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
                <Route path="/" element={<ProtectedRoute element={<><Home /> <BottomNav /></>} />} />
                <Route path="/saved" element={<ProtectedRoute element={<><Saved /><BottomNav /></>} />} />
                <Route path="/create-food" element={<ProtectedRoute element={<CreateFood />} />} />
                <Route path="/food-partner/:id" element={<ProtectedRoute element={<Profile />} />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes