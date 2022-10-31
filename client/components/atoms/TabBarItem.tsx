
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import oc from 'open-color';
import React, { HTMLAttributes } from 'react'

const StyledTabBarItem = styled.div<TabBarItemProps>`

  border-bottom: 0;
  padding-bottom: 1rem;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  color:${props=>props.color};
  cursor: pointer;
  border-bottom: 2px solid transparent;
  user-select: none;

  &:hover{
    border-bottom: 2px solid ${props=>props.borderColor};
    color:${props=>props.highlightColor};
  }

  ${props=>props.selected && css`
    border-bottom: 2px solid ${props.borderColor};
    color:${props.highlightColor};
  `}
`;

interface TabBarItemProps extends HTMLAttributes<HTMLDivElement>{
  borderColor?:string
  color?:string
  highlightColor?:string
  selected:boolean
}

const TabBarItem:React.FC<TabBarItemProps> = ({color=oc.gray[4],highlightColor=oc.gray[2],borderColor=oc.gray[2], ...rest})=>{
  
  return (
    <StyledTabBarItem 
      color={color}
      highlightColor={highlightColor}
      borderColor={borderColor}
      selected={rest.selected}
      {...rest}>
        {rest.children}
    </StyledTabBarItem>
  )
}

export default TabBarItem