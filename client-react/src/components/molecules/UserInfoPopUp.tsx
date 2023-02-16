import {css} from '@emotion/react';
import styled from '@emotion/styled';
import oc from 'open-color';
import {HTMLAttributes, useRef} from 'react';
import {useClickOutside} from '../../utils/Hooks';
import {useUserInfoPopUpState} from "../../recoil/PopUps/UserInfoPopUp";
import Avatar from '../atoms/Avatar';
import moment from 'moment';
import Divider from '../atoms/Divider';

const StyledUserInfoPopUp = styled.div<{ enabled: boolean, position: [number, number] }>`

  z-index: 11;
  position: sticky;
  left: ${props => props.position[0] + 'px'};
  top: ${props => props.position[1] + 'px'};
  display: flex;
  flex-direction: column;
  background-color: ${oc.gray[9]};
  color: ${oc.gray[2]};
  padding: 1rem 1rem;
  border-radius: 12px;
  transition-property: opacity, transform;
  transition-duration: .2s;
  width: 400px;

  ${props =>
    props.enabled ?
        css`
                    opacity: 100%;
                    pointer-events: all;
                  `
        :
        css`
                    opacity: 0%;
                    transform: translateY(10%);
                    pointer-events: none;
                  `
}
  .innerSection {
    display: flex;
    flex-direction: column;
    padding: 1rem 1rem;
    margin-top: 1rem;
    border-radius: 12px;
    background-color: ${oc.gray[7]};
    transition-property: transform;
    transition-duration: 0.2s;
  }
`;

interface UserInfoPopUpProps extends HTMLAttributes<HTMLDivElement> {

}

const UserInfoPopUp: React.FC<UserInfoPopUpProps> = ({...rest}) => {


    const {enabled, position, turnOff, user} = useUserInfoPopUpState();
    const ref = useRef<HTMLDivElement>(null);

    useClickOutside(ref, () => {
        if (!enabled) return;
        turnOff();
    });

    return (
        <StyledUserInfoPopUp
            position={position}
            enabled={enabled}
            ref={ref}
            {...rest}>
            {
                user &&
                <>
                    <Avatar imageUrl={user.profileImage} size='xl' user={user}/>
                    <div className="innerSection">
                        <b>{user.username}</b>
                        <Divider/>
                        {
                            user.description !== '' &&
                            <>
                                <b>ABOUT ME</b>
                                {user.description}
                            </>
                        }
                        <b>MEMBER SINCE</b>
                        {moment(user.createdAt).format('MM DD, YYYY')}
                    </div>
                </>
            }

        </StyledUserInfoPopUp>
    )
}

export default UserInfoPopUp