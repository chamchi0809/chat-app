import {IChatRoom, IMessage} from "../pages/api/schema";
import Auth from "../utils/Auth";
import {useInfiniteQuery, useMutation, useQuery} from "react-query";

const auth = Auth.getAuth();

export const useRooms = () => {
    const query = useQuery(['rooms'], async () => {
        auth.getJWT();
        const instance = auth.axiosInstance;

        if (instance) {
            const {data} = await instance.get('/rooms');
            return data.rooms as IChatRoom[];
        }
    });
    return query;
}

export const useRoom = (roomId: string) => {
    const query = useQuery(['room', roomId], async () => {
        auth.getJWT();
        const instance = auth.axiosInstance;

        if (instance) {
            const {data} = await instance.get(`/rooms/${roomId}`);
            return data.room as IChatRoom;
        }
    });
    return query;
}

export const useMessages = (roomId: string | undefined) => {
    const query = useInfiniteQuery(['messages', roomId], async ({pageParam = 0}) => {
        auth.getJWT();
        const instance = auth.axiosInstance;
        if (instance) {
            const {data} = await instance.get(`/rooms/${roomId}/message?page=${pageParam}&limit=${40}`);
            return data.conversation;
        }
    },
    );
    return query;
}

export const useDraft = (roomId: string | undefined) => {
    const query = useQuery(['draft', roomId], async () => {
        auth.getJWT();
        const instance = auth.axiosInstance;
        if (instance) {
            const {data} = await instance.get(`/users/drafts/${roomId}`);
            console.log('refetched' + data.draft);
            return data.draft;
        }
    });
    return query;
}

// export const postMessageMutation = useMutation({
//
// })