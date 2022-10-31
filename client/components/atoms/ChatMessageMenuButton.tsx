import React, { ButtonHTMLAttributes, useState } from 'react'
import { styledSize } from '../../styles/SizeStyles';
import oc from 'open-color';
import { styledColor } from '../../styles/ColorStyles';
import { css } from '@emotion/react';
import styled from '@emotion/styled'

const StyledChatMessageMenuButton = styled.button<ChatMessageMenuButtonProps>`
  display: inline-flex;
  align-items: center;
  align-content: center;

  background-color: ${oc.gray[9]};
  color: ${props=>props.color};

  text-align: center;
  font-size: 1.25rem;
  padding: 0.25rem;
  font-weight: 500;

  cursor: pointer;
  user-select: none;
  transition: .1s all;

  border-radius: 0;

  border: 0;
  &:last-of-type{
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }
  &:first-of-type{
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
  }
  &:hover {
    background-color: ${oc.gray[8]};
  }

  &:active {
    padding-top: .5rem;
  }
`;

interface ChatMessageMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{

}

const ChatMessageMenuButton:React.FC<ChatMessageMenuButtonProps> = ({...rest})=>{
  
  return (
    <StyledChatMessageMenuButton 
      {...rest}>
      {rest.children}
    </StyledChatMessageMenuButton>
  )
}

export default ChatMessageMenuButton