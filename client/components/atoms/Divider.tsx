
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import oc from 'open-color';
import React, { HTMLAttributes } from 'react'

const StyledDivider = styled.div<StyledDividerProps>`

  z-index: 1;
  height: 0;
  background-color: ${oc.gray[7]};
  border-bottom: 1px solid ${props=>props.bgcolor};
  align-items: center;
  justify-content: center;
  margin-top: .5rem;
  margin-bottom: .5rem;
  position: relative;
  display: flex;

  span{

    display: block;
    flex:0 0 auto;
    z-index: 2;
    background-color: ${oc.gray[7]};
    line-height: 13px;
    font-size: 12px;
    padding: 2px 4px;
    border-radius: 8px;
  }
`;

interface DividerProps extends HTMLAttributes<HTMLDivElement>{
  w?:string
  h?:string
  bgcolor?:string
  content?:string
}

interface StyledDividerProps extends DividerProps{
  hasContent:boolean
}

const Divider:React.FC<DividerProps> = ({bgcolor=oc.gray[6], w='100%', h='.1rem',content='', ...rest})=>{
  
  return (
    <StyledDivider 
      w={w}
      h={h}
      bgcolor={bgcolor}
      hasContent={!!content}
      {...rest}>
        {
          content && <span>
            {content}
          </span>
        }
    </StyledDivider>
  )
}

export default Divider