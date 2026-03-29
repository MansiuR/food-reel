import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {toast} from 'react-toastify'

const UserProfile = ({ user }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    // THE SAFETY CHECK IS BACK: If no user data, don't crash, just hide the profile icon
    if (!user) {
        return null; 
    }

    const isFoodPartner = Boolean(user.name); 
    const displayName = user.fullName || user.name || 'User';
    const initial = displayName.charAt(0).toUpperCase();

    const handleLogout = async () => {
        try {
            const logoutUrl = isFoodPartner 
                ? 'http://localhost:3000/api/auth/food-partner/logout' 
                : 'http://localhost:3000/api/auth/user/logout';

            await axios.post(logoutUrl, {}, { withCredentials: true });
            localStorage.removeItem('user'); // Clear user data from localStorage
            toast.success('Logout successful');
            navigate('/'); 
        } catch (error) {
            toast.error('Logout failed');
            console.error("Logout failed:", error);
        }finally{
          setIsOpen(false); // Close the dropdown after logout attempt
        }
    };

    return (
        <div className="fixed top-4 left-4 z-50">
            {/* The Circle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xl font-bold shadow-lg border-2 border-white hover:scale-105 transition-transform"
            >
                {initial}
            </button>

            {/* The Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-14 left-0 mt-2 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 flex flex-col items-center border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center flex-wrap justify-center gap-2">
                        {displayName}
                        {isFoodPartner && (
                            <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-300 uppercase tracking-wide">
                                Partner
                            </span>
                        )}
                    </h2>
                    <p className="text-gray-500 text-sm mb-6">{user.email}</p>

                    {!isFoodPartner && (
                        <div className="mb-4 w-full text-center bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                            <p className="text-xs text-gray-600 mb-1">Want to post food videos?</p>
                            <Link to="/food-partner/register" className="text-indigo-600 hover:text-indigo-800 text-xs font-bold">
                                Join as Partner &rarr;
                            </Link>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 flex items-center cursor-pointer justify-center gap-2"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;