import React from 'react';

interface ContactLinkProps {
  icon: React.ReactNode;
  title: string;
  line1: string;
  line2: string;
}

const HomeContactLink: React.FC<ContactLinkProps> = ({ icon, title, line1, line2 }) => (
  <div className="flex gap-6 items-start">
    <div className="p-4.5 rounded-2xl bg-white shadow-xl text-indigo-600 border border-slate-100">
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 28 }) : icon}
    </div>
    <div className="text-left space-y-1.5">
      <h5 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{title}</h5>
      <p className="text-xl font-extrabold tracking-tight text-slate-900">{line1}</p>
      <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 text-slate-500">{line2}</p>
    </div>
  </div>
);

export default HomeContactLink;