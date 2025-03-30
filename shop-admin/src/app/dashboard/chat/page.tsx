"use client";
import ChatSidebar from "@/components/chat/chat-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { SERVER_URL } from "@/lib/data";
import { getUserId } from "@/lib/utils";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

// Sample chat messages
const initialMessages = [
  {
    sender: "bot",
    content: "Hello! How can I help you today?",
    timestamp: "10:00 AM",
  },
];

export default function ChatPage() {
  const userId = getUserId();
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socketRef.current = io(SERVER_URL, { query: { userId: userId } });

    socketRef.current.on("connect-error", (err) => {
      console.log(err);
      toast.error("Đã xảy ra lỗi khi khởi tạo ứng dụng chat.");
    });

    socketRef.current.on("new-message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          content: data,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      sender: "user",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
    if (socketRef.current) socketRef.current.emit("send-message", newMessage);
  };

  return (
    <div className="container flex h-[80vh] mx-auto overflow-hidden shadow-xl rounded-xl border border-gray-200">
      {/* Chat sidebar */}
      <ChatSidebar />

      {/* Chat main area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-3 flex items-center justify-between h-[70px] ">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <Bot size={16} />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
        </div>

        <ScrollArea className="p-4 h-[calc(80vh-130px)]">
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-2 max-w-[80%] ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback>
                      {message.sender === "user" ? (
                        <User size={16} />
                      ) : (
                        <Bot size={16} />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
        </ScrollArea>

        <div className="h-[60px] flex items-center gap-2 border-t p-3 ">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-10 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}>
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
