import React, { useEffect, useRef } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import formatmsgtime from '../utils/utilities'


const ChatContainer = ({selectedUser ,setselectedUser}) => {

  const scrollEnd=useRef()

  useEffect(()=>{
    if(scrollEnd.current){
      scrollEnd.current.scrollIntoView({behavior:'smooth'})
    }
  },[])

  return selectedUser ? (
    <div className={`divonecc position-relative ${!selectedUser ? 'd-none d-md-flex' : ''}`}>
      {/* <---------- Header ---------> */}
     <div className='d-flex align-items-center py-3 mx-4 border-bottom border-secondary gap-3'>
    <img src={assets.profile_martin} alt='profilePic' className='rounded-pill userimgcc'/>
    <p className='d-flex flex-fill align-items-center gap-2 usernameparacc'> 
      Martin Johnson
      <span className='rounded-pill usernamespancc'></span>
      </p>
      <img onClick={()=> setselectedUser(null)} src={assets.arrow_icon} alt="" className='arrowiconcc d-block d-md-none '/>
      <img src={assets.help_icon} alt="" className='helpiconcc d-none d-md-block '/>
      </div>
      {/* ---------- Chat-Container-------- */}
      <div className='divonechatareacc p-3 pb-6'>
      {messagesDummyData.map((msg,index)=>(
        <div key={index} className={`divtwomsgcc gap-2 ${msg.senderId !== '680f50e4f10f3cd28382ecf9' && 'dictwocheckmsgcc'}`}>
            {msg.image ? (
              <img src={msg.image} alt="" className='imgchatareacc mb-8 rounded-3'/>
            ):(
                <p className={`parachatareacc p-2 rounded-3 mb-8 ${msg.senderId=== '680f50e4f10f3cd28382ecf9' ? 'paracheckchatareacc':'parachchatareacc'}`}>{msg.text}</p>
          )}

          <div className='divthreechatareacc'>
            <img src={msg.senderId === '680f50e4f10f3cd28382ecf9' ? assets.avatar_icon : assets.profile_martin} alt="" className='icononmsgchatareacc rounded-pill'/>
            <p className='timeparachatareacc'>{formatmsgtime(msg.createdAt)}</p>
          </div>
        </div>
      ))}
      <div ref={scrollEnd}></div>
      </div>



{/* Bottom Area */}
<div className='divoneBA position-absolute bottom-0 start-0 end-0 d-flex align-items-center gap-3 p-3'>
<div className='divtwoBA rounded-pill px-3 flex-fill'>
  <input type='text' placeholder='Send a message' className='inputmsgBA rounded-3 '/>
  <input type='file'id='image' accept='image/png, image/jpeg' hidden/>
  <label htmlFor='image'>
  <img src={assets.gallery_icon} alt='' className='galleryicon'/>
  </label>
</div>
<img src={assets.send_button} alt='' className='sendbutton'/>
</div>


    </div>
  ): (
    <div className='checkdivcc align-items-center justify-content-center gap-2 '>
      <img src={assets.logo_icon} alt="" className='logoimgcheckcc'/>
      <p className='checkparacc'>Chat anytime,anywhere</p>
    </div>
  )
}

export default ChatContainer
ChatContainer