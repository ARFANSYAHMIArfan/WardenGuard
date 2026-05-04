/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Flag,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { 
  IncidentReport, 
  markAsReviewed, 
  flagAsHighPriority 
} from '../services/incidentService';

interface IncidentModalProps {
  report: IncidentReport | null;
  onClose: () => void;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({ report, onClose }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!report) return null;

  const formattedDate = report.timestamp?.toDate 
    ? format(report.timestamp.toDate(), 'MMMM dd, yyyy - HH:mm:ss')
    : 'Unknown';

  const handleReview = async () => {
    setIsUpdating(true);
    await markAsReviewed(report.id);
    setIsUpdating(false);
    onClose();
  };

  const handleFlag = async () => {
    setIsUpdating(true);
    await flagAsHighPriority(report.id);
    setIsUpdating(false);
    // Keep modal open but update status visually or close it
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/80"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[2rem] border border-slate-700 shadow-2xl overflow-hidden flex flex-col md:flex-row"
          onClick={e => e.stopPropagation()}
        >
          {/* Video Section */}
          <div className="md:w-3/5 bg-black flex items-center justify-center relative group">
            <video
              src={report.videoUrl}
              autoPlay
              controls
              loop
              className="max-h-full w-full object-contain"
            />
            {report.priority === 'High' && (
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl shadow-red-500/20">
                <AlertTriangle size={16} />
                Critical Priority
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="md:w-2/5 p-8 flex flex-col gap-8 bg-slate-900 border-l border-slate-800">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white tracking-tight italic">Incident Details</h2>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  report.status === 'Sent' ? 'bg-teal-500 text-slate-900' : 'bg-slate-700 text-slate-400'
                }`}>
                  Status: {report.status}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-teal-400 flex-shrink-0 border border-slate-700">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Observation Location</p>
                  <p className="text-md font-semibold text-slate-200">{report.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-teal-400 flex-shrink-0 border border-slate-700">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Time Captured</p>
                  <p className="text-md font-semibold text-slate-200">{formattedDate}</p>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 space-y-3">
                <div className="flex items-center gap-2 text-slate-400">
                  <AlertCircle size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Reporter Observations</span>
                </div>
                <p className="text-slate-300 italic leading-relaxed text-sm">
                  "{report.description}"
                </p>
              </div>
            </div>

            <div className="mt-auto pt-8 flex gap-3">
              <button
                disabled={isUpdating || report.status === 'Reviewed'}
                onClick={handleReview}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg ${
                  report.status === 'Reviewed'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-teal-500 text-slate-900 hover:bg-teal-400 hover:scale-[1.02] shadow-teal-500/20 active:scale-95'
                }`}
              >
                <CheckCircle2 size={18} />
                <span>{report.status === 'Reviewed' ? 'Reviewed' : 'Review Done'}</span>
              </button>

              <button
                disabled={isUpdating || report.priority === 'High'}
                onClick={handleFlag}
                className={`p-4 rounded-2xl font-bold transition-all duration-300 border ${
                  report.priority === 'High'
                    ? 'bg-red-500/10 text-red-500 border-red-500/20 cursor-not-allowed'
                    : 'bg-slate-800 text-red-400 border-slate-700 hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-105 active:scale-90'
                }`}
                title="Flag for Action"
              >
                <Flag size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
