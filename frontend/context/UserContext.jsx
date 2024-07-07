import axios from 'axios';
import {createContext, useEffect, useState} from 'react'
import { serverUrl } from '../src/constants/Constant';
import RegisterAndLogin from '../src/components/RegisterAndLogin';


export const UserContext = createContext({});


export function UserContextProvider({children}){
    const [name, setName] = useState(null);
    const [id, setId] = useState(null);

    useEffect(() =>{
        const fetchData = async () => {
            try {
                const response = await axios.get(`${serverUrl}/v1/users/profile`);
                setId(response.data.userId);
                setName(response.data.name);
            } catch (error) {
                console.error("Error fetching data", error);
            };
        }
        fetchData();
    }, []);


    return(
        <UserContext.Provider value={{name, setName, id, setId}}>
            {children}
        </UserContext.Provider>
    )
}