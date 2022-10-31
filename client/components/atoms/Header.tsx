
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { HTMLAttributes } from 'react'


import { styledSize } from '../../styles/SizeStyles';


const sizeStyles = {
  sm: css`
  font-size: 1.5rem;
  `,
  md: css`
  font-size: 2.0rem;
  `,
  lg: css`
  font-size: 2.5rem;
  `,
};

const StyledHeader = styled.h1<HeaderProps>`

  color: ${props=>props.color};
  font-family: 'Roboto';
  text-decoration: none;
  user-select: none;

  ${props=>sizeStyles[props.size]}
`;

interface HeaderProps extends HTMLAttributes<HTMLHeadingElement>{
  size:styledSize
  color:string
}

const Header:React.FC<HeaderProps> = ({color, size, ...rest})=>{
  
  return (
    <StyledHeader 
      size={size}
      color={color}
      {...rest}>
      {rest.children}
    </StyledHeader>
  )
}

export default Header