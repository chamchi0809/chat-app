import { css } from '@emotion/react';
import styled from '@emotion/styled';
import oc from 'open-color'
import React, { LabelHTMLAttributes } from 'react';
import { styledSize } from '../../styles/SizeStyles';

const sizeStyles = {
  sm: css`
  font-size: 14px;
  padding: 0 14px;
  `,
  md: css`
  font-size: 16px;
  padding: 0 16px;
  `,
  lg: css`
  font-size: 18px;
  padding: 0 18px;
  `,
}

const StyledLabel = styled.div<LabelProps>`
  color: ${props=>props.color};
  ${props=>sizeStyles[props.size]}
`;

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement>{
  size?:styledSize
  color?:string
}


const Label:React.FC<LabelProps>=({color=oc.gray[6], size='md', ...rest})=>{
  return(
    <StyledLabel color={color} size={size}>
      <label {...rest}>{rest.children}</label>
    </StyledLabel>
  )
}

export default Label;