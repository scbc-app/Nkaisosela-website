
import React, { useState } from 'react';
import { 
  Database, 
  Package, 
  Truck, 
  Newspaper, 
  HelpCircle, 
  Image as ImageIcon,
  Pencil,
  Trash2,
  FileText,
  Filter,
  ChevronDown,
  Download,
  Upload,
  Plus,
  MoreVertical,
  Layers,
  Receipt,
  FileCheck
} from 'lucide-react';
import { SheetRow, AppContent } from '../../types';

export type ManagementTab = 'products' | 'services' | 'blogs' | 'gallery' | 'faqs' | 'documents' | 'clients';

interface ManagementSectionProps {
  activeTab: ManagementTab;
  setActiveTab: (tab: ManagementTab) => void;
  content: AppContent;
  data: SheetRow[];
  openModal: (item?: any, type?: string) => void;
  handleDelete: (id: string) => void;
}

const ManagementSection: React.FC<ManagementSectionProps> = ({ 
  activeTab, 
  setActiveTab, 
  content, 
  data, 
  openModal, 
  handleDelete 
}) => {
  const [docFilter, setDocFilter] = useState<'All' | 'Invoice' | 'Quotation' | 'Receipt'>('All');
  const [showNewDocDropdown, setShowNewDocDropdown] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const tabs = [
    { id: 'products', label: 'Products', icon: <Package size={14}/>, color: 'text-indigo-600' },
    { id: 'services', label: 'Services', icon: <Truck size={14}/>, color: 'text-emerald-600' },
    { id: 'blogs', label: 'Journal', icon: <Newspaper size={14}/>, color: 'text-rose-600' },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={14}/>, color: 'text-teal-600' },
    { id: 'faqs', label: 'FAQ', icon: <HelpCircle size={14}/>, color: 'text-sky-600' },
    { id: 'clients', label: 'Partners', icon: <FileCheck size={14}/>, color: 'text-emerald-600' },
  ];

  const getFilteredItems = () => {
    const rawItems = {
      products: data,
      services: content.services,
      blogs: content.blogs,
      faqs: content.faqs,
      gallery: content.gallery,
      documents: content.documents,
      clients: content.clients
    }[activeTab] || [];

    if (activeTab === 'documents' && docFilter !== 'All') {
      return rawItems.filter((item: any) => item.docType === docFilter);
    }
    return rawItems;
  };

  const currentItems = getFilteredItems();

  const getStatusStyle = (status: string, type: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'paid') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (s === 'overdue' || s === 'cancelled') return 'bg-rose-50 text-rose-600 border-rose-100';
    if (s === 'pending' || s === 'draft') return 'bg-amber-50 text-amber-600 border-amber-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  const docTypes = ['Invoice', 'Quotation', 'Receipt'];

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 w-full pt-2 relative overflow-x-hidden">
      
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">
            {activeTab === 'documents' ? `Financial Records` : 
             activeTab === 'products' ? 'Product Inventory' :
             activeTab === 'services' ? 'Service Offerings' :
             activeTab === 'blogs' ? 'News & Journal' :
             activeTab === 'gallery' ? 'Project Gallery' :
             activeTab === 'faqs' ? 'Support FAQ' :
             activeTab === 'clients' ? 'Partner Portfolio' :
             activeTab}
          </h2>
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
            {currentItems.length} Active Records
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => activeTab === 'documents' ? setShowNewDocDropdown(!showNewDocDropdown) : openModal()}
              className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 active:scale-95"
            >
              {activeTab === 'documents' ? (
                <>Create Document <ChevronDown size={10} /></>
              ) : (
                <><Plus size={14} /> Add New {activeTab.slice(0, -1)}</>
              )}
            </button>
            {showNewDocDropdown && activeTab === 'documents' && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-2xl z-[150] py-1.5 overflow-hidden animate-in zoom-in-95 slide-in-from-top-2">
                {docTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      openModal(null, type);
                      setShowNewDocDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center justify-between group"
                  >
                    {type}
                    <Plus size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Grid removed as navigation is handled by main dashboard grid */}
      <div className="w-full">
        {activeTab === 'documents' && (
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/50 rounded-[1.5rem] sm:rounded-2xl w-full border border-slate-200/50">
            <div className="hidden sm:flex items-center gap-2 px-3 text-[9px] font-black uppercase tracking-widest text-slate-400 border-r border-slate-200 mr-1 py-1">
              <Filter size={12}/> Filter View
            </div>
            {['All', ...docTypes].map((type) => {
              const Icon = {
                'All': <Layers size={12} />,
                'Invoice': <FileText size={12} />,
                'Quotation': <FileCheck size={12} />,
                'Receipt': <Receipt size={12} />
              }[type] || <FileText size={12} />;

              return (
                <button
                  key={type}
                  onClick={() => setDocFilter(type as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all ${
                    docFilter === type ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600 border border-transparent'
                  }`}
                >
                  {Icon} {type === 'All' ? 'All' : type.split(' ')[0]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col w-full">
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50/50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
          <div className="col-span-4">{activeTab === 'documents' ? 'Customer' : 'Item'}</div>
          <div className="col-span-2">{activeTab === 'documents' ? 'Ref' : 'Category'}</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y divide-slate-100">
          {currentItems.map((item: any) => (
            <div key={item.id} className="grid grid-cols-12 items-center gap-2 sm:gap-4 px-4 py-4 sm:px-8 sm:py-4 hover:bg-slate-50/30 transition-all group">
              {/* Customer / Identity */}
              <div className="col-span-10 md:col-span-4 flex items-center gap-2 sm:gap-3 overflow-hidden">
                {activeTab !== 'documents' && (
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 shrink-0 shadow-inner group/img relative flex items-center justify-center">
                    {(item.imageUrl || item.logoUrl) ? (
                      <img 
                        src={item.imageUrl || item.logoUrl} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-125" 
                        alt="" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-200">
                        <ImageIcon size={16} />
                        <span className="text-[6px] font-black uppercase mt-0.5">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className={`text-[10px] sm:text-[11px] font-black truncate uppercase tracking-tight ${activeTab === 'documents' ? 'text-emerald-600 hover:underline cursor-pointer' : 'text-slate-900'}`}>
                    {activeTab === 'documents' ? (item.clientName || '-') : (item.Item || item.title || item.name || item.projectName || item.question)}
                  </h4>
                  {/* Mobile-only sub-info */}
                  <div className="md:hidden flex items-center gap-2 mt-0.5">
                    <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{item.date || '-'}</span>
                    {activeTab === 'documents' && (
                      <span className={`text-[7px] font-black uppercase ${getStatusStyle(item.status, item.docType).split(' ')[1]}`}>
                        {item.status || 'Active'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Reference / Classification */}
              <div className="hidden md:col-span-2">
                <p className={`text-[10px] font-bold ${activeTab === 'documents' ? 'text-emerald-600' : 'text-indigo-600'} uppercase tracking-widest`}>
                  {activeTab === 'documents' ? `${item.docType} #${item.docNumber}` : (item.Category || item.category || item.department || item.industry || 'General')}
                </p>
              </div>

              {/* Date / Registration */}
              <div className="hidden md:col-span-2 text-[10px] font-medium text-slate-500">
                {item.date || '-'}
              </div>

              {/* Status / Value */}
              <div className="hidden md:col-span-2">
                {activeTab === 'documents' ? (
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(item.status, item.docType)}`}>
                    {item.status || 'Active'}
                  </span>
                ) : (
                  <p className="text-[10px] font-black text-slate-900">
                    {item.Price ? `K ${Number(item.Price).toLocaleString()}` : (item.Status || 'Active')}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-2 md:col-span-2 flex items-center justify-end gap-2">
                <div className="relative flex items-center gap-1">
                  <button 
                    onClick={() => openModal(item)} 
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-all text-[9px] font-bold flex items-center gap-1.5 group/btn"
                  >
                    View <ChevronDown size={10} className="group-hover/btn:translate-y-0.5 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                    className="p-1.5 text-slate-300 hover:text-slate-900 rounded-lg transition-colors"
                  >
                    <MoreVertical size={14} />
                  </button>
                  
                  {activeMenuId === item.id && (
                    <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-2xl z-[100] py-1.5 animate-in zoom-in-95">
                      <button onClick={() => { openModal(item); setActiveMenuId(null); }} className="w-full text-left px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                        <Pencil size={12} /> Edit
                      </button>
                      <button onClick={() => { handleDelete(item.id); setActiveMenuId(null); }} className="w-full text-left px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {currentItems.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center text-slate-300 text-center gap-6">
              <div className="p-8 bg-slate-50 rounded-full">
                <Database size={56} className="text-slate-200" />
              </div>
              <div className="space-y-2">
                <p className="text-[13px] font-black uppercase tracking-[0.3em] text-slate-900">Database Ledger Clear</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No matching records found for this section.</p>
              </div>
              <button 
                onClick={() => activeTab === 'documents' ? setShowNewDocDropdown(true) : openModal()}
                className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl"
              >
                Initialize First Entry
              </button>
            </div>
          )}
        </div>
        
        <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-end">
           <div className="flex items-center gap-3">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Database Live Sync</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementSection;
