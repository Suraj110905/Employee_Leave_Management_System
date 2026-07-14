import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { leaveService } from "@/services/mock/leaveService";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import SectionHeader from "@/components/dashboard/SectionHeader";
import LeaveForm from "@/components/leave-application/LeaveForm";
import BalanceWidget from "@/components/leave-application/BalanceWidget";
import LeaveSummaryCard from "@/components/leave-application/LeaveSummaryCard";

/**
 * Stateful Page Orchestrator for Leave Application.
 * Manages balances downloads, triggers submissions, and feeds dynamic data properties.
 */
export default function ApplyLeave() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [balances, setBalances] = useState([]);
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Field change observer to update live preview summary cards
  const [activeFormFields, setActiveFormFields] = useState({
    leaveType: "Annual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const fetchBalances = async () => {
    setLoadingBalances(true);
    setErrorMsg("");
    try {
      const data = await leaveService.getBalances(user?.id || "EMP-10024");
      setBalances(data);
    } catch (err) {
      setErrorMsg(err?.message || "Failed to retrieve leave balances.");
    } finally {
      setLoadingBalances(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [user]);

  const handleFormChange = (formData) => {
    setActiveFormFields(formData);
  };

  const handleSubmitLeave = async (leaveData) => {
    setSubmitting(true);
    setErrorMsg("");
    try {
      await leaveService.submitLeave(user?.id || "EMP-10024", leaveData);
      setSubmitSuccess(true);
      
      // Auto redirect to leave history screen after brief delay to allow review
      setTimeout(() => {
        navigate(ROUTES.EMPLOYEE.HISTORY, { replace: true });
      }, 1500);
    } catch (err) {
      setErrorMsg(err?.message || "Submitting leave request failed. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingBalances) {
    return (
      <div className="space-y-6 font-sans text-left">
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-left select-none">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Apply for Leave</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Submit a new request for authorization and review
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 bg-destructive/10 border border-destructive/25 text-destructive text-xs rounded-xl font-medium animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <div className="flex-1 flex justify-between items-center gap-4">
            <span>{errorMsg}</span>
            {balances.length === 0 && (
              <button
                onClick={fetchBalances}
                className="flex items-center gap-1 text-[10px] uppercase font-extrabold text-foreground border border-border hover:bg-accent px-2 py-1 rounded cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </button>
            )}
          </div>
        </div>
      )}

      {submitSuccess && (
        <div className="flex flex-col items-center justify-center p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl mb-4 text-center animate-fadeIn">
          <CheckCircle className="w-10 h-10 mb-2 animate-bounce" />
          <span className="text-sm font-bold">Leave Request Submitted Successfully!</span>
          <span className="text-[10px] text-emerald-600/80 mt-1">
            Deducting allowances... Redirecting to leave history logs.
          </span>
        </div>
      )}

      {!submitSuccess && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form input elements column */}
          <div className="lg:col-span-2">
            <LeaveForm
              balances={balances}
              onSubmit={handleSubmitLeave}
              onChange={handleFormChange}
              loading={submitting}
            />
          </div>

          {/* Balance sheet and previews summary card column */}
          <div className="space-y-6 lg:sticky lg:top-20">
            <BalanceWidget
              balances={balances}
              selectedType={activeFormFields.leaveType}
            />
            <LeaveSummaryCard
              leaveType={activeFormFields.leaveType}
              startDate={activeFormFields.startDate}
              endDate={activeFormFields.endDate}
              reason={activeFormFields.reason}
              balances={balances}
            />
          </div>
        </div>
      )}
    </div>
  );
}
