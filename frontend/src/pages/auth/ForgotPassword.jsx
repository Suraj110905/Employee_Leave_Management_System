import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-card border border-border rounded-2xl shadow-lg text-left select-none">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Reset Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we will send you a reset link.
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-10 w-full rounded-xl bg-accent/20 border-border focus:bg-accent/40"
              required
            />
          </div>

          <Button type="submit" className="w-full rounded-xl h-10 font-semibold cursor-pointer">
            Send Reset Link
          </Button>
        </form>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/25 p-4 rounded-xl mb-4 text-emerald-600 text-sm">
          A reset link has been dispatched to <span className="font-bold">{email}</span>. Please verify your inbox.
        </div>
      )}

      <div className="mt-6 flex items-center justify-center">
        <Link
          to="/login"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
