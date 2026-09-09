'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { ArrowUpRight } from 'lucide-react';
import { formatGBP } from '@/lib/utils';

export default function MechanicEarningsPage() {
  const { serviceRequests, currentMechanicProfile } = useApp();

  const completedJobs = serviceRequests.filter(
    (r) => r.mechanic_id === currentMechanicProfile.id && r.status === 'completed'
  );

  const totalEarningsGBP = completedJobs.reduce(
    (acc, job) => acc + ((job.labor_amount || 0) + (job.parts_amount || 0) * 0.9),
    0
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-black text-[#181528] tracking-tight">Earnings & Payouts</h1>
        <p className="text-xs text-slate-500 mt-0.5">Net contractor disbursements & completed service breakdowns</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-[#5610d8] via-[#5e17eb] to-[#6822f3] text-white rounded-3xl p-5 shadow-purple-cta flex flex-col gap-3">
        <span className="text-[10px] font-bold text-purple-200 uppercase tracking-wider">
          Available Balance (GBP)
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-white">
            {formatGBP(totalEarningsGBP || 685.0)}
          </span>
          <span className="text-xs text-emerald-300 font-bold flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +18% this week
          </span>
        </div>

        <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs text-purple-100">
          <span>Next direct payout:</span>
          <span className="font-bold text-white">Friday (Weekly BACS)</span>
        </div>
      </div>

      {/* Financial stats */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Contractor Share</span>
          <p className="text-lg font-black text-emerald-600 mt-1">88%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">On all labour charges</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Jobs Done</span>
          <p className="text-lg font-black text-[#181528] mt-1">
            {currentMechanicProfile.jobs_completed}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Completed call-outs</p>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-sm font-black text-slate-900 mb-2.5">Recent Disbursements</h2>

        <div className="flex flex-col gap-2.5">
          {completedJobs.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 text-center shadow-card text-xs text-slate-500">
              No payouts recorded yet. Complete your first mobile job to release earnings.
            </div>
          ) : (
            completedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-slate-100 rounded-3xl p-3.5 shadow-card flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-black text-slate-900 capitalize">
                    {job.service_type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {job.vehicle?.year} {job.vehicle?.make} • {new Date(job.created_at).toLocaleDateString('en-GB')}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-black text-emerald-600">
                    +{formatGBP((job.labor_amount || 0) + (job.parts_amount || 0) * 0.9)}
                  </p>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Via Stripe UK</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
