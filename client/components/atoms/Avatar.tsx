import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { HTMLAttributes } from 'react';
import { IUser } from '../../pages/api/schema';
import { styledSize } from '../../styles/SizeStyles';
import { useProfilePopUpStore, useUserInfoPopUpStore } from '../../zustand/PopUp';

const sizeStyles = {
  xs:css`
  min-width: 24px;
  width: 24px;
  height: 24px;  
  `,
  sm: css`
  min-width: 32px;
  width: 32px;
  height: 32px;
  font-size: 6px;
  `,
  md: css`
  min-width: 48px;
  width: 48px;
  height: 48px;
  font-size: 7px;
  `,
  lg: css`
  min-width: 64px;
  width: 64px;
  height: 64px;
  font-size: 8px;
  `,
  xl: css`
  min-width: 84px;
  width: 84px;
  height: 84px;
  font-size: 10px;
  `,
  xxl:css`
    min-width: 108px;
    width: 108px;
    height: 108px;
    font-size: 12px;
  `
};

const StyledAvatar = styled.div<AvatarProps>`

  cursor: pointer;
  border-radius: 50%;
  background-image: url(${props=>props.imageUrl});
  background-position: center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  font-weight: bold;

  &>div{
    display: flex;
    opacity: 0%;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: rgba(0,0,0,0.5);
    justify-content: center;
    align-items: center;
    user-select: none;
    transition: opacity .1s;
  }

  ${props=>sizeStyles[props.size]}
  ${props=>props.user && css`
    &:hover>div{
      opacity: 100%;
    }
  `}
  
`;

interface AvatarProps extends HTMLAttributes<HTMLDivElement>{
  size?:styledSize|'xs'|'xl'|'xxl'
  imageUrl:string
  user?:IUser
} 

const Avatar:React.FC<AvatarProps> = ({size='md', user=null,...rest})=>{
  
  const {turnOn:turnProfilePopUpOn} = useProfilePopUpStore();
  const {turnOff:turnUserInfoPopUpOff} = useUserInfoPopUpStore();

  return (
    <StyledAvatar
      onClick={(e)=>{
        if(user){
          turnProfilePopUpOn(user);
          turnUserInfoPopUpOff();
        }
      }}
      user={user}
      size={size}
      {...rest}>
      <div><span>VIEW PROFILE</span></div>
    </StyledAvatar>
  )
}

export default Avatar