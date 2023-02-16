import styled from "@emotion/styled";
import oc from "open-color";
import {FC} from 'react';
import {css} from "@emotion/react";

const sizeStyles = {
    sm: css`
      height: 36px;
      width: 36px;
    `,
    md: css`
      height: 48px;
      width: 48px;
    `,
    lg: css`
      height: 64px;
      width: 64px;
    `,
}

const StyledSpinner = styled.div<SpinnerProps>`
  display: inline-block;
  margin: 0 auto;
  position: relative;
  border: 4px solid ${oc.gray[9]};
  border-radius: 50%;
  animation: rotate 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform: translateZ(0);
  border-top-color: ${oc.gray[4]};
  border-bottom-color: ${oc.gray[4]};
  border-left-color: ${oc.gray[4]};
  border-right-color: ${oc.gray[4]};
  margin-top: 20px;
  margin-bottom: 20px;

  ${props => sizeStyles[props.size]}
`;

export interface SpinnerProps {
    size: 'sm' | 'md' | 'lg'
}

const Spinner: FC<SpinnerProps> = ({size}) => {
    return (
        <StyledSpinner size={size}/>
    );
}

export default Spinner;
