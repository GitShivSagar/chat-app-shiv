import React from 'react';
import assets from '../assets/assets';
import { useAuth } from '../../context/AuthContext';

const RightSideBar = () => {
    const { selectedUser, messages, logout } = useAuth();

    const msgImages = messages.filter(m => m.image).map(m => m.image);

    return selectedUser && (
        <div className='divoneRSB d-none d-xl-block'>
            <div className='pt-5 d-flex flex-column align-items-center gap-1 fs-5 fw-light text-center mx-auto'>
                <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='profilepicRSB rounded-pill' />
                <h1 className='fs-5 fw-medium px-3 d-flex mx-auto gap-2 align-items-center'>
                    <span className='parafullnameRSB rounded-pill'>{selectedUser.fullName}</span>
                </h1>
                <span className='spanbioRSB px-1 py-1 mx-auto'>{selectedUser.bio}</span>
            </div>
            <hr className='mt-1 mb-2 border-3 border-primary' />

            <div className='divonemediaRSB'>
                <p>Media</p>
                <div className='divtwomediaRSB'>
                    {msgImages.length > 0 ? msgImages.map((url, index) => (
                        <div key={index} onClick={() => window.open(url)} className='divthreeimagesRSB'>
                            <img src={url} alt="" className='rounded-2 h-100' />
                        </div>
                    )) : (
                        <p style={{ fontSize: '12px', color: 'gray' }}>No media shared yet</p>
                    )}
                </div>
            </div>

            <button onClick={logout} className='btnlogoutRSB rounded-pill'>
                Logout
            </button>
        </div>
    );
};

export default RightSideBar;
