import React from 'react';

interface ContactInfoItemProps {
  icon: React.ReactNode;
  title: string;
  line1: string;
  line2: string;
}

const ContactInfoItem: React.FC<ContactInfoItemProps> = ({ icon, title, line1, line2 }) => (
  <div className="flex gap-6 group">
    <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
      {icon}
    </div>
    <div className="space-y-1">
      <h5 className="text-xs font-black uppercase tracking-widest text-slate-400">{title}</h5>
      <p className="text-lg font-bold text-slate-900">{line1}</p>
      <p className="text-sm text-slate-500 font-medium">{line2}</p>
    </div>
  </div>
);

export default ContactInfoItem;