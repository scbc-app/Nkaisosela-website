
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Pencil, 
  CheckCircle, 
  RefreshCw,
  Plus,
  FileText,
  Receipt,
  Package,
  Truck,
  Newspaper,
  Image as ImageIcon,
  HelpCircle,
  X,
  ArrowLeft,
  Settings as SettingsIcon
} from 'lucide-react';
import { SheetRow, SheetMetadata, AppContent } from '../types';
import { spreadsheetService } from '../services/spreadsheetService';
import ManagementSection, { ManagementTab } from './dashboard/ManagementSection';
import ManagementModal from './dashboard/ManagementModal';

interface DashboardProps {
  data: SheetRow[];
  metadata: SheetMetadata | null;
  content: AppContent;
  scriptUrl?: string;
  onRefresh?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, metadata, content, scriptUrl, onRefresh }) => {
  const modules = [
    { id: 'products', label: 'Products', desc: 'Inventory & Parts', icon: <Package size={24} />, mode: 'manage' as const, color: 'bg-indigo-50 text-indigo-600' },
    { id: 'services', label: 'Services', desc: 'Logistics & Offerings', icon: <Truck size={24} />, mode: 'manage' as const, color: 'bg-emerald-50 text-emerald-600' },
    { id: 'blogs', label: 'Journal', desc: 'News & Updates', icon: <Newspaper size={24} />, mode: 'manage' as const, color: 'bg-rose-50 text-rose-600' },
    { id: 'gallery', label: 'Gallery', desc: 'Project Showcase', icon: <ImageIcon size={24} />, mode: 'manage' as const, color: 'bg-teal-50 text-teal-600' },
    { id: 'faqs', label: 'FAQ', desc: 'Support Ledger', icon: <HelpCircle size={24} />, mode: 'manage' as const, color: 'bg-sky-50 text-sky-600' },
    {id: 'clients', label: 'Partners', desc: 'Client Portfolio', icon: <CheckCircle size={24} />, mode: 'manage' as const, color: 'bg-emerald-50 text-emerald-600' },
    { id: 'documents', label: 'Documents', desc: 'Billing & Records', icon: <FileText size={24} />, mode: 'documents' as const, color: 'bg-amber-50 text-amber-600' },
    { id: 'settings', label: 'Settings', desc: 'System Config', icon: <SettingsIcon size={24} />, mode: 'manage' as const, color: 'bg-slate-50 text-slate-600' },
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeModule = searchParams.get('module');
  const isModuleOpen = !!activeModule;

  const [viewMode, setViewMode] = useState<'manage' | 'documents'>('manage');
  const [activeTab, setActiveTab] = useState<ManagementTab>('products');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  
  // Sync state with URL parameters
  useEffect(() => {
    if (activeModule) {
      if (activeModule === 'settings') {
        navigate('/sync');
        return;
      }
      const mod = modules.find(m => m.id === activeModule);
      if (mod) {
        setViewMode(mod.mode);
        if (mod.mode === 'manage') setActiveTab(mod.id as ManagementTab);
      }
    }
  }, [activeModule]);

  // Disable body scroll when portal is open to prevent double scrollbars
  useEffect(() => {
    if (isModuleOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isModuleOpen]);

  const openModal = (item: any = null, forcedType?: string) => {
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
      setFormData(forcedType ? { docType: forcedType } : {});
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scriptUrl) {
      alert("Spreadsheet Script URL is not configured. Go to 'Sync' to link your sheet.");
      return;
    }

    setIsSaving(true);
    try {
      const saveCategory = viewMode === 'documents' ? 'documents' : activeTab;
      const success = await spreadsheetService.saveRecord(scriptUrl, saveCategory, formData);
      
      if (success) {
        // Give the cloud a moment to process before closing
        await new Promise(r => setTimeout(r, 1500));
        setIsSaving(false);
        closeModal();
        setShowSuccessToast(true);
        if (onRefresh) onRefresh();
        setTimeout(() => setShowSuccessToast(false), 4000);
      } else {
        setIsSaving(false);
        alert("Cloud transmission error. Please check your internet or script URL.");
      }
    } catch (err) {
      setIsSaving(false);
      alert("An unexpected error occurred during save.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!scriptUrl || !confirm("CRITICAL: Are you sure you want to permanently delete this record?")) return;
    const deleteCategory = viewMode === 'documents' ? 'documents' : activeTab;
    const success = await spreadsheetService.deleteRecord(scriptUrl, deleteCategory, id);
    if (success) {
      setShowSuccessToast(true);
      if (onRefresh) onRefresh();
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-700 pb-24 relative min-h-screen">
      {/* Success Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-24 right-6 sm:bottom-10 sm:right-10 z-[500] animate-in slide-in-from-right-10">
          <div className="bg-slate-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-indigo-500/30 backdrop-blur-xl">
            <div className="bg-emerald-500 p-2 rounded-full"><CheckCircle size={20} className="text-white" /></div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest leading-none">Record Published</p>
              <p className="text-[9px] text-slate-400 font-bold mt-1">Live database synchronization complete.</p>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Header */}
      <div className="px-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tightest uppercase">
            Dashboard
          </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
            System Overview • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button onClick={onRefresh} className="flex items-center gap-3 px-6 py-3 text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-white border border-slate-100 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest group">
          <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
          <span>Sync Cloud Database</span>
        </button>
      </div>

      {/* Module Hub Grid - Visual Navigation Portal */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 px-4">
        {modules.map((mod) => (
          <button
            key={mod.id}
            onClick={() => setSearchParams({ module: mod.id })}
            className={`group relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] border transition-all duration-500 text-center ${
              (activeModule === mod.id)
                ? 'bg-white border-slate-200 shadow-2xl shadow-slate-200/50 scale-[1.05] z-10'
                : 'bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-200 hover:shadow-xl'
            }`}
          >
            <div className={`p-5 rounded-[1.5rem] mb-5 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 ${mod.color}`}>
              {mod.icon}
            </div>
            <div className="space-y-2">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                {mod.label}
              </h3>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {mod.desc}
              </p>
            </div>
            {(activeModule === mod.id) && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-12 bg-indigo-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Module Portal Overlay - Bulletproof Fixed Layout */}
      {isModuleOpen && (
        <div className="fixed inset-0 z-[1100] bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Fixed Header - High Z-Index but below Modal */}
          <div className="fixed top-0 left-0 right-0 h-16 sm:h-20 border-b border-slate-100 flex items-center px-4 bg-white z-[1110] shadow-sm">
            <div className="flex items-center gap-4 w-full max-w-6xl mx-auto">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSearchParams({});
                }}
                className="w-10 h-10 -ml-1 hover:bg-slate-100 rounded-full transition-all text-slate-900 active:scale-90 flex items-center justify-center touch-manipulation z-[1120]"
                aria-label="Go back"
              >
                <ArrowLeft size={24} strokeWidth={2.5} />
              </button>
              <div className="flex items-center gap-3">
                <div className="text-indigo-600 bg-indigo-50 p-1.5 rounded-lg hidden xs:flex">
                  {modules.find(m => m.id === (viewMode === 'documents' ? 'documents' : activeTab))?.icon && 
                    React.cloneElement(modules.find(m => m.id === (viewMode === 'documents' ? 'documents' : activeTab))?.icon as React.ReactElement, { size: 16 })}
                </div>
                <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                  {modules.find(m => m.id === (viewMode === 'documents' ? 'documents' : activeTab))?.label}
                </h2>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 hidden sm:block">Live Session</span>
              </div>
            </div>
          </div>
          
          {/* Scrollable Content Area - Padded to clear fixed header */}
          <div className="h-full overflow-y-auto overflow-x-hidden bg-slate-50/30 overscroll-contain pt-16 sm:pt-20">
            <div className="max-w-6xl mx-auto p-4 sm:p-8">
              <ManagementSection 
                activeTab={viewMode === 'documents' ? 'documents' : activeTab} 
                setActiveTab={(tab) => setActiveTab(tab)} 
                content={content} 
                data={data} 
                openModal={openModal} 
                handleDelete={handleDelete} 
              />
            </div>
          </div>
        </div>
      )}

      <ManagementModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        isSaving={isSaving} 
        editingItem={editingItem} 
        formData={formData} 
        activeTab={viewMode === 'documents' ? 'documents' : activeTab} 
        handleInputChange={handleInputChange} 
        handleSave={handleSave} 
        settings={content.settings}
      />
    </div>
  );
};

export default Dashboard;
