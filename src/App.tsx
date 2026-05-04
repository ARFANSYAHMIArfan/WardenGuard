/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardContent } from './components/Dashboard';
import { Login } from './components/Login';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { subscribeToIncidentReports } from './services/incidentService';

const AppInternal: React.FC = () => {
  const { user, isWarden, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    if (user && isWarden) {
      const unsubscribe = subscribeToIncidentReports('Sent', (data) => {
        setNewCount(data.length);
      });
      return unsubscribe;
    }
  }, [user, isWarden]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Initializing WardenGuard</p>
      </div>
    );
  }

  if (!user || !isWarden) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} newReportsCount={newCount} />
      
      <main className="pl-64 min-h-screen">
        <div className="p-10 max-w-screen-2xl mx-auto">
          <DashboardContent tab={activeTab} />
        </div>
      </main>

      {/* Subtle UI Accents */}
      <div className="fixed top-0 right-0 w-1/3 h-screen bg-teal-500/5 blur-[120px] pointer-events-none -z-10" />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppInternal />
    </AuthProvider>
  );
}
