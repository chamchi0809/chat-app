import Auth from './Auth';

const {VITE_API_BASE_URL} = import.meta.env;
export default class Uploader {

    baseUrl: string

    private static instance: Uploader

    constructor() {

        this.baseUrl = VITE_API_BASE_URL;

    }

    static getUploader() {
        if (!Uploader.instance) {
            Uploader.instance = new Uploader();
        }
        return Uploader.instance
    }

    async uploadAttachment(file: Blob, roomId: string) {
        const auth = Auth.getAuth();
        let token = auth.token;

        const formData = new FormData();
        console.log(file);
        formData.append('file', file)

        const url = `${this.baseUrl}/upload/${roomId}`;
        let options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        (options as any).body = formData;
        try {
            const res = await fetch(url, options);
            const json = await res.json();
            console.log(json.downloadUrl);
            return json.downloadUrl as string;
        } catch (err) {
            console.log(err);
        }
    }

}