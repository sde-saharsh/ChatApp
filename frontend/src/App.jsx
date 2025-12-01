import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);

  const setUser = () => {
    if (username.trim()) {
      socket.emit('setUsername', username);
      setIsUsernameSet(true);
    }
  };

  useEffect(() => {
    const handleReceive = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <div className="bg-blue-50 text-black w-screen h-screen p-5 flex flex-col items-center">
      <h1 className="text-4xl font-semibold m-5">Real Time Chat App</h1>

      {!isUsernameSet ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-96 flex flex-col items-center">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring focus:ring-blue-300"
            placeholder="Enter username..."
          />

          <button
            className="bg-blue-500 w-full text-white p-3 rounded-lg hover:bg-blue-600 transition"
            onClick={setUser}
          >
            Continue
          </button>
        </div>
      ) : (
        <div className="bg-white w-full max-w-2xl h-[75vh] rounded-lg shadow-md flex flex-col">
          
          <div className="messages-container bg-blue-200 p-4">
              {messages.map((msg, index) => (
                <p
                  key={index}
                  className="bg-blue-300 p-3 rounded-lg m-2 w-fit shadow-sm"
                >
                  {typeof msg === "string"
                    ? msg 
                    : (
                      <>
                        <strong>{msg.username}:</strong> {msg.message}
                      </>
                    )
                  }
                </p>
              ))}
            </div>


          <div className="flex p-4 bg-white rounded-b-lg border-t">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Type your message..."
            />

            <button
              className="bg-blue-500 text-white p-3 rounded-lg ml-3 hover:bg-blue-600 transition"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default App;
