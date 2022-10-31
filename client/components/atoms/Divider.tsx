
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import oc from 'open-color';
import React, { HTMLAttributes } from 'react'

const StyledDivider = styled.div<DividerProps>`

  background-color: ${props=>props.bgcolor};
  width:${props=>props.w};
  height:${props=>props.h};
  margin-top: .5rem;
  margin-bottom: .5rem;
`;

interface DividerProps extends HTMLAttributes<HTMLDivElement>{
  w?:string
  h?:string
  bgcolor?:string
}

const Divider:React.FC<DividerProps> = ({bgcolor=oc.gray[6], w='100%', h='.1rem',...rest})=>{
  
  return (
    <StyledDivider 
      w={w}
      h={h}
      bgcolor={bgcolor}
      {...rest}>
    </StyledDivider>
  )
}

export default Divider