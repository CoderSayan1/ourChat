import './App.css'
import axios from 'axios'
import Home from './Home'
import { UserContextProvider } from '../context/UserContext'
import {ToastContainer} from 'react-toastify'

function App() {
  axios.defaults.baseURL='http://localhost:8000'
  axios.defaults.withCredentials=true

  return (
    <UserContextProvider>
      <ToastContainer 
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition: Bounce
      />
      <Home />
    </UserContextProvider>
  )
}

export default App
