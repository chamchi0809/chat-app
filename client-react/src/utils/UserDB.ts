import Auth from './Auth';
import {IUser} from '../pages/api/schema';

const {VITE_API_BASE_URL} = import.meta.env;
export default class UserDB {

    baseUrl: string

    private static instance: UserDB

    constructor() {

        this.baseUrl = VITE_API_BASE_URL;

    }

    static getUserDB() {
        if (!UserDB.instance) {
            UserDB.instance = new UserDB();
        }
        return UserDB.instance
    }

    async searchUsers(query: string) {
        const auth = Auth.getAuth();
        let token = auth.token;

        const url = `${this.baseUrl}/users?q=${query}`;
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        }
        try {
            const res = await fetch(url, options);
            const json = await res.json();
            return json.users as IUser[];
        } catch (err) {
            console.log(err);
        }
    }

    async getUserById(id: string) {
        const auth = Auth.getAuth();
        let token = auth.token;

        const url = `${this.baseUrl}/users/${id}`;
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        }
        try {
            const res = await fetch(url, options);
            const json = await res.json();
            return json.user as IUser;
        } catch (err) {
            console.log(err);
        }
    }

    async getMutualFriends(id: string) {
        const auth = Auth.getAuth();
        let token = auth.token;

        const url = `${this.baseUrl}/users/${id}/mutualFriends`;
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        }
        try {
            const res = await fetch(url, options);
            const json = await res.json();
            return (json.mutualFriends || []) as IUser[];
        } catch (err) {
            console.log(err);
        }
    }

}