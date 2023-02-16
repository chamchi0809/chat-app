import {atom, useRecoilState} from "recoil";

export const enabledState = atom({
    key: 'createRoomPopUpEnabled',
    default: false,
});
export const positionState = atom<[number, number]>({
    key: 'createRoomPopUpPosition',
    default: [0, 0],
});

export const useCreateRoomPopUpState = () => {
    const [enabled, setEnabled] = useRecoilState(enabledState);
    const [position, setPosition] = useRecoilState(positionState);

    const turnOn = (pos: [number, number]) => {
        setEnabled(true);
        setPosition(pos);
    }
    const turnOff = () => {
        setEnabled(false);
    }

    return {enabled, position, turnOn, turnOff};
}