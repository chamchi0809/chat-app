import create from 'zustand'
import { IUser } from '../pages/api/schema'


interface CreateRoomPopUpState {
  enabled:boolean
  position:[number,number]
  turnOn:(pos:[number,number])=>void
  turnOff:()=>void
}

export const useCreateRoomPopUpStore = create<CreateRoomPopUpState>()((set)=>({
  enabled:false,
  position:[0,0],
  turnOn:(pos)=>set(state=>({enabled:true, position:pos})),
  turnOff:()=>set(state=>({enabled:false, position:state.position}))
}))

interface UserMenuPopUpState {
  enabled:boolean
  position:[number,number]
  user:IUser
  zIndex:number
  turnOn:(pos:[number,number], user:IUser,idx?:number)=>void
  turnOff:()=>void
}

export const useUserMenuPopUpStore = create<UserMenuPopUpState>()((set)=>({
  enabled:false,
  position:[0,0],
  user:null,
  zIndex:10,
  turnOn:(pos,user,idx=10)=>set(state=>({enabled:true, position:pos, user:user, zIndex:idx})),
  turnOff:()=>set(state=>({enabled:false, position:state.position, user:state.user}))
}))

interface UserInfoPopUpState {
  enabled:boolean
  position:[number,number]
  user:IUser
  turnOn:(pos:[number,number], user:IUser)=>void
  turnOff:()=>void
}

export const useUserInfoPopUpStore = create<UserInfoPopUpState>()((set)=>({
  enabled:false,
  position:[0,0],
  user:null,
  turnOn:(pos:[number,number], user:IUser)=>set(state=>({enabled:true, position:pos, user:user})),
  turnOff:()=>set(state=>({enabled:false, position:state.position, user:state.user}))
}))

interface ProfilePopUpState {
  currentIdx:number
  users:IUser[]
  popUser:()=>void
  increaseIdx:()=>void
  turnOn:(user:IUser)=>void
  turnOff:()=>void
  clear:()=>void
}

export const useProfilePopUpStore = create<ProfilePopUpState>()((set)=>({
  currentIdx:-1,
  users:[],
  popUser:()=>set(state=>{
    const newUsers = [...state.users];
    newUsers.pop();
    return {users:newUsers}
  }),
  increaseIdx:()=>set(state=>({currentIdx:state.currentIdx+1})),
  turnOn:(user:IUser)=>set(state=>{
    setTimeout(()=>state.increaseIdx(), 0);
    return {users:[...state.users, user]}
  }),
  turnOff:()=>set(state=>{
    setTimeout(()=>state.popUser(), 400)
    
    return {currentIdx:state.currentIdx === -1 ? state.currentIdx : state.currentIdx-1};
  }),
  clear:()=>set(state=>{
    setTimeout(()=>{
      set(state=>({users:[]}))
    }, 200);
    return {currentIdx:-1}
  })
}))