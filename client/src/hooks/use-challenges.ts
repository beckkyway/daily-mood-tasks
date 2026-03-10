import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { GenerateChallengeRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useGenerateChallenge() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GenerateChallengeRequest) => {
      const res = await fetch(api.challenges.generate.path, {
        method: api.challenges.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.challenges.generate.responses[400].parse(await res.json());
          throw new Error(error.message || "Invalid request");
        }
        if (res.status === 500) {
          const error = api.challenges.generate.responses[500].parse(await res.json());
          throw new Error(error.message || "Server error");
        }
        throw new Error("Failed to generate challenges. Please try again.");
      }

      return api.challenges.generate.responses[200].parse(await res.json());
    },
    onError: (error: Error) => {
      toast({
        title: "Oops!",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
