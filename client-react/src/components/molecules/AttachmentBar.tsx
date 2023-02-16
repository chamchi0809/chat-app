import React from 'react';
import styled from '@emotion/styled';
import oc from 'open-color';
import Button from '../atoms/Button';
import {AiFillFile, AiOutlineClose} from 'react-icons/ai';
import {useChatMessageState} from "../../recoil/ChatMessage";
import {checkUrlIsImage} from '../../utils/Functions';

const StyledAttachmentBar = styled.div`
  background-color: ${oc.gray[8]};
  display: flex;
  color: ${oc.gray[4]};
  border-radius: .25rem;
  align-items: center;
  align-content: center;
  justify-self: flex-end;
  justify-content: space-between;
  user-select: none;
  padding: 20px;
  width: 100%;
  margin-top: auto;
  box-sizing: border-box;

  & + & {
    margin-top: 1rem;
  }

  .attachment {
    position: relative;
    background-color: ${oc.gray[7]};
    border-radius: .25rem;
    padding: 10px;

    .imageContainer {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 200px;
        object-fit: contain;
      }

      svg {
        width: 160px;
        height: 160px;
      }
    }

    .fileNameContainer {

    }

    button {
      position: absolute;
      left: 100%;
      top: 0;
      transform: translate(-50%, -50%);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      padding: 0;
    }
  }
`;


const AttachmentBar = () => {

    const {attachment, setAttachment} = useChatMessageState();
    if (attachment) {
        return (
            <StyledAttachmentBar>
                <div className="attachment">
                    <div className="imageContainer">
                        {
                            checkUrlIsImage(attachment.name) ?
                                <img src={URL.createObjectURL(attachment)}/>
                                :
                                <AiFillFile/>
                        }
                    </div>
                    <div className="fileNameContainer">
                        {
                            attachment.name
                        }
                    </div>
                    <Button onClick={() => setAttachment(undefined)}><AiOutlineClose color='black'/></Button>
                </div>
            </StyledAttachmentBar>
        )
    } else {
        return <></>
    }
}

export default AttachmentBar