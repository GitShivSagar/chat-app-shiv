import React, { useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {

  const [selectedImg,setSelectedIMg]=useState(null)
  const navigate=useNavigate()
  const [name,setName]=useState("ShivSagar")
  const [bio,setBio]=useState("Hiii... , eveyoe i m using this")


  const onSubmitHandler=async (e)=>{
    e.preventDefault()
    navigate('/')
  }

  return (
    <div className='divonePP'>
      <div className='divtwoPP'>
        <form onSubmit={onSubmitHandler} className='formtagPP'>
          <h3 className='fs-4'>Profile details</h3>
          <label htmlFor="avatar" className='labelonePP'>
            <input onChange={(e)=>setSelectedIMg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg) :assets.avatar_icon} alt="" className={`profilepicLP ${selectedImg && 'rounded-pill'}`}/>
            Upload profile Image
          </label>

          <input onChange={(e)=>setName(e.target.value)} value={name} type="text"  placeholder='Your name' required className='inputonsubmitLP'/>

          <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
          placeholder='Write profile bio' rows={4} required className='inputonsubmitLP'>
          </textarea>

          <button type='submit' className='buttonLP'>Save</button>
        </form>
        <img src={assets.logo_icon} alt="" className='logoiconPP rounded-pill'/>
      </div>
    </div>
  )
}

export default ProfilePage
