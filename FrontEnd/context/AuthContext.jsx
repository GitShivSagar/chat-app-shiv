import { createContext, useState, useEffect, useContext, useRef } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const AuthContext = createContext();

const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendURL;

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUsers, setAuthUsers] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // shared chat state — lifted here so Sidebar + ChatContainer + RightSideBar stay in sync
    const [messages, setMessages] = useState([]);
    const [unseenMessages, setUnseenMessages] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);

    const selectedUserRef = useRef(null);

    // keep selectedUserRef always pointing to latest selectedUser
    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    // set token header synchronously at module level whenever token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;
            checkAuth();
        } else {
            delete axios.defaults.headers.common["token"];
            setAuthUsers(null);
        }
    }, [token]);

    const socketRef = useRef(null);

    const connectSocket = (userId) => {
        // disconnect existing socket before creating a new one
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        const newSocket = io(backendURL, { query: { userId } });
        newSocket.on("getOnlineUsers", (users) => setOnlineUsers(users));
        newSocket.on("new message", (newMsg) => {
            const current = selectedUserRef.current;
            if (!current) return;
            if (newMsg.senderId === current._id || newMsg.receiverId === current._id) {
                setMessages((prev) => {
                    if (prev.some((m) => m._id === newMsg._id)) return prev;
                    return [...prev, newMsg];
                });
            }
        });
        socketRef.current = newSocket;
        setSocket(newSocket);
    };

    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");
            if (data.success) {
                setAuthUsers(data.userdata);
                connectSocket(data.userdata._id);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    // fetch users + unseen counts for sidebar
    const fetchUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUnseenMessages(data.unseenMessages);
                return data.userdata;
            }
            return [];
        } catch (error) {
            console.error(error.message);
            return [];
        }
    };

    // fetch messages for a selected user and mark them seen
    const fetchMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);
                // clear unseen count for this user since backend marks them seen
                setUnseenMessages((prev) => {
                    const updated = { ...prev };
                    delete updated[userId];
                    return updated;
                });
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    // send a message (text or image)
    const sendMessage = async (receiverId, text, imageFile) => {
        try {
            const payload = { text };

            if (imageFile) {
                const base64 = await toBase64(imageFile);
                payload.image = base64;
            }

            const { data } = await axios.post(`/api/messages/send/${receiverId}`, payload);
            if (data.success) {
                setMessages((prev) => [...prev, data.newMessage]);
                return true;
            }
            return false;
        } catch (error) {
            console.error(error.message);
            return false;
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await axios.post("/api/auth/login", { email, password });
            if (data.success) {
                localStorage.setItem("token", data.token);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                setAuthUsers(data.userdata);
                connectSocket(data.userdata._id);
                toast.success(data.msg);
                return true;
            } else {
                toast.error(data.msg);
                return false;
            }
        } catch (error) {
            toast.error("Login failed. Please try again.");
            return false;
        }
    };

    const signup = async (fullName, email, password, bio) => {
        try {
            const { data } = await axios.post("/api/auth/signup", { fullName, email, password, bio });
            if (data.success) {
                localStorage.setItem("token", data.token);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                setAuthUsers(data.record);
                connectSocket(data.record._id);
                toast.success(data.msg);
                return true;
            } else {
                toast.error(data.msg);
                return false;
            }
        } catch (error) {
            toast.error("Signup failed. Please try again.");
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["token"];
        setToken(null);
        setAuthUsers(null);
        setOnlineUsers([]);
        setMessages([]);
        setUnseenMessages({});
        setSelectedUser(null);
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setSocket(null);
        }
        toast.success("Logged out");
    };

    const updateProfile = async (profileData) => {
        try {
            const { data } = await axios.put("/api/auth/updateprofile", profileData);
            if (data.success) {
                setAuthUsers(data.userdata);
                toast.success("Profile updated");
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error("Failed to update profile. Please try again.");
            return false;
        }
    };

    const value = {
        axios,
        token,
        authUsers,
        onlineUsers,
        socket,
        messages,
        setMessages,
        unseenMessages,
        setUnseenMessages,
        selectedUser,
        setSelectedUser,
        fetchUsers,
        fetchMessages,
        sendMessage,
        login,
        signup,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// helper: compress image using canvas then convert to base64
const toBase64 = (file) => new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
        const MAX = 800;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
            if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
            else { width = Math.round(width * MAX / height); height = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = reject;
    img.src = url;
});

export const useAuth = () => useContext(AuthContext);
