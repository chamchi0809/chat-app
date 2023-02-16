import {IUser} from "../../pages/api/schema";
import {atom, useRecoilState} from "recoil";

const currentIdxState = atom({
    key: 'profilePopUpCurrentIdx',
    default: -1,
});
const usersState = atom<IUser[]>({
    key: 'profilePopUpUsers',
    default: [],
});

export const useProfilePopUpState = () => {
    const [currentIdx, setCurrentIdx] = useRecoilState(currentIdxState);
    const [users, setUsers] = useRecoilState(usersState);

    const popUser = () => {
        const newUsers = [...users];
        newUsers.pop();
        setUsers(newUsers);
    }
    const increaseIdx = () => {
        setCurrentIdx(currentIdx + 1);
    }
    const turnOn = (user: IUser|null) => {
        if(!user) return;
        setTimeout(() => increaseIdx(), 0);
        setUsers([...users, user]);
    }
    const turnOff = () => {
        setTimeout(() => popUser(), 400);
        setCurrentIdx(currentIdx === -1 ? currentIdx : currentIdx - 1);
    }
    const clear = () => {
        setTimeout(() => {
            setUsers([]);
        }, 200);
        setCurrentIdx(-1);
    }

    return {currentIdx, users, turnOn, turnOff, clear};
}
