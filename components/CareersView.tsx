
import React from 'react';
import { ArrowRight, Send, FileText, Users, Heart, Zap } from 'lucide-react';
import { JobPosition } from '../types';

interface CareersViewProps {
  jobs: JobPosition[];
}

const CareersView: React.FC<CareersViewProps> = ({ jobs }) => {
  return (
    <div className="space-y-16 sm:space-y-24 page-enter w-full overflow-x-hidden pb-20">
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-10 px-4">
        <div className="inline-block px-4 py-1.5 sm:px-5 sm:py-2 bg-indigo-50 text-indigo-600 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] rounded-full">Join Our Vision</div>
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-slate-900 leading-tight tracking-tightest uppercase">Build Your Career <br/><span className="text-indigo-600">With Industry Leaders</span></h1>
        <p className="text-sm sm:text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">Latest roles synced directly from our operational management.</p>
      </section>

      <section className="space-y-12 px-2">
        <div className="text-left space-y-2 px-4">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tightest">Current Openings</h2>
          <p className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-indigo-600">Explore Opportunities</p>
        </div>
        <div className="space-y-4 w-full">
          {jobs.map((pos) => (
            <div key={pos.id} className="p-6 sm:p-10 bg-white border border-slate-100 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 hover:shadow-xl transition-all group w-full">
              <div className="space-y-3 sm:space-y-4 flex-1">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest rounded-lg">{pos.department}</span>
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-400 text-[8px] font-black uppercase tracking-widest rounded-lg">{pos.type}</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">{pos.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed opacity-70 line-clamp-2">{pos.desc}</p>
              </div>
              <button className="w-full md:w-auto px-6 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shrink-0">Apply Now <ArrowRight size={16} /></button>
            </div>
          ))}
          {jobs.length === 0 && (
            <div className="py-20 text-center opacity-30 italic font-medium px-4">No active openings at the moment. Please check back later.</div>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto bg-slate-900 rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-16 lg:p-20 text-white relative overflow-hidden w-full">
        <div className="relative z-10 space-y-8 text-center">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tightest uppercase">General Application</h2>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left w-full">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-indigo-400 ml-1">Full Name</label>
              <input type="text" placeholder="Your Name" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:bg-white/10 transition-all text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-indigo-400 ml-1">Email Address</label>
              <input type="email" placeholder="email@example.com" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:bg-white/10 transition-all text-sm" />
            </div>
            <div className="sm:col-span-2 space-y-6">
               <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[2rem] py-10 sm:py-16 hover:border-indigo-500/50 transition-all cursor-pointer bg-white/5">
                 <FileText size={32} className="text-indigo-500 mb-3" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload CV / Portfolio (PDF)</p>
               </div>
               <button type="button" className="w-full py-4 sm:py-5 bg-indigo-600 text-white rounded-xl font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-700 active:scale-95 transition-all">Submit Application</button>
            </div>
          </form>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]"></div>
      </section>
    </div>
  );
};

export default CareersView;
