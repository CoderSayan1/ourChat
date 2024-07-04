import './App.css'
import axios from 'axios'
import Home from './Home'
import { UserContextProvider } from '../context/UserContext'

function App() {
  axios.defaults.baseURL='http://localhost:8000'
  axios.defaults.withCredentials=true

  return (
    <UserContextProvider>
      <Home />
    </UserContextProvider>
  )
}

export default App
