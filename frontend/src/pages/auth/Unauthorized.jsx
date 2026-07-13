import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  return (
    <div className="w-full max-w-md p-6 bg-card border border-border rounded-2xl shadow-lg text-center select-none">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-destructive/10 rounded-full text-destructive border border-destructive/20">
          <ShieldAlert className="w-10 h-10" />
        </div>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
        Access Denied
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        You do not have the required permissions to view this resource. Please contact your system administrator or log in with an authorized account.
      </p>

      <div className="flex flex-col gap-2">
        <Button asChild className="w-full rounded-xl h-10 font-semibold cursor-pointer">
          <Link to="/">
            Go to Portal Root
          </Link>
        </Button>
        <Link
          to="/login"
          className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Log in with different account
        </Link>
      </div>
    </div>
  );
}
