import React from 'react'
import '../CSS/Feeds.css'
import Storyreels from './Storyreels'
import MessageSender from './MessageSender'

function Feeds() {
  return (
    <div className='feeds'>
        <Storyreels />
        <MessageSender />
    </div>
  )
}

export default Feeds