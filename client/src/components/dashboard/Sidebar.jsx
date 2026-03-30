import { Home, Briefcase, Users, FileText, Mail, BarChart2, Bell, BookOpen, Settings, LayoutDashboard } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-[240px] h-full border-r border-slate-200 bg-[var(--surface)] shrink-0 flex flex-col p-4 z-20 hidden md:flex">
      {/* Brand */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent-purple)] flex items-center justify-center shadow-[0_0_15px_rgba(124,111,239,0.3)]">
          <LayoutDashboard size={18} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">CareerTransit</h1>
      </div>

      {/* Nav Section 1 */}
      <div className="flex-1 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 px-2 font-medium">Main</p>
          <nav className="space-y-1">
            <NavItem icon={Home} label="Dashboard" active />
            <NavItem icon={Briefcase} label="Applications" badge="14" />
            <NavItem icon={Users} label="Interviews" badge="3" badgeColor="bg-[var(--accent-green)]" />
            <NavItem icon={FileText} label="Resumes" />
            <NavItem icon={Mail} label="Cover Letters" />
          </nav>
        </div>

        <div>
           <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 px-2 font-medium">Insights</p>
           <nav className="space-y-1">
            <NavItem icon={BarChart2} label="Analytics" />
            <NavItem icon={Bell} label="Job Alerts" badge="5" badgeColor="bg-[var(--accent-yellow)] text-black" />
            <NavItem icon={BookOpen} label="Contacts" />
            <NavItem icon={Settings} label="Settings" />
           </nav>
        </div>
      </div>

      {/* User Avatar */}
      <div className="mt-auto px-2 py-3 flex items-center gap-3 border-t border-slate-200 pt-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--accent-purple)] to-[var(--accent-blue)] flex items-center justify-center font-bold text-white shadow-md">
          KS
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-semibold truncate text-slate-900">Kapil S.</p>
          <p className="text-xs text-slate-500 truncate">Pro Plan</p>
        </div>
      </div>
    </aside>
  );
};

// eslint-disable-next-line no-unused-vars
const NavItem = ({ icon: Icon, label, active, badge, badgeColor }) => (
  <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${active ? 'bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] border-l-2 border-[var(--accent-purple)]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-l-2 border-transparent'}`}>
    <Icon size={18} />
    <span className="text-sm font-medium flex-1 text-left">{label}</span>
    {badge && (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor || 'bg-slate-100 text-slate-900'}`}>
        {badge}
      </span>
    )}
  </button>
);

export default Sidebar;
