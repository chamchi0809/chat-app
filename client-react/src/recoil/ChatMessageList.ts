import {atom, useRecoilState} from "recoil";
import {IChatMessage} from "../pages/api/schema";

export const scrollFromBottomState = atom<{[key:string]: number}>({
    key: 'scrollFromBottom',
    default: {},
})

export const chatMessagesState = atom<{[key:string]: IChatMessage[]}>({
    key: 'chatMessages',
    default: {},
})

export const useChatMessageListState = (roomId: string) => {
    const [scrollFromBottom, setScrollFromBottom] = useRecoilState(scrollFromBottomState);
    const [chatMessages, setChatMessages] = useRecoilState(chatMessagesState);

    const setScrollFromBottomForRoom = (value: number) => {
        setScrollFromBottom((prev) => {
            return {...prev, [roomId]: value}
        })
    }

    const setChatMessagesForRoom = (value: IChatMessage[]) => {
        setChatMessages((prev) => {
            return {...prev, [roomId]: value}
        })
    }

    return {
        scrollFromBottomForRoom: scrollFromBottom[roomId] || 0,
        setScrollFromBottomForRoom,
        chatMessagesForRoom: chatMessages[roomId] || [],
        setChatMessagesForRoom
    };
}