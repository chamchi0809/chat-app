import React, { HTMLAttributes } from 'react';

import oc from 'open-color'
import styled from '@emotion/styled';

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${oc.gray[1]};
  padding: 1.5rem 3rem;
  border-radius: 12px;
  button{
    margin-top: 1rem;
    align-self: flex-end;
  }
`;

const SignInForm:React.FC<HTMLAttributes<HTMLDivElement>>=({children,...rest})=>{
  return(
    <Wrapper {...rest}>
      {children}
    </Wrapper>
  )
}

export default SignInForm