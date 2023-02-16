import {IChatRoom, IUser} from "../../pages/api/schema";
import {atom, useRecoilState} from "recoil";

export const enabledState = atom({
    key: 'chatRoomMenuPopUpEnabled',
    default: false,
});
export const positionState = atom<[number, number]>({
    key: 'chatRoomMenuPopUpPosition',
    default: [0, 0],
});
export const chatRoomState = atom<IChatRoom|null>({
    key: 'chatRoomMenuPopUpUser',
    default: null,
});

export const useChatRoomMenuPopUpState = () => {
    const [enabled, setEnabled] = useRecoilState(enabledState);
    const [position, setPosition] = useRecoilState(positionState);
    const [chatRoom, setChatRoom] = useRecoilState(chatRoomState);

    const turnOn = (pos: [number, number], chatRoom: IChatRoom) => {
        setEnabled(true);
        setPosition(pos);
        setChatRoom(chatRoom);
    }
    const turnOff = () => {
        setEnabled(false);
    }

    return {enabled, position, chatRoom, turnOn, turnOff};
}