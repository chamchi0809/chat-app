import {IUser} from '../pages/api/schema';
import axios, {AxiosInstance} from "axios";

const {VITE_API_BASE_URL} = import.meta.env;
export default class Auth {

    baseUrl: string
    token: string = ''
    user: IUser | undefined;
    axiosInstance: AxiosInstance | undefined;

    private static instance: Auth;

    constructor() {
        this.baseUrl = VITE_API_BASE_URL as string;
        this.getJWT();
    }

    static getAuth() {
        if (!Auth.instance) {
            Auth.instance = new Auth();
        }
        return Auth.instance
    }

    getJWT() {
        if (typeof document !== 'undefined') {
            if (sessionStorage.getItem('jwt')) {
                this.token = sessionStorage.getItem('jwt') as string;
                this.axiosInstance = axios.create({
                    baseURL: `${this.baseUrl}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                this.getUser();
            }
        }
    }

    async getUser() {

        if (this.user) return this.user;

        const url = `${this.baseUrl}/users/myInfo`;
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${this.token}`
            },
        }
        try {
            const res = await fetch(url, options);
            const json = await res.json();
            this.user = json.user;
            return this.user;
        } catch (err) {
            console.log(err);
        }
    }

    async signin(username: string, password: string) {
        const url = `${this.baseUrl}/signin`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }
        try {
            const res = await fetch(url, options);
            const json = await res.json();
            this.token = json.authorization;
            this.user = json.user;
            sessionStorage.setItem('jwt', this.token);
            return json;
        } catch (err) {
            console.log(err);
        }
    }

    async signup(username: string, email: string, password: string, type: string) {
        const url = `${this.baseUrl}/signup`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                type: type
            })
        }
        try {
            const res = await fetch(url, options);
            const json = await res.json();
            this.token = json.authorization;
            this.getUser();
            return json;
        } catch (err) {
            console.log(err);
        }
    }

    async addFriend(id: string) {
        const url = `${this.baseUrl}/users/friend/${id}`;
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${this.token}`
            },
        }
        try {
            const res = await fetch(url, options);
            const json = await res.json();
            this.user = json.user;
            return json;
        } catch (err) {
            console.log(err);
        }
    }

    async deleteFriend(id: string) {
        const url = `${this.baseUrl}/users/friend/${id}`;
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${this.token}`
            },
        }
        try {
            const res = await fetch(url, options);
            const json = await res.json();
            this.user = json.user;
            return json;
        } catch (err) {
            console.log(err);
        }
    }
}

const auth = Auth.getAuth();