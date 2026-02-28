import React from 'react';

interface GalleryItemProps {
  img: string;
  title: string;
  category: string;
  className?: string;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ img, title, category, className }) => (
  <div className={`group relative overflow-hidden rounded-[2.5rem] shadow-2xl ${className}`}>
    <img src={img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={title} />
    <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-all duration-500 p-10 flex flex-col justify-end">
      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">{category}</span>
      <h4 className="text-2xl font-extrabold text-white leading-tight">{title}</h4>
    </div>
  </div>
);

export default GalleryItem;