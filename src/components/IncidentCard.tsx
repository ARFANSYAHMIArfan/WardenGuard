/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { IncidentReport } from '../services/incidentService';

interface IncidentCardProps {
  report: IncidentReport;
  onClick: (report: IncidentReport) => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ report, onClick }) => {
  const formattedDate = report.timestamp?.toDate 
    ? format(report.timestamp.toDate(), 'MMM dd, HH:mm')
    : 'Waiting...';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={() => onClick(report)}
      className="bg-slate-800 rounded-3xl border border-slate-700 h-full overflow-hidden flex flex-col group cursor-pointer hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300"
    >
      <div className="relative aspect-video bg-slate-900 group-hover:after:opacity-100 after:opacity-0 after:absolute after:inset-0 after:bg-teal-500/5 after:transition-opacity after:pointer-events-none">
        <video
          src={report.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            report.status === 'Sent' ? 'bg-teal-500 text-slate-900' : 'bg-slate-700 text-slate-400'
          }`}>
            {report.status}
          </span>
          {report.priority === 'High' && (
             <span className="flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
               <AlertTriangle size={10} />
               High Priority
             </span>
          )}
        </div>
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
      </div>

      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-teal-400">
              <MapPin size={14} />
              <span className="text-xs font-bold uppercase tracking-wider italic">{report.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock size={14} />
              <span className="text-xs tracking-wide">{formattedDate}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed italic">
          "{report.description}"
        </p>
      </div>

      <div className="px-5 py-4 bg-slate-900/50 border-t border-slate-700/50 group-hover:bg-teal-500/5 transition-colors duration-300">
        <span className="text-xs font-semibold text-slate-500 group-hover:text-teal-400 transition-colors">
          View Full Report →
        </span>
      </div>
    </motion.div>
  );
};
