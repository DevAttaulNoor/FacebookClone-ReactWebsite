import React from 'react'
import '../CSS/Feeds.css'
import Storyreels from './Storyreels'
import MessageSender from './MessageSender'
import Posts from './Posts'

function Feeds() {
  return (
    <div className='feeds'>
        <Storyreels />
        <MessageSender />
        <Posts photoURL="https://scontent.fkhi21-1.fna.fbcdn.net/v/t39.30808-6/277656626_3132629923647651_3207745817934781589_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeGZQFxBUBdl8-79f2XXOlL35DJd1w5-H8zkMl3XDn4fzAxsW_LvRkCwYhSYTxeS25UT-EYVNtSr1Z4LZmQUJwN8&_nc_ohc=BzC8nG_ygfcAX-9jH6P&_nc_ht=scontent.fkhi21-1.fna&oh=00_AfCfe_932xt59XfV11sDMKnCcBRGhPVbZwCaIJJ4BsVCCQ&oe=64E94395" image="" username="Atta ul Noor" timestamp="11:40 pm" message="This is text message"/>
        <Posts photoURL="https://scontent.fkhi21-1.fna.fbcdn.net/v/t39.30808-6/334943474_1433532290790415_1676633542714545751_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeEQkgOCpQiBXB_CWVEDCqKejh5t-eDOO3mOHm354M47eT7T_u9OSD3Blc-syeK9yxx0ecVyFrFAKDpDTbTXdp_l&_nc_ohc=YRQ7ItnLzeAAX8bY1dg&_nc_ht=scontent.fkhi21-1.fna&oh=00_AfBom3T8Rg9dO9lMDvL-qIhu5_tlF4i2lAHmAtgcV0B96A&oe=64E8DF38" image="https://scontent.fkhi21-1.fna.fbcdn.net/v/t39.30808-6/369165173_653394556890743_2214998990626657645_n.jpg?stp=dst-jpg_s640x640&_nc_cat=1&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeE15qEFB7lowmZJb--jCSlVIMjkfgMq82wgyOR-AyrzbGDrQKwFxp9BVKSFzDkWParQQFxMvAtITKnPAHbEzP9X&_nc_ohc=E_6eNEZkYMYAX8tXANb&_nc_ht=scontent.fkhi21-1.fna&oh=00_AfCvgYIfcRF-bVQNb0D5o6jcFL_muZ8mop20_T_SQG7uAg&oe=64E98299" username="Abdullah" timestamp="1:10 pm" message="message"/>
    </div>
  )
}

export default Feeds