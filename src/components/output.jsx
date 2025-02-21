import React, { useEffect, useRef } from "react";

const OutputDisplay = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.type}`}>
          <p>{msg.text}</p>
        </div>
      ))}
    
      <div ref={messagesEndRef} />
    </div>
  );
};

export default OutputDisplay;
