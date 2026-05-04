/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, BarChart3, Users, Clock, AlertCircle, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  subscribeToIncidentReports, 
  IncidentReport,
  seedIncidentReports 
} from '../services/incidentService';
import { IncidentCard } from './IncidentCard';
import { IncidentModal } from './IncidentModal';

interface DashboardContentProps {
  tab: string;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ tab }) => {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    const status = tab === 'reviewed' ? 'Reviewed' : 'Sent';
    const unsubscribe = subscribeToIncidentReports(status, (data) => {
      setReports(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [tab]);

  const filteredReports = reports.filter(r => 
    r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (tab === 'dashboard') {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col gap-2">
          <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">Overview</h2>
          <p className="text-slate-500 font-medium">Real-time surveillance monitoring and analytics.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<AlertCircle className="text-orange-400" />} label="Pending Reports" value={reports.length} sub={loading ? 'Updating...' : 'Needs Attention'} />
          <StatCard icon={<Users className="text-teal-400" />} label="Active Wardens" value="08" sub="Currently Online" />
          <StatCard icon={<BarChart3 className="text-blue-400" />} label="Weekly Incident" value="12" sub="-15% from last week" />
          <StatCard icon={<Clock className="text-purple-400" />} label="Avg Response" value="14m" sub="Target: <20m" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 h-96 flex flex-col items-center justify-center text-center gap-4 group">
              <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center text-slate-600 border border-slate-700 group-hover:scale-110 transition-transform">
                <BarChart3 size={32} />
              </div>
              <h3 className="text-xl font-bold text-white italic">Incident Trends</h3>
              <p className="text-slate-500 max-w-sm">Detailed visual analytics of discipline reports over time will appear here.</p>
           </div>
           <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 flex flex-col gap-6">
              <h3 className="text-xl font-bold text-white italic">Quick Actions</h3>
              <div className="space-y-3">
                 <button 
                  onClick={seedIncidentReports}
                  className="w-full text-left p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl transition-all"
                 >
                    <p className="text-teal-400 font-bold text-xs uppercase tracking-widest mb-1">Development</p>
                    <p className="text-white text-sm font-semibold">Seed Mock Incident Data</p>
                 </button>
                 <button className="w-full text-left p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl transition-all">
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Management</p>
                    <p className="text-white text-sm font-semibold">Generate Weekly Report</p>
                 </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">
            {tab === 'incoming' ? 'Incoming Reports' : 'Reviewed Cases'}
          </h2>
          <p className="text-slate-500 font-medium">
             {tab === 'incoming' 
               ? 'New submissions pending warden review.' 
               : 'A history of incidents that have been processed.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search reports..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-6 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all w-64"
            />
          </div>
          <button className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all">
            <Filter size={20} />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
           <RefreshCw className="text-teal-400 animate-spin" size={48} />
           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Decrypting Live Feed...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 gap-6 bg-slate-900/50 border border-dashed border-slate-800 rounded-[2.5rem]">
           <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center text-slate-600 border border-slate-700">
             <Inbox size={40} />
           </div>
           <div className="text-center">
             <h3 className="text-xl font-bold text-white mb-2">Queue is Empty</h3>
             <p className="text-slate-500">No reports found matching your criteria.</p>
           </div>
           {tab === 'incoming' && (
             <button onClick={seedIncidentReports} className="px-6 py-3 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-xl font-bold hover:bg-teal-500/20 transition-all">
                Seed Test Data
             </button>
           )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredReports.map((report) => (
            <IncidentCard 
              key={report.id} 
              report={report} 
              onClick={setSelectedReport} 
            />
          ))}
        </div>
      )}

      <IncidentModal 
        report={selectedReport} 
        onClose={() => setSelectedReport(null)} 
      />
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number, sub: string }> = ({ icon, label, value, sub }) => (
  <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 flex flex-col gap-4 group hover:border-slate-700 transition-colors">
     <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:scale-110 transition-transform">
        {icon}
     </div>
     <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</p>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-black text-white italic">{value}</span>
          <span className="text-xs text-slate-600 font-medium">{sub}</span>
        </div>
     </div>
  </div>
);
