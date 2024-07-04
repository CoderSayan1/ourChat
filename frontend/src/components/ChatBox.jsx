import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { uniqBy } from "lodash";
import axios from "axios";
import { serverUrl } from "../constants/Constant";
import AllUsers from "./AllUsers";

function ChatBox() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUser, setSelectedUser] = useState(null); // It takes the user id
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const autoMessageScrolling = useRef();

  const { name, id, setId, setName } = useContext(UserContext);

  const connectToWS = () => {
    const ws = new WebSocket("ws://localhost:8000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnect! Trying to reconnect...");
        connectToWS();
      }, 1000);
    });
  };

  useEffect(() => {
    connectToWS();
  }, []);

  useEffect(() => {
    const autoScroll = autoMessageScrolling.current;
    if (autoScroll) {
      autoScroll.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  });

  // to store all messages of a specific chat
  useEffect(() => {
    if (selectedUser) {
      axios
        .get(`${serverUrl}/v1/users/messages/${selectedUser}`)
        .then((res) => {
          // console.log(res.data);
          setMessages(res.data);
        });
    }
  }, [selectedUser]);

  // to show all users offline or online
  useEffect(() => {
    axios.get(`${serverUrl}/v1/users/allPeople`).then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));

      const offlinePeople = {};
      offlinePeopleArr.forEach((p) => {
        offlinePeople[p._id] = p;
      });
      // console.log({offlinePeople, offlinePeopleArr});
      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople]);

  const handleMessage = (e) => {
    // console.log(e);
    const messageData = JSON.parse(e.data);
    // console.log({e, messageData})
    // console.log(messageData);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      // console.log({ messageData });
      if (messageData.sender === selectedUser) {
        setMessages((prev) => [...prev, { ...messageData }]);
      }
    }
  };

  const showOnlinePeople = (peopleArray) => {
    // console.log(people);
    // find the unique values only
    const people = {};
    peopleArray.forEach(({ userId, name }) => {
      people[userId] = name;
    });
    // console.log(people);
    setOnlinePeople(people);
  };

  const handleSendMessage = (e, file = null) => {
    if (e) e.preventDefault();
    // console.log("Sending");
    ws.send(
      JSON.stringify({
        message: {
          recipient: selectedUser,
          text: newMessage,
          file,
        },
      })
    );

    if (file) {
      axios
        .get(`${serverUrl}/v1/users/messages/${selectedUser}`)
        .then((res) => {
          setMessages(res.data);
        });
    } else {
      setNewMessage("");
      setMessages((prev) => [
        ...prev,
        {
          text: newMessage,
          sender: id,
          recipient: selectedUser,
          _id: Date.now(),
        },
      ]);
    }
  };

  const uploadFile = (e) => {
    // console.log(e.target.files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      handleSendMessage(null, {
        name: e.target.files[0].name,
        data: reader.result,
      });
    };
  };

  const handleLogout = () => {
    axios.post(`${serverUrl}/v1/users/logout`).then(() => {
      setWs(null);
      setId(null);
      setName(null);
    });
  };

  // excluding user, other people shows in the chat
  const onlineUserExYou = { ...onlinePeople };
  delete onlineUserExYou[id];

  // prevent from double receiving messages
  const messagesWithoutDuplicates = uniqBy(messages, "_id");

  return (
    <div className="h-screen flex">
      <div className="bg-slate-700 text-white w-1/4 rounded-tl-2xl rounded-bl-2xl flex flex-col">
        <div className="flex-grow">
          <div className="flex items-center justify-center gap-2 font-bold text-lg my-4">
            OurChat
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
          </div>
          {Object.keys(onlineUserExYou).map((userId) => (
            <AllUsers
              key={userId}
              id={userId}
              name={onlineUserExYou[userId]}
              onClick={() => setSelectedUser(userId)}
              selected={userId === selectedUser}
              online={true}
            />
          ))}
          {Object.keys(offlinePeople).map((userId) => (
            <AllUsers
              key={userId}
              id={userId}
              name={offlinePeople[userId].name}
              onClick={() => setSelectedUser(userId)}
              selected={userId === selectedUser}
              online={false}
            />
          ))}
        </div>
        <div className="flex items-center justify-between p-4">
          <span className="text-lg font-semibold flex items-center gap-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>

            {name}
          </span>
          <button
            className="bg-blue-600 text-lg p-2 rounded-lg font-semibold"
            onClick={handleLogout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path
                fill-rule="evenodd"
                d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* For chatting */}
      <div className="bg-slate-400 w-3/4 text-black p-4 flex flex-col rounded-tr-2xl rounded-br-2xl">
        <div className="flex-grow">
          {!selectedUser && (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-600 text-2xl font-bold">
                Select a person from the chat
              </div>
            </div>
          )}
          {!!selectedUser && (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                {messagesWithoutDuplicates.map((message) => (
                  <div
                    key={message._id}
                    className={` ${
                      message.sender === id ? "text-right  pr-4" : "text-left"
                    }`}
                  >
                    <div
                      className={`text-left p-2 inline-block rounded-2xl my-[2px] max-w-[50%] ${
                        message.sender === id ? "bg-green-200" : "bg-blue-300"
                      }`}
                    >
                      {message.text}
                      {message.file && (
                        <div>
                          <a
                            target="_blank"
                            href={
                              axios.defaults.baseURL +
                              "/api/v1/users/uploads/" +
                              message.file
                            }
                            className="underline underline-offset-2 decoration-auto decoration-slate-500"
                          >
                            {message.file}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={autoMessageScrolling}></div>
              </div>
            </div>
          )}
        </div>
        {!!selectedUser && (
          <div className="">
            <form
              className="flex items-center gap-x-2"
              onSubmit={handleSendMessage}
            >
              <div className="relative flex items-center w-full">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  type="text"
                  className="flex-grow pl-4 pr-20 py-4 bg-white rounded-full outline-none text-gray-700 font-semibold text-lg border border-gray-300"
                  placeholder="Type your message"
                />
                <label className="absolute right-4 px-4 py-2 text-black rounded-full text-sm font-semibold cursor-pointer">
                  <input
                    type="file"
                    name="file"
                    id="file"
                    className="hidden"
                    onChange={uploadFile}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 transform -rotate-45"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                    />
                  </svg>
                </label>
              </div>
              <button className="bg-green-500 p-4 rounded-full" type="submit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBox;
