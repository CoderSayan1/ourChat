import axios from "axios";
import React, { useContext, useState } from "react";
import { serverUrl } from "../constants/Constant";
import { UserContext } from "../../context/UserContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterAndLogin() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoginOrRegister, setIsLogInOrRegister] = useState("login");

  const { setName: setLoggedInUserName, setId } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlName = isLoginOrRegister === "register" ? "register" : "login";

    try {
      const { data } = await axios.post(`${serverUrl}/v1/users/${urlName}`, {
        name,
        email,
        password,
      });
      if(!name || !email || !password){
        toast.error("Please fill all the fields",);
      } 
      if(data.status === 404){
        toast.error(data.message);
      }
      if(data.status === 200){
        setLoggedInUserName(name);
        setId(data.id);
        toast.success(data.message);
      }
      
    } catch (error) {
      console.log("Data fetching error", error);
    }
  };

  return (
    <div className="h-screen flex items-center">
      <form
        className="mx-auto w-[60%] bg-white flex flex-col items-center py-4 rounded-xl"
        onSubmit={handleSubmit}
      >
        <h1 className="text-black text-2xl font-bold">
          {isLoginOrRegister === "register" ? "Registration" : "Login"} form
        </h1>

        <input
          type="text"
          placeholder="Enter your name"
          className=" p-4 w-1/2 mx-auto my-2 rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter your email"
          className=" p-4 w-1/2 mx-auto my-2 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          className=" p-4 w-1/2 mx-auto my-2 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 p-3 text-lg rounded-lg">
          {isLoginOrRegister === "register" ? "Register" : "Login"}
        </button>

        <div className="text-black mt-2 text-center">
          {isLoginOrRegister === "register" && (
            <div>
              Already register?
              <button onClick={() => setIsLogInOrRegister("login")} className="mx-1 underline underline-offset-2 hover:text-blue-700">
                Login
              </button>
            </div>
          )}
          {isLoginOrRegister === "login" && (
            <div>
              Don't have an account?
              <button onClick={() => setIsLogInOrRegister("register")} className="mx-1 underline underline-offset-2 hover:text-blue-700">
                {" "}
                Register now
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default RegisterAndLogin;
