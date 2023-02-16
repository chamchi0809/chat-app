import {IUser} from '../pages/api/schema';
import {atom, useRecoilState} from "recoil";

export const friendState = atom<IUser[]|undefined>({
    key: 'friends',
    default: [],
})

export const useFriendState = () => {
    const [friends, setFriends] = useRecoilState(friendState);

    const setFriendsViaUser = (user: IUser|undefined) => {
        setFriends(user?.friends);
    }

    return {friends, setFriends, setFriendsViaUser};
}