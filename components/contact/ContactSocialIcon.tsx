import React from 'react';

interface SocialIconProps {
  icon: React.ReactNode;
}

const ContactSocialIcon: React.FC<SocialIconProps> = ({ icon }) => (
  <button className="h-12 w-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-md transition-all">
    {icon}
  </button>
);

export default ContactSocialIcon;