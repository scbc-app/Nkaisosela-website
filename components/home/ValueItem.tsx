import React from 'react';

interface ValueItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const ValueItem: React.FC<ValueItemProps> = ({ icon, title, desc }) => (
  <div className="text-center space-y-8">
    <div className="h-24 w-24 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto text-indigo-400 border border-white/5 backdrop-blur-sm">
      {icon}
    </div>
    <div className="space-y-4">
      <h3 className="text-2xl font-extrabold text-white">{title}</h3>
      <p className="text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">{desc}</p>
    </div>
  </div>
);

export default ValueItem;