import React, { useEffect, useRef, useState } from 'react';
import assets from '../assets/assets';
import formatmsgtime from '../utils/utilities';
import { useAuth } from '../../context/AuthContext';

const ChatContainer = () => {
    const { authUsers, socket, messages, setMessages, selectedUser, setSelectedUser, sendMessage } = useAuth();
    const scrollEnd = useRef();
    const imgInputRef = useRef();

    const [msgText, setMsgText] = useState("");
    const [selectedImg, setSelectedImg] = useState(null);

    // listen for real-time incoming messages
    useEffect(() => {
        if (!socket || !selectedUser) return;
        const handleNewMessage = (newMsg) => {
            if (newMsg.senderId === selectedUser._id) {
                setMessages((prev) => [...prev, newMsg]);
            }
        };
        socket.on("new message", handleNewMessage);
        return () => socket.off("new message", handleNewMessage);
    }, [socket, selectedUser]);

    // auto scroll to bottom on new message
    useEffect(() => {
        if (scrollEnd.current) {
            scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!msgText.trim() && !selectedImg) return;
        const success = await sendMessage(selectedUser._id, msgText, selectedImg);
        if (success) {
            setMsgText("");
            setSelectedImg(null);
            // reset file input so same image can be re-selected
            if (imgInputRef.current) imgInputRef.current.value = "";
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSend();
    };

    return selectedUser ? (
        <div className='divonecc position-relative'>
            {/* Header */}
            <div className='d-flex align-items-center py-1 mx-3 my-3 border-bottom border-secondary gap-3'>
                <img src={selectedUser.profilePic || assets.avatar_icon} alt='profilePic' className='rounded-pill userimgcc' />
                <p className='d-flex flex-fill align-items-center gap-2 usernameparacc'>
                    {selectedUser.fullName}
                    <span className='rounded-pill usernamespancc'></span>
                </p>
                <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='arrowiconcc d-block d-md-none' />
                <img src={assets.help_icon} alt="" className='helpiconcc d-none d-md-block' />
            </div>

            {/* Messages */}
            <div className='divonechatareacc p-3'>
                {messages.map((msg, index) => (
                    <div key={index} className={`divtwomsgcc gap-2 ${msg.senderId === authUsers?._id ? 'mymsg' : 'othersmsg'}`}>
                        {msg.image ? (
                            <img src={msg.image} alt="" className='imgchatareacc mb-2 rounded-3' />
                        ) : (
                            <p className={`parachatareacc p-2 rounded-3 mb-2 ${msg.senderId === authUsers?._id ? 'paracheckchatareacc' : 'parachchatareacc'}`}>
                                {msg.text}
                            </p>
                        )}
                        <div className='divthreechatareacc d-flex flex-column align-items-center'>
                            <img
                                src={msg.senderId === authUsers?._id
                                    ? (authUsers?.profilePic || assets.avatar_icon)
                                    : (selectedUser.profilePic || assets.avatar_icon)}
                                alt=""
                                className='icononmsgchatareacc rounded-pill'
                            />
                            <p className='timeparachatareacc'>{formatmsgtime(msg.createdAt)}</p>
                        </div>
                    </div>
                ))}
                {selectedImg && (
                    <div className='d-flex justify-content-end mb-2'>
                        <img src={URL.createObjectURL(selectedImg)} alt="preview" className='imgchatareacc rounded-3' style={{ opacity: 0.7 }} />
                    </div>
                )}
                <div ref={scrollEnd}></div>
            </div>

            {/* Bottom Area */}
            <div className='divoneBA gap-3'>
                <div className='divtwoBA rounded-pill px-3'>
                    <input
                        type='text'
                        placeholder='Send a message'
                        className='inputmsgBA rounded-3'
                        value={msgText}
                        onChange={(e) => setMsgText(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <input
                        type='file'
                        id='image'
                        accept='image/png, image/jpeg'
                        hidden
                        ref={imgInputRef}
                        onChange={(e) => setSelectedImg(e.target.files[0])}
                    />
                    <label htmlFor='image'>
                        <img src={assets.gallery_icon} alt='' className='galleryicon' />
                    </label>
                </div>
                <img src={assets.send_button} alt='' className='sendbutton' onClick={handleSend} />
            </div>
        </div>
    ) : (
        <div className='checkdivcc align-items-center justify-content-center gap-2 h-100'>
            <img src={assets.logo_icon} alt="" className='logoimgcheckcc' />
            <p className='checkparacc'>Chat anytime, anywhere</p>
        </div>
    );
};

export default ChatContainer;
