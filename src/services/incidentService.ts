/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  updateDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  addDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface IncidentReport {
  id: string;
  location: string;
  timestamp: any;
  description: string;
  status: 'Sent' | 'Reviewed';
  priority: 'Normal' | 'High';
  videoUrl: string;
  thumbnailUrl?: string;
  reporterId?: string;
}

export function subscribeToIncidentReports(status: 'Sent' | 'Reviewed', callback: (reports: IncidentReport[]) => void) {
  const path = 'incident_reports';
  const q = query(
    collection(db, path), 
    where('status', '==', status),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const reports: IncidentReport[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as IncidentReport[];
    callback(reports);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
}

export async function markAsReviewed(reportId: string) {
  const path = `incident_reports/${reportId}`;
  try {
    await updateDoc(doc(db, 'incident_reports', reportId), {
      status: 'Reviewed',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function flagAsHighPriority(reportId: string) {
  const path = `incident_reports/${reportId}`;
  try {
    await updateDoc(doc(db, 'incident_reports', reportId), {
      priority: 'High',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Helper to seed some data
export async function seedIncidentReports() {
  const reports = [
    {
      location: 'Dorm Block A – Corridor Level 2',
      description: 'Loud noise heard near room 204. Possible unauthorized gathering.',
      status: 'Sent',
      priority: 'Normal',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-security-camera-view-of-a-parking-lot-at-night-42414-preview.mp4',
      timestamp: serverTimestamp()
    },
    {
      location: 'Canteen – Rear Exit',
      description: 'Student seen jumping the fence at 11:30 PM.',
      status: 'Sent',
      priority: 'High',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-security-camera-view-of-an-empty-corridor-42416-preview.mp4',
      timestamp: serverTimestamp()
    },
    {
      location: 'Study Hall – Desk 12',
      description: 'Electronic cigarette found during routine scan.',
      status: 'Sent',
      priority: 'Normal',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-security-camera-view-of-an-empty-warehouse-42415-preview.mp4',
      timestamp: serverTimestamp()
    }
  ];

  for (const report of reports) {
    await addDoc(collection(db, 'incident_reports'), report);
  }
}
