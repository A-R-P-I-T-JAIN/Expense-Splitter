import React from 'react'

const RoomInfo = ({info,roomName,id,host,members}) => {
  return (
    <div style={{ display: info ? "" : "none" }} className='room_chat room_info'>

        <div className="room_info_left">

        <div>
            <h1>Room Name:</h1>
            <p>{roomName}</p>
        </div>
        
        <div>
            <h1>Room Code:</h1>
            <p>{id}</p>
        </div>
        
        <div>
            <h1>Host:</h1>
            <p>{host}</p>
        </div>
    
        </div>

        <div className="room_info_right">
            <h1>Members:</h1>
            <div>
            {members.map((member,i) => (
                <p>({i+1}) {member}</p>
                // <p>({i+1}) {member.userName}</p>
            ))}
            </div>
            
        </div>

        
      
    </div>
  )
}

export default RoomInfo
