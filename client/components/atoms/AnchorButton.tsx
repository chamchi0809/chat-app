import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { HTMLAttributes } from 'react';


const StyledAnchorButton = styled.span<AnchorButtonProps>`
  color:${props=>props.color};
  text-decoration: none;
  user-select: ${props=>props.selectable ? 'all':'none'};
  cursor: pointer;
  &:hover{
    text-decoration:${props=>props.enableUnderline ? 'underline':'none'};
    color:${props=>props.highlightColor==='' ? props.color : props.highlightColor}
  }
`;

interface AnchorButtonProps extends HTMLAttributes<HTMLSpanElement>{
  enableUnderline?:boolean
  selectable?:boolean
  highlightColor?:string
}

const AnchorButton:React.FC<AnchorButtonProps> = ({selectable=false, highlightColor='', enableUnderline=true,...rest})=>{
  
  return (
    <StyledAnchorButton selectable={selectable} highlightColor={highlightColor} enableUnderline={enableUnderline} {...rest}>
      {rest.children}
    </StyledAnchorButton>
  )
}

export default AnchorButton