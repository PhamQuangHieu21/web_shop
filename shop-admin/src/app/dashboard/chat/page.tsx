"use client";
import ChatSidebar from "@/components/chat/chat-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { getSocket } from "@/lib/socket";
import { Conversation, Message, NewMessageFromCustomer } from "@/lib/types";
import { formatDate, getUserId } from "@/lib/utils";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const userId = getUserId();
const socket = getSocket(userId);

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentConversation, setCurrentConversation] =
    useState<Conversation>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    function onConnectionError(error: any) {
      console.log(error);
      toast.error("Đã xảy ra lỗi khi khởi tạo ứng dụng chat.");
    }

    function onReturnConversationList(data: Conversation[]) {
      setConversations(data);
    }

    socket.emit("fetch-conversation-list");
    socket.on("connect_error", onConnectionError);
    socket.on("return-conversation-list", onReturnConversationList);
    return () => {
      socket.off("return-conversation-list", onReturnConversationList);
      socket.off("connect_error", onConnectionError);
    };
  }, []);

  useEffect(() => {
    if (currentConversation)
      socket.emit("fetch-conversation", currentConversation.conversation_id);

    function onReturnConversation(data: Message[]) {
      setMessages(data);
    }

    function onNewMessageFromCustomer(data: NewMessageFromCustomer) {
      // Add message if currently in chat
      if (
        currentConversation &&
        currentConversation.conversation_id ===
          data.conversation.conversation_id
      ) {
        setMessages((prev) => [...prev, data.message]);
      }

      // Update conversation
      setConversations((prev) => {
        const conversationIndex = prev.findIndex(
          (c) => c.conversation_id === data.conversation.conversation_id
        );
        if (conversationIndex !== -1) {
          // If the conversation exists, move it to the top
          const updatedConversations = [...prev];
          updatedConversations.splice(conversationIndex, 1);
          return [data.conversation, ...updatedConversations];
        } else {
          // If it's a new conversation, add it to the top
          return [data.conversation, ...prev];
        }
      });
    }

    socket.on("new-message-from-customer", onNewMessageFromCustomer);
    socket.on("return-conversation", onReturnConversation);
    return () => {
      socket.off("new-message-from-customer", onNewMessageFromCustomer);
      socket.off("return-conversation", onReturnConversation);
    };
  }, [currentConversation]);

  const handleSendMessage = () => {
    if (currentConversation) {
      if (newMessage.trim() === "") return;

      const date = new Date().toString();

      setMessages([
        ...messages,
        {
          message_id: 0,
          conversation_id: 0,
          sender_id: userId,
          content: newMessage,
          status: "sent",
          created_at: date,
        },
      ]);

      socket.emit("send-message-to-customer", {
        conversation_id: currentConversation.conversation_id,
        message: newMessage,
        customer_id: currentConversation.customer_id,
        date: date,
      });

      setNewMessage("");
    } else {
      toast.error("Quý khách đang không trong cuộc trò chuyện.");
    }
  };

  return (
    <div className="flex-1 p-4">
      <div className="container flex h-[80vh] mx-auto overflow-hidden shadow-xl rounded-xl border border-gray-200">
        {/* Chat sidebar */}
        <ChatSidebar
          conversations={conversations}
          setCurrentConversation={setCurrentConversation}
        />

        {/* Chat main area */}
        <div className="flex-1 flex flex-col">
          <div className="border-b p-3 flex items-center justify-between h-[70px] ">
            {currentConversation ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {currentConversation.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{currentConversation.name}</h3>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
            ) : null}
          </div>

          <ScrollArea className="p-4 h-[calc(80vh-130px)]">
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${
                    message.sender_id === userId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-2 max-w-[80%] ${
                      message.sender_id === userId
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback>
                        {message.sender_id === userId ? (
                          <User size={16} />
                        ) : (
                          currentConversation!.name.substring(0, 2)
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.sender_id === userId
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.content}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(message.created_at)}
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
    </div>
  );
}
