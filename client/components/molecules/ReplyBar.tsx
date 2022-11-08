import React, { HTMLAttributes, HTMLProps, InputHTMLAttributes } from 'react';

import Label from '../atoms/Label';
import Input, { InputProps } from '../atoms/Input';
import styled from '@emotion/styled';
import oc from 'open-color';
import Button from '../atoms/Button';
import { AiOutlineClose } from 'react-icons/ai';
import { useChatMessageStore } from '../../zustand/ChatMessage';

const StyledReplyBar = styled.div`
  background-color: ${oc.gray[8]};
  display: flex;
  color :${oc.gray[4]};
  border-radius: .25rem;
  align-items: center;
  align-content: center;
  justify-self: flex-end;
  justify-content: space-between;
  user-select: none;
  padding: 10px;
  width: 100%;
  margin-top: auto;
  box-sizing: border-box;
  button{
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    padding: 0;
  }
  & + & {
    margin-top: 1rem;
  }

  span{
    color:${oc.gray[5]};
  }
  #replyingTo{
    color: ${oc.gray[3]};
  }
`;



const ReplyBar:React.FC=()=>{
  const {replyingTo, setReplyingTo} = useChatMessageStore();
  if(replyingTo){
    return(
      <StyledReplyBar>
        <span>Replying to <span id='replyingTo'>@{replyingTo?.postedBy?.username}</span></span>
        <Button onClick={()=>setReplyingTo(null)}><AiOutlineClose color='black'/></Button>
      </StyledReplyBar>
    )
  }
}

export default ReplyBar