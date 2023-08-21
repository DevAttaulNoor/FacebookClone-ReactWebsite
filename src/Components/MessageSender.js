import { Avatar } from '@mui/material'
import React from 'react'
import "../CSS/MessageSender.css"

function MessageSender() {
  return (
    <div className='messagesender'>
        <div className="messagesender_top">
            <Avatar/>
            <form action="">
                <input type="text" placeholder="What's on your mind Atta ul Noor" />
            </form>
        </div>

        <div className="messagesender_bottom">
            <div className="messangerOption">
                <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/c0dWho49-X3.png?_nc_eui2=AeHnEIjVawZBI76yMIMwddXsVnUPE18ZZ-dWdQ8TXxln51Q2S_zbzfHpnn234I7BWgTtb2IssbzIPCV_o410lzBg" alt="" />
                <p>Live Video</p>
            </div>
            <div className="messangerOption">
                <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeFIN4dua_6GwPFkOshGHR00PL4YoeGsw5I8vhih4azDkrvKepSUCMn7LYfrqKUcUJimL4hKbOZB6qAi70AVDE9j" alt="" />
                <p>Photo/Video</p>
            </div>
            <div className="messangerOption">
                <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeHSN24y7ZwUiP0ks-vc5M5LvPIN-OmHLJy88g346YcsnMgGxvtWqzXUT3WG--zLIURpvgdh0oglkNtF3k-n2n77" alt="" />
                <p>Feeling/Activity</p>
            </div>
        </div>
    </div>
  )
}

export default MessageSender