import React from 'react';

interface SocialBtnProps {
  icon: React.ReactElement;
}

const HomeSocialBtn: React.FC<SocialBtnProps> = ({ icon }) => (
  <button className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
    {React.cloneElement(icon as React.ReactElement<any>, { size: 22 })}
  </button>
);

export default HomeSocialBtn;