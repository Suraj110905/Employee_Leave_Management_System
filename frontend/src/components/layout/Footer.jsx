export default function Footer() {
  return (
    <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-200/60 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} LeavePortal. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
