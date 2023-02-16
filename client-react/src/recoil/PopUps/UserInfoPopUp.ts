import {IUser} from "../../pages/api/schema";
import {atom, useRecoilState} from "recoil";

const enabledState = atom({
    key: 'userInfoPopUpEnabled',
    default: false,
});
const positionState = atom<[number, number]>({
    key: 'userInfoPopUpPosition',
    default: [0, 0],
});
const userState = atom<IUser|null>({
    key: 'userInfoPopUpUser',
    default: null,
});

export const useUserInfoPopUpState = () => {
    const [enabled, setEnabled] = useRecoilState(enabledState);
    const [position, setPosition] = useRecoilState(positionState);
    const [user, setUser] = useRecoilState(userState);

    const turnOn = (pos: [number, number], user: IUser) => {
        setEnabled(true);
        setPosition(pos);
        setUser(user);
    }
    const turnOff = () => {
        setEnabled(false);
    }

    return {enabled, position, user, turnOn, turnOff};
}