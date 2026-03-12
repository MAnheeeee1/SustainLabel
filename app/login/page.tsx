"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconInnerShadowTop } from "@tabler/icons-react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">(
    searchParams.get("signup") === "true" ? "signup" : "login",
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const action = mode === "login" ? login : signup;
      const result = await action(formData);

      if (result?.error) {
        setError(result.error);
      } else if ("success" in result && result.success) {
        setEmailSent(true);
      }
    } catch (err) {
      // Re-throw Next.js redirect errors so navigation works
      if (
        err instanceof Error &&
        (err as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")
      ) {
        throw err;
      }
      setError("Något gick fel. Försök igen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <IconInnerShadowTop className="size-6" />
            <span className="text-xl font-semibold">SustainLabel</span>
          </div>
          <h1 className="text-2xl font-bold">
            {emailSent
              ? "Bekräfta din e-post"
              : mode === "login"
                ? "Logga in"
                : "Skapa konto"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {emailSent
              ? "Vi har skickat ett bekräftelsemail. Klicka på länken i mailet för att aktivera ditt konto."
              : mode === "login"
                ? "Fyll i dina uppgifter för att fortsätta"
                : "Registrera dig för att komma igång"}
          </p>
        </div>

        {/* Email confirmation state */}
        {emailSent ? (
          <p className="text-center text-sm text-muted-foreground">
            Inget mail?{" "}
            <button
              type="button"
              onClick={() => setEmailSent(false)}
              className="font-medium underline underline-offset-4 hover:text-foreground"
            >
              Försök igen
            </button>
          </p>
        ) : (
          <>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="namn@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Lösenord</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  minLength={6}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? "Väntar…"
                  : mode === "login"
                    ? "Logga in"
                    : "Skapa konto"}
              </Button>
            </form>

            {/* Toggle */}
            <p className="text-center text-sm text-muted-foreground">
              {mode === "login"
                ? "Har du inget konto?"
                : "Har du redan ett konto?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setError(null);
                }}
                className="font-medium underline underline-offset-4 hover:text-foreground"
              >
                {mode === "login" ? "Registrera dig" : "Logga in"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
