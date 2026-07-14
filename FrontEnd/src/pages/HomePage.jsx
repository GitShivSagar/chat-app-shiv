import React from 'react'
import "../index.css"
import "../main.css"
import SideBar from '../components/SideBar'
import ChatContainer from '../components/ChatContainer'
import RightSideBar from '../components/RightSideBar'
import { useAuth } from '../../context/AuthContext'

const HomePage = () => {
  const { selectedUser } = useAuth()

  return (
    <div className='homefirstdiv'>
      <div className={`homeseconddiv position-relative overflow-hidden border border-secondary rounded-4 ${selectedUser ? 'threecollayout' : 'twocollayout'}`}>
        <SideBar />
        <ChatContainer />
        {selectedUser && <RightSideBar />}
      </div>
    </div>
  )
}

export default HomePage
