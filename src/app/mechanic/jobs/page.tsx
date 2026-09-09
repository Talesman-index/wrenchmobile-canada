'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { Briefcase, MapPin, ChevronRight } from 'lucide-react';
import { formatGBP, getStatusBadge } from '@/lib/utils';

export default function MechanicJobsPage() {
  const { serviceRequests, currentMechanicProfile } = useApp();

  const myJobs = serviceRequests.filter(
    (r) => r.mechanic_id === currentMechanicProfile.id || r.status === 'searching'
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-black text-[#181528] tracking-tight">My Jobs</h1>
        <p className="text-xs text-slate-500 mt-0.5">Active dispatches and completed mobile repair history</p>
      </div>

      <div className="flex flex-col gap-3">
        {myJobs.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-card">
            <Briefcase className="w-8 h-8 text-purple-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-[#181528]">No jobs at the moment</p>
            <p className="text-xs text-slate-500 mt-1">
              Switch to ONLINE on your dashboard to start receiving incoming London requests.
            </p>
          </div>
        ) : (
          myJobs.map((job) => {
            const badge = getStatusBadge(job.status);
            const isLive = job.status !== 'completed' && job.status !== 'cancelled';

            return (
              <Link
                key={job.id}
                href={`/mechanic/jobs/${job.id}`}
                className={`bg-white border rounded-3xl p-4 transition-all shadow-card hover:shadow-card-hover flex flex-col gap-3 ${
                  isLive ? 'border-[#5e17eb] ring-2 ring-purple-100' : 'border-slate-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <h2 className="text-sm font-black text-[#181528] mt-2">
                      {job.vehicle?.year} {job.vehicle?.make} {job.vehicle?.model}
                    </h2>
                    <p className="text-xs text-[#5e17eb] font-bold capitalize mt-0.5">
                      {job.service_type.replace(/_/g, ' ')}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-600">
                      {formatGBP(
                        job.final_amount
                          ? (job.labor_amount || 0) + (job.parts_amount || 0) * 0.9
                          : job.estimated_amount * 0.88
                      )}
                    </p>
                    <p className="text-[10px] text-slate-400">Net payout</p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-[#5e17eb] shrink-0" />
                    <span className="line-clamp-1 text-[11px]">{job.address}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[#5e17eb] font-black shrink-0 ml-2">
                    <span>{isLive ? 'Manage Job' : 'View Report'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
