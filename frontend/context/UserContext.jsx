import axios from 'axios';
import {createContext, useEffect, useState} from 'react'
import { serverUrl } from '../src/constants/Constant';


export const UserContext = createContext({});


export function UserContextProvider({children}){
    const [name, setName] = useState(null);
    const [id, setId] = useState(null);

    useEffect(() =>{
        axios.get(`${serverUrl}/v1/users/profile`).then(response =>{
            setId(response.data.userId)
            setName(response.data.name)
        }, []);
    })
    return(
        <UserContext.Provider value={{name, setName, id, setId}}>
            {children}
        </UserContext.Provider>
    )
}