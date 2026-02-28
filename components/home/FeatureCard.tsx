import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc, color }) => {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600'
  };
  return (
    <div className="p-12 bg-white border border-slate-100 rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 h-full flex flex-col group">
      <div className={`h-20 w-20 rounded-[2rem] ${colorMap[color]} flex items-center justify-center mb-10 shadow-inner group-hover:rotate-6 transition-transform duration-500`}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 36 }) : icon}
      </div>
      <h4 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">{title}</h4>
      <p className="text-slate-500 font-medium leading-relaxed opacity-90 flex-1 mb-8">{desc}</p>
      <div className="pt-8 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">
        <span>Learn More</span>
        <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
      </div>
    </div>
  );
};

export default FeatureCard;