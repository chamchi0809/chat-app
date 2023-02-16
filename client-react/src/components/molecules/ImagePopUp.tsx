import {css} from '@emotion/react';
import styled from '@emotion/styled';
import oc from 'open-color';
import {HTMLAttributes} from 'react';
import {useImagePopUpState} from "../../recoil/PopUps/ImagePopUp";
import AnchorButton from "../atoms/AnchorButton";


const StyledImagePopUp = styled.div<{ enabled: boolean }>`

  z-index: 10;
  position: absolute;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  color: ${oc.gray[2]};
  transition-property: opacity;
  transition-duration: .2s;
  width: 100vw;
  height: 100vh;

  ${props => props.enabled ?
          css`
            opacity: 100%;
            pointer-events: all;

            & > .modal {
              transform: scale(100%);
            }
          ` :
          css`
            opacity: 0%;
            pointer-events: none;

            & > .modal {
              transform: scale(10%);
            }
          `
  }
  .modal {
    display: flex;
    flex-direction: column;
    transition-property: transform;
    transition-duration: 0.2s;

    img {
      max-height: 70vh;
      object-fit: contain;
    }
  }

`;

interface ImagePopUpProps extends HTMLAttributes<HTMLDivElement> {

}
const ImagePopUp: React.FC<ImagePopUpProps> = ({...rest}) => {

    const {enabled, turnOff, imageUrl} = useImagePopUpState();

    return (
        <StyledImagePopUp
            enabled={enabled}
            onClick={(e) => {
                if (e.target === e.currentTarget) turnOff();
            }}
            {...rest}>
            <div className="modal">
                {
                    imageUrl &&
                    <img src={imageUrl} alt=""/>
                }
                <AnchorButton href={imageUrl} target={'_blank'} style={{marginTop: 20}}>Open Original</AnchorButton>
            </div>
        </StyledImagePopUp>
    )
}

export default ImagePopUp