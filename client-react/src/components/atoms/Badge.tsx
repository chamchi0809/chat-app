import styled from '@emotion/styled';
import {FC, HTMLAttributes} from 'react';
import oc from "open-color";
import {AiOutlineClose} from "react-icons/ai";

const StyledBadge = styled.div<BadgeProps>`

  border-radius: 3rem;
  background-color: ${props => props.bgcolor};
  display: flex;
  align-items: center;
  padding: .4rem;
  font-size: 0.7rem;
  color: ${props => props.color};
  user-select: none;

  svg {
    font-size: 1rem;
    align-self: flex-end;
    cursor: pointer;
  }
`;

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {

    value: string
    onDelete?: () => void
    bgcolor?: string
}

const Badge: FC<BadgeProps> = ({value, onDelete = null, bgcolor = oc.gray[8], color = oc.white, ...rest}) => {

    return (
        <StyledBadge
            value={value}
            color={color}
            bgcolor={bgcolor}
            {...rest}>
            {value}{
            onDelete && <AiOutlineClose className='deleteButton' onClick={onDelete}/>
        }
        </StyledBadge>
    )
}

export default Badge