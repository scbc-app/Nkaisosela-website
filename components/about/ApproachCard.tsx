import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ApproachCardProps {
  title: string;
  desc: string;
}

const ApproachCard: React.FC<ApproachCardProps> = ({ title, desc }) => (
  <div className="p-12 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-xl transition-all text-center space-y-6 flex flex-col items-center">
    <CheckCircle className="text-indigo-600" size={32} />
    <h3 className="text-2xl font-extrabold text-slate-900">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default ApproachCard;