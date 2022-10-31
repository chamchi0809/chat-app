import React, { HTMLAttributes, HTMLInputTypeAttribute, HTMLProps, InputHTMLAttributes, useState } from 'react'
import oc from 'open-color'
import { styledSize } from '../../styles/SizeStyles'
import styled from '@emotion/styled'
import { css } from '@emotion/react'


const sizeStyles = {
  sm: css`
  height: 54px;
  font-size: 14px;
  padding: 0 14px;
  margin: 6px 14px;
  `,
  md: css`
  height: 56px;
  font-size: 16px;
  padding: 0 16px;
  margin: 8px 16px;
  `,
  lg: css`
  height: 58px;
  font-size: 18px;
  padding: 0 18px;
  margin: 10px 18px;
  `,
}
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>,'size'>{
  size?:styledSize
  color?:string
  bgcolor?:string
  borderColor?:string
  enableFocusEffect?:boolean
}

const Input:React.FC<InputProps> = ({color='black', bgcolor='white', size='md', borderColor=oc.gray[3], enableFocusEffect=true, ...rest})=>{
  
  return (
    <input
      css={css`
        border: 1px solid ${borderColor};
        background: ${bgcolor};
        color: ${color};
        outline: none;
        border-radius: .25rem;
        line-height: 2.5rem;
        &:focus{
          ${enableFocusEffect && css`outline: 2px solid ${oc.blue[7]};`};
        }
        ${sizeStyles[size]}
      `}
      {...rest}
    />
  )
}

export default Input