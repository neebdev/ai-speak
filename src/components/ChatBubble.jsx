import React from "react";

const ChatBubble = ({ message, isUser }) => {
  return (
    <div className={`chat-bubble ${isUser ? "user" : "character"}`}>
      <p>{message}</p>
    </div>
  );
};

export default ChatBubble;