import styled from '@emotion/styled';
import oc from 'open-color';
import React, {HTMLAttributes} from 'react'

const StyledTabBar = styled.div<TabBarProps>`

  width: ${props => props.w};
  border-bottom: 2px solid ${props => props.color};
  margin-top: .5rem;
  margin-bottom: .5rem;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  gap: 40px;
`;

interface TabBarProps extends HTMLAttributes<HTMLDivElement> {
    w?: string
    color?: string
}

const TabBar: React.FC<TabBarProps> = ({color = oc.gray[6], w = '100%', ...rest}) => {

    return (
        <StyledTabBar
            w={w}
            color={color}
            {...rest}>
        </StyledTabBar>
    )
}

export default TabBar