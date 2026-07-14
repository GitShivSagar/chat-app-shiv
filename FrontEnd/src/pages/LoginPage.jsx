import React, { useState } from 'react';
import assets from '../assets/assets';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const [currState, setcurrState] = useState("Sign up");
    const [fullName, setfullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [isDataSubmitted, setIsDataSubmitted] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (currState === "Sign up" && !isDataSubmitted) {
            setIsDataSubmitted(true);
            return;
        }

        let success = false;
        if (currState === "Sign up") {
            success = await signup(fullName, email, password, bio);
        } else {
            success = await login(email, password);
        }

        if (success) navigate('/');
    };

    return (
        <div className='divoneLP'>
            <img src={assets.logo_big} alt="" className='logobigLP' />
            <form onSubmit={onSubmitHandler} className='formLP'>
                <h2 className='currstateLP'>
                    {currState}
                    {isDataSubmitted && (
                        <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='arrowiconLP' />
                    )}
                </h2>

                {currState === "Sign up" && !isDataSubmitted && (
                    <input onChange={(e) => setfullName(e.target.value)} value={fullName} type='text' className='inputonsubmitLP' placeholder='Full Name' required />
                )}

                {!isDataSubmitted && (
                    <>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Email Address' required className='inputonsubmitLP' />
                        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Password' required className='inputonsubmitLP' />
                    </>
                )}

                {currState === "Sign up" && isDataSubmitted && (
                    <textarea onChange={(e) => setBio(e.target.value)} value={bio} rows={4} className='inputonsubmitLP' placeholder='Provide a short Bio....' required></textarea>
                )}

                <button type='submit' className='buttonLP'>
                    {currState === "Sign up" ? "Create Account" : "Login Now"}
                </button>

                <div className='checkboxdivLP'>
                    <input type="checkbox" />
                    <p className='mb-0'>Agree to the terms of use & privacy policy</p>
                </div>

                <div className='declarationdivLP'>
                    {currState === "Sign up" ? (
                        <p className='declaredparaLP'>Already have an account? <span onClick={() => { setcurrState("Login"); setIsDataSubmitted(false); }} className='declaredspanLP'>Login here</span></p>
                    ) : (
                        <p className='declaredparaLP'>Create an account <span onClick={() => setcurrState("Sign up")} className='declaredspanLP'>Click here</span></p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
