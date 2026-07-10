import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      <header className="py-4 px-6 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-200">
              L
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
              LeavePortal
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium tracking-wide">
            SECURE ACCESS
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} LeavePortal. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
