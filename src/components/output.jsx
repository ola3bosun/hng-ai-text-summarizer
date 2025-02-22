import React, { useEffect, useRef, useMemo } from "react";

const OutputDisplay = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Memoize the rendered messages to avoid unnecessary re-renders
  const renderedMessages = useMemo(
    () =>
      messages.map((msg, index) => (
        <div key={index} className={`message ${msg.type}`}>
          <p>{msg.text}</p>
        </div>
      )),
    [messages]
  );

  return (
    <div className="messages" role="log" aria-live="polite">
      {messages.length > 0 ? (
        renderedMessages
      ) : (
        <p className="empty-message">Type a text to translate</p>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default OutputDisplay;
