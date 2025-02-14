import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/message";
import { ChatInput } from "@/components/chat/input";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Message } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/messages", {
        content,
        role: "user",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Waduh, Error Nih!",
        description: error.message || "Gagal kirim pesan nih. Coba lagi ya!",
        variant: "destructive",
      });
    },
  });

  const clearMessages = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/messages/clear");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Chat Dibersihkan",
        description: "Chat history udah bersih nih!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal bersihin chat nih. Coba lagi ya!",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <header className="text-center mb-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          AI Gaul Buatan Irfa
        </h1>
        <p className="text-muted-foreground mt-2">
          Yuk ngobrol santai bareng AI yang ngerti bahasa gaul!
        </p>
      </header>

      <ScrollArea className="flex-1 px-4 mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && <p className="text-center text-muted-foreground">Loading...</p>}
        </div>
      </ScrollArea>

      <ChatInput
        onSend={(content) => sendMessage.mutate(content)}
        onClear={() => clearMessages.mutate()}
        disabled={sendMessage.isPending || clearMessages.isPending}
      />
    </div>
  );
}
