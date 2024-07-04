import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import RegisterAndLogin from './components/RegisterAndLogin';
import ChatBox from './components/ChatBox';

function Home() {
    const {name, id} = useContext(UserContext);
    if(name){
        return <ChatBox />
    }
  return (
    <RegisterAndLogin />
  )
}

export default Home
