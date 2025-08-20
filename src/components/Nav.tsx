import Link from "next/link";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">⏱</span>
              </div>
              <span>TimeTracker</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/projects">Projects</NavLink>
              <NavLink href="/tasks">Tasks</NavLink>
              <NavLink href="/time">Time</NavLink>
              <NavLink href="/reports">Reports</NavLink>
              <NavLink href="/team">Team</NavLink>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Live</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 relative group"
    >
      {children}
      <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
    </Link>
  );
}


