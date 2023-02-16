import React from 'react';

import Label from '../atoms/Label';
import Input, {InputProps} from '../atoms/Input';
import styled from '@emotion/styled';

interface InputWithLabelProps extends InputProps {
    label: string
}

const Wrapper = styled.div`
  & + & {
    margin-top: 1rem;
  }
`;


const InputWithLabel: React.FC<InputWithLabelProps> = ({label, ...rest}) => {
    return (
        <Wrapper>
            <Label htmlFor={label} size={rest.size}>{label}</Label>
            <Input id={label} {...rest}/>
        </Wrapper>
    )
}

export default InputWithLabel