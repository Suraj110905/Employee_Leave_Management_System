import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Briefcase, CalendarClock, User } from "lucide-react";

/**
 * Presentational TeamGrid component.
 * Houses team profiles roster cards.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.roster - Team members roster data.
 * @param {Function} props.onSelectMember - Opens profile details sheet drawer.
 */
export default function TeamGrid({ roster = [], onSelectMember = () => {} }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 select-none text-left">
      {roster.map((member) => {
        // Calculate dynamic active status
        const isOnLeave = member.id === "EMP-10024"; // Mock status for visual verification

        return (
          <Card key={member.id} className="p-5 border border-border bg-card text-card-foreground shadow-xs hover:shadow-md hover:border-primary/20 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <Avatar className="h-12 w-12 border border-border shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-extrabold text-sm uppercase">
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>
                
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border tracking-wider leading-none ${
                  isOnLeave
                    ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40"
                }`}>
                  {isOnLeave ? "On Leave" : "Active"}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors">
                  {member.name}
                </h4>
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                  {member.role}
                </p>
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                  {member.email}
                </p>
              </div>

              {/* Leave balances counters overview */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border text-center">
                {member.balances.slice(0, 3).map((bal) => (
                  <div key={bal.type} className="p-1.5 bg-accent/25 border border-border rounded-xl">
                    <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider block">
                      {bal.type}
                    </span>
                    <span className="text-xs font-extrabold text-foreground mt-0.5 block leading-none">
                      {bal.available}d
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={() => onSelectMember(member)}
              variant="outline"
              size="sm"
              className="w-full rounded-xl mt-5 font-semibold text-[10px] h-8 cursor-pointer flex items-center justify-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              View Profile Drawer
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
export { TeamGrid };
