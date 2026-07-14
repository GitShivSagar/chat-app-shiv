import React from 'react'
import Routing from './components/Routing'
import {Toaster} from 'react-hot-toast'
const App = () => {
  return (
    <div className="appdiv">
      <Toaster/>
      <Routing/>
    </div>
  )
}

export default App
