import { Avatar, IconButton, Modal } from '@mui/material'
import React, { useState } from 'react'
import "../CSS/MessageSender.css"
import CloseIcon from '@mui/icons-material/Close';
import { useStateValue } from './StateProvider';


function MessageSender() {
    const [{user}, dispatch] = useStateValue();
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <div className="modal_pop">
                    <form action="">
                        <div className="modalHeading">
                            <h3>Create Post</h3>
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </div>

                        <div className="modalHeader_top">
                            <Avatar src={user.photoURL} />
                            <h5>{user.displayName}</h5>
                        </div>

                        <div className="modalBody">
                            <textarea cols="5" placeholder="What's on your mind"></textarea>
                        </div>

                        <div className="modalFooter">
                            <div className="modalFooterLeft">
                                <h4>Add to your post</h4>
                            </div>
                            <div className="modalFooterRight">
                                <IconButton>
                                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yr/r/c0dWho49-X3.png?_nc_eui2=AeHnEIjVawZBI76yMIMwddXsVnUPE18ZZ-dWdQ8TXxln51Q2S_zbzfHpnn234I7BWgTtb2IssbzIPCV_o410lzBg" alt="" />
                                </IconButton>
                                <IconButton>
                                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeFIN4dua_6GwPFkOshGHR00PL4YoeGsw5I8vhih4azDkrvKepSUCMn7LYfrqKUcUJimL4hKbOZB6qAi70AVDE9j" alt="" />
                                </IconButton>
                                <IconButton>
                                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeHSN24y7ZwUiP0ks-vc5M5LvPIN-OmHLJy88g346YcsnMgGxvtWqzXUT3WG--zLIURpvgdh0oglkNtF3k-n2n77" alt="" />
                                </IconButton>
                            </div>
                        </div>
                        <input type="submit" className='post_submit' value="Post" />
                    </form>
                </div>
            </Modal>

            <div className='messagesender'>
                <div className="messagesender_top">
                    <Avatar src={user.photoURL}/>
                    <form action="">
                        <input type="text" placeholder={`What's on your mind ${user.displayName}`} onClick={handleOpen}/>
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
        </>
    )
}

export default MessageSender