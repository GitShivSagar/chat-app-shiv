import React, { useState, useEffect } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
    const { authUsers, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [selectedImg, setSelectedImg] = useState(null);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");

    useEffect(() => {
        if (authUsers) {
            setName(authUsers.fullName || "");
            setBio(authUsers.bio || "");
        }
    }, [authUsers]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const profileData = { fullName: name, bio };

        if (selectedImg) {
            const reader = new FileReader();
            reader.readAsDataURL(selectedImg);
            reader.onload = async () => {
                profileData.profilePic = reader.result;
                const success = await updateProfile(profileData);
                if (success) navigate('/');
            };
        } else {
            const success = await updateProfile(profileData);
            if (success) navigate('/');
        }
    };

    return (
        <div className='divonePP'>
            <div className='divtwoPP'>
                <form onSubmit={onSubmitHandler} className='formtagPP'>
                    <h3 className='fs-4'>Profile details</h3>
                    <label htmlFor="avatar" className='labelonePP'>
                        <input onChange={(e) => setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
                        <img
                            src={selectedImg ? URL.createObjectURL(selectedImg) : (authUsers?.profilePic || assets.avatar_icon)}
                            alt=""
                            className={`profilepicLP ${selectedImg ? 'rounded-pill' : ''}`}
                        />
                        Upload profile Image
                    </label>

                    <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Your name' required className='inputonsubmitLP' />

                    <textarea onChange={(e) => setBio(e.target.value)} value={bio} placeholder='Write profile bio' rows={4} required className='inputonsubmitLP'></textarea>

                    <button type='submit' className='buttonLP'>Save</button>
                </form>
                <img src={assets.logo_icon} alt="" className='logoiconPP rounded-pill' />
            </div>
        </div>
    );
};

export default ProfilePage;
