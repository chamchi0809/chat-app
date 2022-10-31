import { useRouter } from 'next/router'
import oc from 'open-color'
import { useState } from 'react'
import Button from '../../components/atoms/Button'
import Header from '../../components/atoms/Header'
import InputWithLabel from '../../components/molecules/InputWithLabel'
import SignInForm from '../../components/organisms/SignInForm'

import styles from '../../styles/LoginPage.module.css'
import Auth from '../../utils/Auth'


export default function SigninPage(){

  const router = useRouter();
  const auth = Auth.getAuth();
  const [username,setUsername] = useState<string>('');
  const [password,setPassword] = useState<string>('');

  const signIn=async()=>{
    await auth.signin(username, password);
    router.push('chatrooms');
  }

  return <div className={styles.loginPage}>

    <SignInForm>
      <Header color={oc.gray[6]} size='lg'>Sign In Please.</Header>
      
      <InputWithLabel type='text' value={username} onChange={e=>setUsername(e.target.value)}
      label='Username' color={oc.gray[9]} bgcolor={oc.gray[3]} size='md'/>
      <InputWithLabel type='password' value={password} onChange={e=>setPassword(e.target.value)}
      label='Password' color={oc.gray[9]} bgcolor={oc.gray[3]} size='md'/>
      <Button size='lg' color='white' colorScheme='teal'
      onClick={()=>{
        signIn();
      }}
      >
        Submit
      </Button>
    </SignInForm>
    
    
  </div>
}