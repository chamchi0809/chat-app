import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react'
import ChatRoomList from './organisms/ChatRoomList';
import Auth from '../utils/Auth';
import CreateChatRoomMenu from './molecules/CreateChatRoomMenu';
import { useRouter } from 'next/router';
import Button from './atoms/Button';
import oc from 'open-color';
import {BsPeopleFill} from 'react-icons/bs'
import UserMenu from './molecules/UserMenu';
import UserInfoPopUp from './molecules/UserInfoPopUp';
import ProfilePopUp from './organisms/ProfilePopUp';
import { useProfilePopUpStore } from '../zustand/PopUp';



const Layout:React.FC<any>=({children})=>{

  const router = useRouter();
  const [auth,setAuth]=useState<Auth>(null);
  const {users:profilePopUpUsers, currentIdx:currentProfilePopUpIdx} = useProfilePopUpStore();


  console.log(profilePopUpUsers, currentProfilePopUpIdx);

  useEffect(()=>{
    setAuth(Auth.getAuth());
    if(auth){
      if(!auth.token){
        router.push('/signin');
      }
    }
  },[auth])

  return (
    <div 
      css={css`
        display: flex;
        width: 100vw;
        max-width: 100%;
        max-height: 100vh;
        position: relative;
      `}>
      {
        auth?.token&&
        <>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              background-color: ${oc.gray[8]};
            `}>
            <Button size='md' highlightOffset={2} active={router.pathname.includes('friends')}
            onClick={()=>router.push('/friends')}
            css={
              css`
                margin: 10px;
                padding: 16px;
                color:${oc.white};
              `
            }><BsPeopleFill/>&nbsp;&nbsp;Friends</Button>
            <ChatRoomList/>
          </div>
        </>
      }
      {children}
      <CreateChatRoomMenu/>
      <UserMenu/>
      <div css={css`
        width: 100vw;
        height: 100vh;
        position: absolute;
        top:0;
        left: 0;
        pointer-events: none;
      `}>
        <UserInfoPopUp/>
      </div>
      {
        profilePopUpUsers?.map((user,i)=><ProfilePopUp user={user} idx={i} key={i} enabled={currentProfilePopUpIdx === i}/>)
      }
    </div>
  )
}

export default Layout