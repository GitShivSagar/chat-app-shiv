import React, { useState } from 'react'
import "../index.css"
import "../main.css"
import SideBar from '../components/SideBar'
import ChatContainer from '../components/ChatContainer'
import RightSideBar from '../components/RightSideBar'

const HomePage = () => {


  const [selectedUser, setSelectedUser] = useState(false)

  return (

    <div className='homefirstdiv'>
      <div className={`homeseconddiv position-relative   overflow-hidden border border-secondary rounded-4 ${selectedUser ? 'threecollayout' : 'twocollayout'}`}>
        <SideBar selectedUser={selectedUser} setselectedUser={setSelectedUser} />
        <ChatContainer selectedUser={selectedUser} setselectedUser={setSelectedUser} />
        {selectedUser && (
        <RightSideBar selectedUser={selectedUser} setselectedUser={setSelectedUser} />
        )}
      </div>
    </div>

  )
}

export default HomePage
