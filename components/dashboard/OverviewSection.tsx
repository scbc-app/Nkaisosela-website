
import React from 'react';
import { 
  Package, 
  Truck, 
  Briefcase, 
  ShieldCheck, 
  Database, 
  Sparkles, 
  Loader2 
} from 'lucide-react';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis 
} from 'recharts';
import { SheetRow, SheetMetadata, AppContent } from '../../types';
import StatCard from './StatCard';

interface OverviewSectionProps {
  data: SheetRow[];
  metadata: SheetMetadata | null;
  content: AppContent;
  isAnalyzing: boolean;
  aiAnalysis: any;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ data, metadata, content, isAnalyzing, aiAnalysis }) => {
  const totalItems = data.length;

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      <div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tightest leading-tight uppercase">Operational Insights</h2>
        <p className="text-slate-500 text-sm font-medium mt-2 max-w-2xl">Real-time performance monitoring for Nkaisosela's digital infrastructure. Pulling live data from <span className="text-indigo-600 font-black">{metadata?.name}</span>.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Catalog Size" value={totalItems.toString()} icon={<Package size={22} />} trend="+2.4%" trendUp={true} color="blue" />
        <StatCard label="Active Services" value={content.services.length.toString()} icon={<Truck size={22} />} trend="Stable" trendUp={true} color="emerald" />
        <StatCard label="Live Jobs" value={content.careers.length.toString()} icon={<Briefcase size={22} />} trend="+1 New" trendUp={true} color="amber" />
        <StatCard label="Sync Health" value="Optimal" icon={<ShieldCheck size={22} />} trend="100%" trendUp={true} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Distribution</h3>
              <p className="text-sm font-bold text-slate-900 mt-1">Live Categorization Map</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest">
              <Database size={12} /> Total: {data.length}
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.slice(0, 15)}>
                <defs>
                  <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="id" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }} 
                  itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="Price" stroke="#4f46e5" strokeWidth={5} fillOpacity={1} fill="url(#colorMain)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl flex flex-col">
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/40">
                <Sparkles size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tightest uppercase">AI Intelligence</h3>
                <p className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em]">Operational Auditor</p>
              </div>
            </div>

            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-6">
                <Loader2 size={32} className="text-indigo-500 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Processing Cloud Dataset...</p>
              </div>
            ) : aiAnalysis ? (
              <div className="space-y-10">
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl italic text-xs leading-relaxed text-slate-300">
                  "{aiAnalysis.summary}"
                </div>
                <div className="space-y-6">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Strategic Highlights</h4>
                  <div className="space-y-4">
                    {aiAnalysis.keyInsights?.slice(0, 3).map((insight: string, idx: number) => (
                      <div key={idx} className="flex gap-4 items-start group">
                        <div className="h-6 w-6 rounded-lg bg-indigo-600/30 border border-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {idx + 1}
                        </div>
                        <p className="text-[11px] font-bold text-slate-200 leading-relaxed">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : <div className="py-20 text-center opacity-40 italic text-sm">Awaiting spreadsheet analysis...</div>}
          </div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]"></div>
          <button className="mt-8 relative z-10 w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-[0.98] shadow-xl">Full Audit Export</button>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
