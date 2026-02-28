
import React, { useRef } from 'react';
import { Upload, ImageIcon, Loader2 } from 'lucide-react';

export const FormField: React.FC<{ 
  label: string; 
  name: string; 
  value: any; 
  onChange: (e: any) => void; 
  type?: string; 
  required?: boolean; 
  options?: string[]; 
  placeholder?: string; 
  rows?: number 
}> = ({ label, name, value, onChange, type = 'text', required, options, placeholder, rows = 3 }) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label} {required && '*'}</label>
    {type === 'textarea' ? (
      <textarea name={name} value={value || ''} onChange={onChange} required={required} placeholder={placeholder} rows={rows} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all shadow-inner resize-none" />
    ) : type === 'select' ? (
      <select name={name} value={value || ''} onChange={onChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer">
        <option value="">Choose Category</option>
        {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    ) : (
      <input type={type} name={name} value={value || ''} onChange={onChange} required={required} placeholder={placeholder} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all shadow-inner" />
    )}
  </div>
);

export const ImageUploadField: React.FC<{ 
  label: string; 
  value: string; 
  onUpload: (e: any) => void; 
  loading: boolean; 
  compact?: boolean 
}> = ({ label, value, onUpload, loading, compact }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div onClick={() => fileInputRef.current?.click()} className={`group relative ${compact ? 'h-24' : 'h-32'} w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-100 hover:border-indigo-400 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden`}>
        <input type="file" ref={fileInputRef} onChange={onUpload} className="hidden" accept="image/*" />
        {loading ? (
          <Loader2 className="animate-spin text-indigo-500" size={24} />
        ) : value ? (
          <>
            <img src={value} className="w-full h-full object-contain p-3 transition-opacity group-hover:opacity-40" alt="Preview" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-900"><Upload size={12} /> Update</div>
            </div>
          </>
        ) : (
          <div className="text-center space-y-1.5">
            <div className="h-8 w-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-slate-400 mx-auto group-hover:text-indigo-500 transition-colors"><ImageIcon size={16} /></div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-400">{label}</p>
          </div>
        )}
      </div>
    </div>
  );
};
