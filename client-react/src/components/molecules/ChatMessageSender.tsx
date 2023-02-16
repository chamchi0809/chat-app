import {css} from '@emotion/react';
import styled from '@emotion/styled';
import oc from 'open-color';
import {HTMLAttributes, useEffect, useLayoutEffect, useRef, useState} from 'react';
import ChatRoomDB from '../../utils/ChatRoomDB';
import Button from '../atoms/Button';
import {FaDove, FaPlus} from 'react-icons/fa'
import Textarea from '../atoms/Textarea';
import {useChatMessageState} from "../../recoil/ChatMessage";
import Uploader from '../../utils/Uploader';
import {SocketClient} from '../../utils/SocketClient';
import {useDraft} from "../../react-query/chatroom";
import {useQueryClient} from "react-query";

const StyledChatMessageSender = styled.div<{ rows: number }>`

  background-color: ${oc.gray[8]};
  display: flex;
  color: ${oc.gray[4]};
  border-radius: .25rem;
  display: flex;
  align-items: flex-start;
  align-content: center;
  padding: 10px 0;
  width: 100%;
  bottom: 0;
  box-sizing: border-box;

  textarea {
    width: 90%;
    margin: 0;
    padding-top: 10px;
    line-height: 20px;
    height: ${props => 40 + (props.rows - 1) * 20 + 2 + 'px'};
    min-height: 40px;
    max-height: 200px;
    overflow-y: overlay;

    &::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0);
    }

    &::-webkit-scrollbar {
      width: 6px;
      background-color: rgba(0, 0, 0, 0);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: ${oc.gray[9]};
    }
  }

  button {
    display: flex;
    justify-content: center;
    padding: 5px;
    margin: 0 10px;
  }

  & + & {
    margin-top: 1rem;
  }

  span {
    color: ${oc.gray[5]};

    b {
      color: ${oc.gray[3]};
    }
  }

`;

interface ChatMessageSenderProps extends HTMLAttributes<HTMLDivElement> {
    roomId: string
}

const ChatMessageSender: React.FC<ChatMessageSenderProps> = ({roomId, ...rest}) => {


    const queryClinet = useQueryClient();
    const {data: draft, refetch: refetchDraft} = useDraft(roomId);
    const socketClient = SocketClient.getSocketClient();
    const chatRoomDB = ChatRoomDB.getChatRoomDB();
    const uploader = Uploader.getUploader();
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null)
    const typingTimeOutRef = useRef<NodeJS.Timeout | null>(null);
    const {attachment, setAttachment, replyingTo} = useChatMessageState();

    const [rows, setRows] = useState<number>(1);

    useLayoutEffect(() => {
        setRows(draft?.split('\n').length || 1);
    }, [draft])
    useEffect(() => {
        if (draft === '') {
            socketClient.setIsTyping(roomId, false, draft);
            return;
        }
        socketClient.setIsTyping(roomId, true, draft);
        if (typingTimeOutRef.current) clearTimeout(typingTimeOutRef.current);
        typingTimeOutRef.current = setTimeout(() => socketClient.setIsTyping(roomId, false, draft), 2000);
        return () => {
            if (typingTimeOutRef.current) clearTimeout(typingTimeOutRef.current);
        }
    }, [draft])
    const sendMessage = async () => {
        if (inputRef.current)
            inputRef.current.value = '';
        const trimmedMessage = draft.trim();
        if (!trimmedMessage && !attachment) return;
        chatRoomDB.postMessage(roomId, {
            messageText: trimmedMessage,
            attachmentUrl: attachment ? (await uploader.uploadAttachment(attachment, roomId)) || '' : '',
        }, replyingTo?._id);
        queryClinet.setQueryData(['draft', roomId], '');
        setAttachment(undefined);
    }

    useEffect(() => {
        const dataTranster = new DataTransfer();
        if (attachment) {
            dataTranster.items.add(attachment);
        }
        if (fileInputRef.current) {
            fileInputRef.current.files = dataTranster.files;
        }
    }, [attachment])

    useEffect(() => {
        return (() => {
            socketClient.setIsTyping(roomId, false, draft);
        })
    }, [])


    return (
        <StyledChatMessageSender
            rows={rows}
            onKeyDown={(e) => {
                if (e.key == 'Enter') {
                    if (!e.shiftKey) {
                        sendMessage();
                    }
                }
            }}
            {...rest}>
            <Button colorScheme='gray' highlightOffset={1} color={oc.gray[2]}
                    onClick={() => fileInputRef.current?.click()} css={css`
              padding: 0;
            `}><FaPlus/></Button>
            <Textarea size='md'
                      color='white'
                      ref={inputRef}
                      bgcolor={oc.gray[7]}
                      borderColor={oc.gray[7]}
                      enableFocusEffect={false}
                      defaultValue={draft}
                      onChange={e => {
                          queryClinet.setQueryData(['draft', roomId], e.target.value);
                      }}
                      onKeyDown={e => {
                          if (!e.shiftKey && e.key === 'Enter') e.preventDefault()
                      }
                      }/>
            <Button colorScheme='gray' highlightOffset={1} color={oc.gray[2]} onClick={sendMessage}><FaDove/></Button>
            <input type="file" css={{display: 'none'}} ref={fileInputRef} onChange={e => {
                if (e.target.files) {
                    setAttachment(e.target.files[0]);
                }
            }}/>
        </StyledChatMessageSender>
    )
}

export default ChatMessageSender