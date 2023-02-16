import {IChatRoom} from '../pages/api/schema';
import ChatRoomDB from '../utils/ChatRoomDB';
import {atom, useRecoilState} from "recoil";

export const chatRoomState = atom<IChatRoom[]>({
    key: 'chatRooms',
    default: [],
})

export const useChatRoomState = () => {
    const [chatRooms, setChatRooms] = useRecoilState(chatRoomState);

    const loadChatRooms = async () => {
        const chatRoomsData = await ChatRoomDB.getChatRoomDB().loadRooms();
        setChatRooms(chatRoomsData||[]);
    }

    return {chatRooms, loadChatRooms};
}