import {IUser} from "../../pages/api/schema";
import {atom, useRecoilState} from "recoil";

export const enabledState = atom({
    key: 'userMenuPopUpEnabled',
    default: false,
});
export const positionState = atom<[number, number]>({
    key: 'userMenuPopUpPosition',
    default: [0, 0],
});
export const userState = atom<IUser|null>({
    key: 'userMenuPopUpUser',
    default: null,
});
export const zIndexState = atom({
    key: 'userMenuPopUpZIndex',
    default: 10,
});

export const useUserMenuPopUpState = () => {
    const [enabled, setEnabled] = useRecoilState(enabledState);
    const [position, setPosition] = useRecoilState(positionState);
    const [user, setUser] = useRecoilState(userState);
    const [zIndex, setZIndex] = useRecoilState(zIndexState);

    const turnOn = (pos: [number, number], user: IUser, idx?: number) => {
        setEnabled(true);
        setPosition(pos);
        setUser(user);
        setZIndex(idx ?? 10);
    }
    const turnOff = () => {
        setEnabled(false);
    }

    return {enabled, position, user, zIndex, turnOn, turnOff};
}