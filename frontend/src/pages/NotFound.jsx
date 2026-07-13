import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 select-none font-sans">
      <div className="p-4 bg-accent rounded-2xl text-primary border border-border mb-6 animate-bounce">
        <Compass className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">
        404
      </h1>
      <p className="text-base font-semibold text-foreground/80 mb-1">
        Page Not Found
      </p>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Sorry, the page you are looking for does not exist or has been relocated to another address.
      </p>
      <Button asChild className="rounded-xl h-10 px-5 font-semibold cursor-pointer">
        <Link to="/" className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          Return Home
        </Link>
      </Button>
    </div>
  );
}
