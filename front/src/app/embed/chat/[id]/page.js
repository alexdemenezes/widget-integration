"use client";

import { useState, useEffect } from "react";

import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_AI_API_DOMAIN ?? "http://localhost:5000";

const socket = io(URL);

export default function Chat() {

  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [historyMessages, setHistoryMessages] = useState([]);


  const handleOnClick = () => {
    setHistoryMessages([
      ...historyMessages,
      {
        user: "user",
        message: message,
      },
    ]);
    setMessage("");
    setTimeout(() => {
      socket.emit("message", message);
      setIsTyping(true);
    }, 900);
  };

  const addAnswer = (res) => {
    setIsTyping(false);
    setHistoryMessages((prevMessages) => [
      ...prevMessages,
      {
        user: "model",
        message: res,
      },
    ]);
  };

  useEffect(() => {
    socket.on("answer", (res) => {
      addAnswer(res.answer);
    });

    return () => {
      socket.off("answer");
    };
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between ">
      <div className="flex flex-col h-screen w-screen border">
          <div className="h-14 pl-10 flex flex-row justify-start  items-center bg-[#5f249f]">
          <h1 className="text-white ">Chat</h1>
        </div>
        <div className="flex-grow overflow-y-auto px-4 py-1">
          <div className="flex flex-col mb-4 gap-4 py-4 ">
            {historyMessages.map((m, i) => {
              if (m.user == "model") {
                return (
                  <div className="flex justify-start" key={m.toString()}>
                    <div
                      className="bg-gray-100 rounded-lg px-4 py-3.5 max-w-[80%] 
                  "
                    >
                      <p
                        className="text-gray-900 text-lg italic"
                      >
                        {m.message}
                      </p>
                    </div>
                  </div>
               
                );
              } else {
                return (
                  <div className="flex justify-end" key={m.toString()}>
                    <div className="bg-[#5f249f] rounded-lg px-4 py-3 max-w-[80%]">
                      <p className="text-white text-lg italic">{m.message}</p>
                    </div>
                  </div>
                );
              }
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-3.5 max-w-[80%]">
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 rounded-full animate-pulse bg-gray-400"></div>
                    <div className="h-2 w-2 rounded-full animate-pulse bg-gray-400"></div>
                    <div className="h-2 w-2 rounded-full animate-pulse bg-gray-400"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex  items-center justify-center h-16  px-6 py-8 border-t border-gray-300">
          <input
            id="send-message-input"
            type="text"
            className="py-2 w-screen mr-4 text-xl outline-none"
            placeholder="Digite uma mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div onClick={() => handleOnClick()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 cursor-pointer"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </div>
        </div>
      </div>
    </main>
  )
}
