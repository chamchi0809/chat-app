import React, { ButtonHTMLAttributes, useState } from 'react'
import { styledSize } from '../../styles/SizeStyles';
import oc from 'open-color';
import { styledColor } from '../../styles/ColorStyles';
import { css } from '@emotion/react';
import styled from '@emotion/styled'


const sizeStyles = {
  sm: css`
  height: 36px;
  font-size: 14px;
  padding: 0 16px;
  `,
  md: css`
  height: 40px;
  font-size: 16px;
  padding: 0 20px;
  `,
  lg: css`
  height: 56px;
  font-size: 18px;
  padding: 0 24px;
  `,
};

const StyledButton = styled.button<StyledButtonProps>`

  display: inline-flex;
  align-items: center;
  align-content: center;

  background: ${props=>props.colorScheme[6+props.highlightOffset]};
  color: ${props=>props.color};

  text-align: center;
  font-size: 1.25rem;
  font-weight: 500;

  cursor: pointer;
  user-select: none;
  transition: .2s all;

  border-radius: .25rem;
  border: 0;

  &:hover {
    background: ${props=>props.colorScheme[4+props.highlightOffset]};
  }

  &:active {
    background: ${props=>props.colorScheme[4+props.highlightOffset]};
  }


  ${props=>props.active && css`
  background: ${props.colorScheme[4+props.highlightOffset]};
  `}
  ${props=>sizeStyles[props.size]}
  
`;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  size?:styledSize
  color?:string
  colorScheme?:styledColor
  highlightOffset?:number
  active?:boolean
}

interface StyledButtonProps extends ButtonProps{
  colorScheme:any
}

const Button:React.FC<ButtonProps> = ({color='black', colorScheme='gray', size='md', highlightOffset=0,...rest})=>{
  
  return (
    <StyledButton 
      size={size}
      color={color}
      colorScheme={oc[colorScheme as string]}
      highlightOffset={highlightOffset}
      {...rest}>
      {rest.children}
    </StyledButton>
  )
}

export default Button