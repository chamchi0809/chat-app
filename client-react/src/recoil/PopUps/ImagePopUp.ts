import {atom, useRecoilState} from "recoil";

const enabledState = atom({
    key: 'imagePopUpEnabled',
    default: false,
})
const imageUrlState = atom({
    key: 'imagePopUpImageUrl',
    default: '',
});

export const useImagePopUpState = () => {
    const [enabled, setEnabled] = useRecoilState(enabledState);
    const [imageUrl, setImageUrl] = useRecoilState(imageUrlState);

    const turnOn = (imageUrl: string) => {
        setEnabled(true);
        setImageUrl(imageUrl);
    }
    const turnOff = () => {
        setEnabled(false);
    }

    return {enabled, imageUrl, turnOn, turnOff};
}