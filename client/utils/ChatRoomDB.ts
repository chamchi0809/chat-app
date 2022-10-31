import Auth from './Auth';
import { chatRoom_type, IChatRoom } from '../pages/api/schema';

export default class ChatRoomDB{

  baseUrl:string

  private static instance: ChatRoomDB

  constructor(){
    console.log(process.env.API_BASE_URL)
    this.baseUrl = process.env.API_BASE_URL as string;

  }

  static getChatRoomDB(){
    if(!ChatRoomDB.instance){
      ChatRoomDB.instance = new ChatRoomDB();
    }
    return ChatRoomDB.instance
  }

  async postMessage(roomId:string, messageText:string, replyingTo:string=''){
    const auth = Auth.getAuth();
    const token = auth.token;
    
    const url = `${this.baseUrl}/rooms/${roomId}/message`;
    const options={
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
        'authorization':`Bearer ${token}`
      },
      body:JSON.stringify({
        messageText:messageText,
        replyingTo:replyingTo
      })
    }
    try{
      const res = await fetch(url, options);
      const json = await res.json();
      return json;
    }catch(err){
      console.log(err);
    }
  }

  async loadMessages(roomId:string, page:number=0, limit:number=10){
    const auth = Auth.getAuth();
    const token = auth.token;
    
    const url = `${this.baseUrl}/rooms/${roomId}/message/?page=${page}&limit=${limit}`;
    const options={
      method:'GET',
      headers:{
        'Content-Type': 'application/json',
        'authorization':`Bearer ${token}`
      }
    }
    try{
      const res = await fetch(url, options);
      const json = await res.json();
      return json;
    }catch(err){
      console.log(err);
    }
  }

  async loadRooms(){
    const auth = Auth.getAuth();
    let token = auth.token;
    
    const url = `${this.baseUrl}/rooms`;
    const options={
      method:'GET',
      headers:{
        'Content-Type': 'application/json',
        'authorization':`Bearer ${token}`
      }
    }
    try{
      const res = await fetch(url, options);
      const json = await res.json();
      return json.rooms as IChatRoom[];
    }catch(err){
      console.log(err);
    }
  }

  async loadRoom(roomId:string){
    const auth = Auth.getAuth();
    let token = auth.token;
    
    const url = `${this.baseUrl}/rooms/${roomId}`;
    const options={
      method:'GET',
      headers:{
        'Content-Type': 'application/json',
        'authorization':`Bearer ${token}`
      }
    }
    try{
      const res = await fetch(url, options);
      const json = await res.json();
      return json.room as IChatRoom;
    }catch(err){
      console.log(err);
    }
  }

  async createNewRoom(userIds:string[], type:chatRoom_type){
    const auth = Auth.getAuth();
    let token = auth.token;
    
    const url = `${this.baseUrl}/rooms/initiate`;
    const options={
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
        'authorization':`Bearer ${token}`
      },
      body:JSON.stringify({
        userIds:userIds,
        type:type
      })
    }
    try{
      const res = await fetch(url, options);
      const json:{
        isNew:boolean, 
        id:string
      } = await res.json();
      return json;
    }catch(err){
      console.log(err);
    }
  }

  async deleteMessage(messageId:string){
    const auth = Auth.getAuth();
    let token = auth.token;
    
    const url = `${this.baseUrl}/rooms/message/${messageId}`;
    const options={
      method:'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'authorization':`Bearer ${token}`
      },
    }
    try{
      const res = await fetch(url, options);
      const json = await res.json();
      return json;
    }catch(err){
      console.log(err);
    }
  }

  async editMessage(messageId:string, messageText:string){
    const auth = Auth.getAuth();
    let token = auth.token;
    
    const url = `${this.baseUrl}/rooms/message/${messageId}`;
    const options={
      method:'PATCH',
      headers:{
        'Content-Type': 'application/json',
        'authorization':`Bearer ${token}`
      },
      body: `{"messageText":"${messageText}"}`
    }
    try{
      const res = await fetch(url, options);
      const json = await res.json();
      return json;
    }catch(err){
      console.log(err);
    }
  }

  async deleteRoom(roomId:string){
    const auth = Auth.getAuth();
    let token = auth.token;
    
    const url = `${this.baseUrl}/rooms/${roomId}`;
    const options={
      method:'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'authorization':`Bearer ${token}`
      },
    }
    try{
      const res = await fetch(url, options);
      const json = await res.json();
      return json;
    }catch(err){
      console.log(err);
    }
  }

}