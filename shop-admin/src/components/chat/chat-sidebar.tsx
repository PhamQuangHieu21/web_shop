"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Conversation, Message } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type ChatSidebarMode = "expanded" | "collapsed";

type ChatSidebarProps = {
  conversations: Conversation[];
  setCurrentConversation: React.Dispatch<
    React.SetStateAction<Conversation | undefined>
  >;
};

export default function ChatSidebar({
  conversations,
  setCurrentConversation,
}: ChatSidebarProps) {
  const [sidebarMode, setSidebarMode] = useState<ChatSidebarMode>("expanded");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`border-r flex flex-col transition-all duration-300 ease-in-out ${
        sidebarMode === "expanded" ? "w-80" : "w-14"
      }`}
    >
      {sidebarMode === "expanded" ? (
        <div className="p-3 border-b h-[70px]">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSidebarMode("collapsed");
              }}
            >
              <ChevronLeft size={18} />
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-3 h-[70px] border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSidebarMode("expanded");
            }}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      )}

      <ScrollArea className="w-80 h-[calc(80vh-70px)]">
        <div className="w-80 p-2 flex flex-col">
          {filteredConversations.map((conversation, i) => (
            <div
              key={i}
              className={`cursor-pointer bg-white hover:bg-gray-200 ${
                sidebarMode === "expanded"
                  ? "w-full h-15 p-2 mb-1 rounded-lg"
                  : "w-10 h-10 p-0 mb-2 rounded-lg"
              }`}
              title={conversation.name}
              onClick={() => setCurrentConversation(conversation)}
            >
              {sidebarMode === "expanded" ? (
                <div className="flex items-start gap-2 w-full">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback>
                      {conversation.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">
                        {conversation.name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(conversation.last_message_time)}
                      </span>
                    </div>
                    <p className="text-muted-foreground truncate">
                      {conversation.last_message}
                    </p>
                  </div>
                  {/* {conversation.unread > 0 && (
                    <div className="bg-primary text-primary-foreground text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                      {conversation.unread}
                    </div>
                  )} */}
                </div>
              ) : (
                <div className="relative flex items-center justify-center w-full h-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {conversation.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {/* {conversation.unread > 0 && (
                    <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 min-w-4 flex items-center justify-center">
                      {conversation.unread}
                    </div>
                  )} */}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
