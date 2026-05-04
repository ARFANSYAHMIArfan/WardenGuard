/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  CheckCircle, 
  Settings, 
  LogOut, 
  ShieldAlert 
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    <span className={`transition-transform duration-200 group-hover:scale-110 ${active ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
      {icon}
    </span>
    <span className="font-medium">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="ml-auto bg-teal-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  newReportsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, newReportsCount }) => {
  const { logout, user } = useAuth();

  return (
    <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col p-6 fixed left-0 top-0 z-20">
      <div className="flex items-center gap-3 mb-10 px-2 text-teal-400">
        <ShieldAlert size={28} />
        <h1 className="text-xl font-bold tracking-tight text-white uppercase italic">WardenGuard</h1>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
        />
        <NavItem 
          icon={<Inbox size={20} />} 
          label="Incoming Reports" 
          active={activeTab === 'incoming'} 
          onClick={() => setActiveTab('incoming')} 
          badge={newReportsCount}
        />
        <NavItem 
          icon={<CheckCircle size={20} />} 
          label="Reviewed Cases" 
          active={activeTab === 'reviewed'} 
          onClick={() => setActiveTab('reviewed')} 
        />
        <NavItem 
          icon={<Settings size={20} />} 
          label="Settings" 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')} 
        />
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
             {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'W'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.displayName || 'Warden'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
