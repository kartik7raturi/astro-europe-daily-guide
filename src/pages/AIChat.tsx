import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

const AIChat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadConversation();
  }, [user, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversation = async () => {
    if (!user) return;

    try {
      // Get or create conversation
      const { data: conversations } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      let convId: string;

      if (conversations && conversations.length > 0) {
        convId = conversations[0].id;
      } else {
        // Create new conversation
        const { data: newConv } = await supabase
          .from("chat_conversations")
          .insert({ user_id: user.id, title: "New Chat" })
          .select()
          .single();
        
        convId = newConv!.id;
      }

      setConversationId(convId);

      // Load messages
      const { data: msgs } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true });

      if (msgs) {
        setMessages(msgs as Message[]);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !conversationId || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Save user message
      await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        role: "user",
        content: userMessage.content,
      });

      // Get AI response (placeholder - you'll need to implement AI endpoint)
      const aiResponse = await getAIResponse(userMessage.content);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: aiResponse,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant message
      await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: assistantMessage.content,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAIResponse = async (userMessage: string): Promise<string> => {
    // This is a placeholder. You would typically call an AI API here
    // For now, return a simple response based on keywords
    
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("love") || lowerMessage.includes("relationship")) {
      return "Based on your birth chart, I can help you with love and relationship matters. Your Venus placement suggests that you value deep emotional connections. Would you like a detailed love forecast?";
    } else if (lowerMessage.includes("career") || lowerMessage.includes("job")) {
      return "Career guidance is one of my specialties! Based on astrological influences, I can provide insights into your professional path. Your 10th house suggests strong leadership potential. What specific career concerns do you have?";
    } else if (lowerMessage.includes("health") || lowerMessage.includes("wellness")) {
      return "Health and wellness are important aspects of your astrological profile. The planetary transits indicate that focusing on balance and routine will benefit you. Would you like personalized health recommendations?";
    } else if (lowerMessage.includes("money") || lowerMessage.includes("finance")) {
      return "Financial matters can be understood through your 2nd and 8th house placements. The current planetary positions suggest opportunities for growth. Would you like a detailed financial forecast?";
    } else {
      return "I'm here to help you with any life problems using astrological insights. I can provide guidance on love, career, health, finances, and more. Please tell me more about what's on your mind, and I'll offer personalized advice based on cosmic wisdom.";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-starlight py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            AI Problem Solving Chat
          </h1>
          <p className="text-muted-foreground text-lg">
            Get personalized astrological guidance for your life problems
          </p>
        </div>

        <Card className="border-2 border-primary/20 shadow-cosmic">
          <CardHeader className="bg-gradient-cosmic/10">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Chat with AI Astrologer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages Container */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Start a conversation by typing your question below</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4 bg-card">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question here... (Press Enter to send)"
                  className="min-h-[60px] resize-none"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  variant="cosmic"
                  size="icon"
                  className="h-[60px] w-[60px]"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIChat;