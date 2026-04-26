import { Home, Briefcase, Users, FileText, Mail, BarChart2, Bell, BookOpen, Settings } from "lucide-react";

const Sidebar = ({ activeTab = 'Dashboard', onTabChange = () => {} }) => {
  return (
    <aside className="w-[64px] h-full border-r border-slate-200 bg-[var(--surface)] shrink-0 flex flex-col py-2 z-20 hidden md:flex items-center rounded-r-lg">
      
      {/* Nav Section 1 */}
      <div className="flex-1 flex flex-col gap-2 w-full px-2 mt-1.5">
        <NavItem icon={Home} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => onTabChange('Dashboard')} />
        <NavItem icon={Briefcase} label="Applications" active={activeTab === 'Applications'} onClick={() => onTabChange('Applications')} />
        <NavItem icon={Users} label="Interviews" badge="3" badgeColor="bg-[var(--accent-green)]" active={activeTab === 'Interviews'} onClick={() => onTabChange('Interviews')} />
        <NavItem icon={FileText} label="Resumes" active={activeTab === 'Resumes'} onClick={() => onTabChange('Resumes')} />
        <NavItem icon={Mail} label="Cover Letters" active={activeTab === 'Cover Letters'} onClick={() => onTabChange('Cover Letters')} />

        <div className="w-8 h-px bg-slate-200 mx-auto my-2" />

        <NavItem icon={BarChart2} label="Analytics" active={activeTab === 'Analytics'} onClick={() => onTabChange('Analytics')} />
        <NavItem icon={Bell} label="Job Alerts" badge="5" badgeColor="bg-[var(--accent-yellow)]" active={activeTab === 'Job Alerts'} onClick={() => onTabChange('Job Alerts')} />
        <NavItem icon={BookOpen} label="Contacts" active={activeTab === 'Contacts'} onClick={() => onTabChange('Contacts')} />
        <NavItem icon={Settings} label="Settings" active={activeTab === 'Settings'} onClick={() => onTabChange('Settings')} />
      </div>

      {/* User Avatar */}
      <div className="mt-auto flex items-center justify-center pt-4 border-t border-slate-200 w-full px-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--accent-purple)] to-[var(--accent-blue)] flex items-center justify-center font-bold text-white shadow-md cursor-pointer" title="Kapil S.">
          KS
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({ icon: Icon, label, active, badge, badgeColor, onClick }) => (
  <button 
    onClick={onClick} 
    title={label}
    className={`relative w-full aspect-square flex items-center justify-center rounded-xl transition-all group ${
      active 
        ? 'bg-[var(--accent-purple)]/10 text-[var(--accent-purple)]' 
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
    }`}
  >
    {/* Accent bar for active state */}
    {active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[var(--accent-purple)] rounded-r-md" />
    )}
    
    <Icon size={18} className="group-hover:scale-110 transition-transform" />
    
    {badge && (
      <span className={`absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white rounded-full ${badgeColor || 'bg-slate-900'}`}>
        {badge}
      </span>
    )}
  </button>
);

export default Sidebar;
