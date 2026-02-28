
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, trendUp, color }) => {
  const colorMap: Record<string, string> = { 
    blue: 'bg-blue-50 text-blue-600', 
    emerald: 'bg-emerald-50 text-emerald-600', 
    amber: 'bg-amber-50 text-amber-600', 
    indigo: 'bg-indigo-50 text-indigo-600' 
  };
  
  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm transition-all group hover:shadow-2xl hover:-translate-y-1">
      <div className="flex justify-between items-start mb-8">
        <div className={`p-5 rounded-2xl ${colorMap[color]} shadow-inner group-hover:scale-110 transition-transform`}>{icon}</div>
        <div className={`flex items-center gap-1.5 text-[10px] font-black px-4 py-2 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {trend}
        </div>
      </div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2">{label}</p>
      <h3 className="text-4xl font-black text-slate-900 tracking-tightest">{value}</h3>
    </div>
  );
};

export default StatCard;
