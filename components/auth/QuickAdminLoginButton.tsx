"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { quickAdminLoginAction } from "@/app/actions/auth";

interface QuickAdminLoginButtonProps {
  className?: string;
  callbackUrl?: string;
  onError?: (message: string | null) => void;
  showCaption?: boolean;
}

export function QuickAdminLoginButton({
  className,
  callbackUrl,
  onError,
  showCaption = true,
}: QuickAdminLoginButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Only render button in development to avoid exposing credentials elsewhere
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  async function handleQuickLogin() {
    try {
      setIsLoading(true);
      setLocalError(null);
      onError?.(null);

      const credentials = await quickAdminLoginAction();

      if (!credentials?.email || !credentials?.password) {
        throw new Error("Quick admin credentials not available");
      }

      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Quick admin login failed");
      }

      const target = callbackUrl || "/";
      router.push(target);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Quick admin login failed";
      setLocalError(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={handleQuickLogin}
        disabled={isLoading}
        className={className ?? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"}
      >
        <Zap className="mr-2 h-4 w-4" />
        {isLoading ? "Quick Admin Login..." : "Quick Admin Login (Dev)"}
      </Button>
      {showCaption && (
        <p className="text-center text-xs text-muted-foreground">
          Development only – uses ADMIN_MAIL and ADMIN_PASS from .env
        </p>
      )}
      {localError && <p className="text-center text-xs text-destructive">{localError}</p>}
    </div>
  );
}

