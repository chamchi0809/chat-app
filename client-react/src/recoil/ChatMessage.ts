import {IChatMessage} from '../pages/api/schema';
import {atom, useRecoilState} from "recoil";

export const attachmentState = atom<File|undefined>({
    key: 'attachment',
    default: undefined,
})

export const messageEditingState = atom<string>({
    key: 'messageEditing',
    default: '',
})

export const replyingToState = atom<IChatMessage|undefined>({
    key: 'replyingTo',
    default: undefined,
})

export const useChatMessageState = () => {
    const [attachment, setAttachment] = useRecoilState(attachmentState);
    const [messageEditing, setMessageEditing] = useRecoilState(messageEditingState);
    const [replyingTo, setReplyingTo] = useRecoilState(replyingToState);

    return {attachment, messageEditing, replyingTo, setAttachment, setMessageEditing, setReplyingTo};
}