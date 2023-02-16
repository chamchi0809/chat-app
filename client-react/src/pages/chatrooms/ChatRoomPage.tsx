import React, {useEffect, useState} from 'react'
import ChatMessageList from '../../components/templates/ChatMessageList';
import ChatRoomDB from '../../utils/ChatRoomDB';
import {IChatRoom} from '../api/schema';
import {useParams} from "react-router-dom";


const ChatRoomPage: React.FC = () => {

    const {roomId} = useParams();
    const chatRoomDB = ChatRoomDB.getChatRoomDB();
    const [selectedRoom, setSelectedRoom] = useState<IChatRoom|undefined>();



    useEffect(() => {
        (async () => {
            setSelectedRoom(await chatRoomDB.loadRoom(roomId||''));
        })()
    }, [roomId])

    return (
        selectedRoom ?
        <ChatMessageList key={selectedRoom._id} selectedRoom={selectedRoom}/>
            :
        <></>
    )
}

export default ChatRoomPage