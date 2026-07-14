import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import { useAuth } from '../../context/AuthContext';

const Routing = () => {
    const { authUsers } = useAuth();

    return (
        <div>
            <Routes>
                <Route
                    path='/'
                    element={authUsers ? <HomePage /> : <Navigate to='/loginpage' />}
                />
                <Route
                    path='/loginpage'
                    element={!authUsers ? <LoginPage /> : <Navigate to='/' />}
                />
                <Route
                    path='/profilepage'
                    element={authUsers ? <ProfilePage /> : <Navigate to='/loginpage' />}
                />
            </Routes>
        </div>
    );
};

export default Routing;
