import { useEffect, useRef } from "react";
import { Card, Input, Button, Typography, Space, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";
import "../../assets/css/chatui.css";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const {  Text } = Typography;

const renderMessageContent = (msg) => {
  return (
    <ReactMarkdown
      children={msg.content}
      components={{
        code({ node, inline, className, children, ...props }) {
          return !inline ? (
            <SyntaxHighlighter
              style={oneDark}
              language="javascript" // Or detect dynamically
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code style={{ backgroundColor: "#eee", padding: "2px 4px" }}>
              {children}
            </code>
          );
        },
        ol: ({ children }) => <ol style={{ paddingLeft: 20 }}>{children}</ol>,
        ul: ({ children }) => <ul style={{ paddingLeft: 20 }}>{children}</ul>,
      }}
    />
  );
};

const ChatUI = ({ messages, input, setInput, sendMessage, loading }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: "80vh",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 10,
          margin: 20,
          background: "#333",
          borderRadius: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "12px",
              background: "#333",
            }}
          >
            <div
              style={{
                backgroundColor:
                  msg.role === "user" ? "#1678ff" : "rgba(0, 140, 0, 0.5)",
                color: "white",
                padding: "12px 16px",
                borderRadius: "16px",
                maxWidth: "60%",
                wordBreak: "break-word",
              }}
            >
              <>
                <div>
                  <Text strong>{msg.role === "user" ? "You" : "Bot"}:</Text>
                  {renderMessageContent(msg)}
                </div>
              </>
            </div>
          </div>
        ))}{" "}
        {loading ? (
          <Spin
            size="large"
            style={{ display: "block", margin: "40px auto" }}
          />
        ) : null}
        <div ref={chatEndRef} />{" "}
        <Space.Compact style={{ width: "100%" }}>
          <Input
            className="custom-chat-input"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={sendMessage}
            disabled={loading}
          />
          <Button
            icon={<SendOutlined />}
            type="primary"
            onClick={sendMessage}
            loading={loading}
            style={{ padding: "20px 35px" }}
          />
        </Space.Compact>
      </div>
    </Card>
  );
};

export default ChatUI;
