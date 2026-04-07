import React from 'react'
import assets, { userDummyData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
const SideBar = ({selectedUser,setselectedUser}) => {

  const navigate=useNavigate()


  return (
    <div className={`divonesidebar p-3 ${selectedUser ? 'd-none d-md-block' : ''}`}>
     <div className='divetwosidebar'>
    <div className='d-flex justify-content-bteween align-items-center'>
      <img src={assets.logo} alt='logo' className='logoimg'/>
      <div className='divfoursidebar position-relative py-2'>
          <img src={assets.menu_icon} alt='menu' className='menuimg'/>
          <div className='divfivesidebar position-absolute border border-secondary p-2 rounded '>
            <p onClick={()=>{navigate('/ProfilePage')}} className='editprofile'>Edit Profile</p>
            <hr className='my-2 border border-top border-secondary'></hr>
            <p className='logout'>Logout</p>
          </div>
      </div>
    </div>

    <div className='searchdivsidebar py-1 mt-2 mb-3 rounded-pill d-flex align-items-center'>
      <img src={assets.search_icon} alt='Search' className='searchimgsidebar'/>
      <input type='text' className='searchinputsidebar d-flex' placeholder='Search User...'/>
    </div>
     </div>

    <div className='divsixsidebar'>
     {userDummyData.map((user,index)=>(
      <div onClick={()=>setselectedUser(user)} key={index} className={`divsevensidebar mb-2 rounded ${selectedUser?._id=== user._id  && 'divsevencheck'}`}>
        <img src={user.profilePic || assets.avatar_icon} alt='' className='userimg rounded-pill'/>
        <div className='usernamediv'>
          <p>{user.fullName}</p>
          {
            index<3
            ? <span className='online'>Online</span>
            : <span className='offline'>Offline</span>
          }
        </div>
        {index>2 && <p className='afternameindex rounded-pill'>{index}</p>}
      </div>
     ))}
    </div>

    </div>
  )
}

export default SideBar
