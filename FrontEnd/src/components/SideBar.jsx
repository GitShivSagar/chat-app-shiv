import React, { useEffect, useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SideBar = () => {
    const navigate = useNavigate();
    const { onlineUsers, logout, fetchUsers, fetchMessages, unseenMessages, selectedUser, setSelectedUser, socket, setMessages } = useAuth();

    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState("");

    const loadUsers = async () => {
        const data = await fetchUsers();
        setUsers(data);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // refresh sidebar when a new message arrives via socket
    useEffect(() => {
        if (!socket) return;
        socket.on("new message", loadUsers);
        return () => socket.off("new message", loadUsers);
    }, [socket]);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setMessages([]);
        fetchMessages(user._id);
    };

    const filteredUsers = users.filter(u =>
        u.fullName.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className={`divonesidebar p-3 ${selectedUser ? 'd-none d-md-block' : ''}`}>
            <div className='divtwosidebar'>
                <div className='d-flex justify-content-between align-items-center'>
                    <img src={assets.logo} alt='logo' className='logoimg' />
                    <div className='divfoursidebar position-relative py-1'>
                        <img src={assets.menu_icon} alt='menu' className='menuimg' />
                        <div className='divfivesidebar position-absolute border border-secondary p-2 rounded'>
                            <p onClick={() => navigate('/profilepage')} className='editprofile'>Edit Profile</p>
                            <hr className='my-2 border border-top border-secondary' />
                            <p onClick={logout} className='logout'>Logout</p>
                        </div>
                    </div>
                </div>

                <div className='searchdivsidebar py-1 mt-2 mb-3 rounded-pill d-flex align-items-center'>
                    <img src={assets.search_icon} alt='Search' className='searchimgsidebar' />
                    <input
                        type='text'
                        className='searchinputsidebar d-flex'
                        placeholder='Search User...'
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            </div>

            <div className='divsixsidebar'>
                {filteredUsers.map((user) => (
                    <div
                        onClick={() => handleSelectUser(user)}
                        key={user._id}
                        className={`divsevensidebar mb-2 rounded ${selectedUser?._id === user._id ? 'divsevencheck' : ''}`}
                    >
                        <img src={user.profilePic || assets.avatar_icon} alt='' className='userimg rounded-pill' />
                        <div className='usernamediv'>
                            <p>{user.fullName}</p>
                            {onlineUsers.includes(user._id)
                                ? <span className='online'>Online</span>
                                : <span className='offline'>Offline</span>
                            }
                        </div>
                        {unseenMessages[user._id] > 0 && (
                            <p className='afternameindex rounded-pill'>{unseenMessages[user._id]}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SideBar;
