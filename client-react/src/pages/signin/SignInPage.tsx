import oc from 'open-color'
import {useState} from 'react'
import Button from '../../components/atoms/Button'
import Header from '../../components/atoms/Header'
import InputWithLabel from '../../components/molecules/InputWithLabel'
import SignInForm from '../../components/organisms/SignInForm'

import styles from '../../styles/LoginPage.module.css'
import Auth from '../../utils/Auth'
import {useNavigate} from "react-router-dom";


export default function SignInPage() {

    const navigate = useNavigate();
    const auth = Auth.getAuth();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const signIn = async () => {
        await auth.signin(username, password);
        navigate('/friends');
    }

    return <div className={styles.loginPage}>

        <SignInForm>
            <Header color={oc.gray[6]} size='lg'>Sign In Please.</Header>

            <InputWithLabel type='text' value={username} onChange={e => setUsername(e.target.value)}
                            label='Username' color={oc.gray[9]} bgcolor={oc.gray[3]} size='md'/>
            <InputWithLabel type='password' value={password} onChange={e => setPassword(e.target.value)}
                            label='Password' color={oc.gray[9]} bgcolor={oc.gray[3]} size='md'/>
            <Button size='lg' color='white' colorScheme='teal'
                    onClick={() => {
                        signIn();
                    }}
            >
                Submit
            </Button>
        </SignInForm>


    </div>
}