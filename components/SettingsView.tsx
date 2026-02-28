
import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Link as LinkIcon, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink, 
  HelpCircle, 
  Building2, 
  Users, 
  Globe, 
  Bell, 
  Mail, 
  MapPin, 
  Shield,
  Settings as SettingsIcon,
  Smartphone,
  Save,
  Plus,
  Trash2,
  Edit,
  X,
  Lock,
  ArrowLeft,
  Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppContent, UserAccount } from '../types';
import { spreadsheetService } from '../services/spreadsheetService';

interface SettingsViewProps {
  onUpdateUrl: (url: string) => void;
  currentUrl: string;
  content: AppContent;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onUpdateUrl, currentUrl, content }) => {
  const [url, setUrl] = useState(currentUrl);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'cloud' | 'company' | 'users' | 'site'>('cloud');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [userFormData, setUserFormData] = useState<UserAccount>({
    Name: '',
    Email: '',
    Password: '',
    Role: 'User',
    LastLogin: ''
  });

  // Local state for settings to allow editing
  const [settings, setSettings] = useState<Record<string, string>>({
    phone: content.settings.phone || '+260 970 426 228',
    email: content.settings.email || 'info@nkaisosela.com',
    address: content.settings.address || 'Kapiri Mposhi, Central Province',
    pacra_id: content.settings.pacra_id || '120220042415',
    tpin: content.settings.tpin || '2000795009',
    site_name: content.settings.site_name || 'Nkaisosela Suppliers & General Dealers',
    site_icon: content.settings.site_icon || ''
  });

  useEffect(() => {
    setSettings({
      phone: content.settings.phone || '+260 970 426 228',
      email: content.settings.email || 'info@nkaisosela.com',
      address: content.settings.address || 'Kapiri Mposhi, Central Province',
      pacra_id: content.settings.pacra_id || '120220042415',
      tpin: content.settings.tpin || '2000795009',
      site_name: content.settings.site_name || 'Nkaisosela Suppliers & General Dealers',
      site_icon: content.settings.site_icon || ''
    });
  }, [content.settings]);

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 2MB for initial selection)
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large. Please select an image under 2MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 128; // Standard favicon/icon size
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Convert to compressed JPEG or PNG
          const base64String = canvas.toDataURL('image/png', 0.8);
          handleSettingChange('site_icon', base64String);
        }
        setIsUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleOpenUserModal = (user?: UserAccount) => {
    if (user) {
      setEditingUser(user);
      setUserFormData(user);
    } else {
      setEditingUser(null);
      setUserFormData({
        Name: '',
        Email: '',
        Password: '',
        Role: 'User',
        LastLogin: ''
      });
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!currentUrl) {
      alert("Please link your Google Spreadsheet first.");
      return;
    }
    if (!userFormData.Email || !userFormData.Name) {
      alert("Email and Name are required.");
      return;
    }

    setIsSaving(true);
    try {
      console.log("Saving user to:", currentUrl);
      // Use Email as ID for the spreadsheet record
      const success = await spreadsheetService.saveRecord(currentUrl, 'users', {
        ...userFormData,
        id: userFormData.Email
      });

      if (success) {
        setIsUserModalOpen(false);
        // Force a refresh of the data
        onUpdateUrl(currentUrl);
        alert("User saved successfully!");
      } else {
        alert("Failed to save user. Please check your connection and script URL.");
      }
    } catch (err) {
      console.error("Save User Error:", err);
      alert("A critical error occurred while saving the user.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (!currentUrl) return;
    if (!confirm(`Are you sure you want to remove ${email}?`)) return;

    setIsSaving(true);
    const success = await spreadsheetService.deleteRecord(currentUrl, 'users', email);
    setIsSaving(false);

    if (success) {
      onUpdateUrl(currentUrl);
    } else {
      alert("Failed to delete user.");
    }
  };

  const saveSettingsToCloud = async () => {
    if (!currentUrl) {
      alert("Please link your Google Spreadsheet first.");
      return;
    }
    setIsSaving(true);
    const success = await spreadsheetService.saveSettings(currentUrl, settings);
    setIsSaving(false);
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      onUpdateUrl(currentUrl); // Trigger a refresh
    } else {
      alert("Failed to save settings to cloud.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUrl(url);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const tabs = [
    { id: 'cloud', label: 'Cloud Engine', icon: <Database size={16} /> },
    { id: 'company', label: 'Company Profile', icon: <Building2 size={16} /> },
    { id: 'users', label: 'User Access', icon: <Users size={16} /> },
    { id: 'site', label: 'Site Config', icon: <Globe size={16} /> },
  ];

  return (
    <div className="max-w-5xl mx-auto animate-in slide-in-from-right-4 duration-500 pb-10 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin" 
            className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Settings</h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">System Administration</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                  : 'text-slate-400 hover:text-slate-600 border border-transparent'
              }`}
            >
              {tab.icon} <span className="hidden xs:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        {activeTab === 'cloud' && (
          <div className="animate-in fade-in duration-500">
            <div className="p-8 bg-slate-900 text-white relative">
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-indigo-600 rounded-xl shadow-lg">
                  <Database size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">Cloud Engine</h2>
                  <p className="text-indigo-400 text-[9px] font-black uppercase tracking-widest mt-0.5">Google Spreadsheet Bridge</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-[60px]"></div>
            </div>

            <div className="p-8 space-y-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg"><CheckCircle2 size={16}/></div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Status: Connected</h4>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Cloud Status</p>
                    <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      ACTIVE & SECURED
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Endpoint Hidden</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    'Tabs: products, services, blogs, team.',
                    'Access: "Anyone" with account.',
                    'Updates: Instant on refresh.',
                    'Format: JSON proxying.'
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-2 text-[10px] text-slate-500 font-medium">
                      <span className="text-indigo-600 font-black">{idx+1}</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'company' && (
          <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Building2 size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Company Profile</h2>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Business Reference Data</p>
                </div>
              </div>
              <button 
                onClick={saveSettingsToCloud}
                disabled={isSaving}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md flex items-center gap-2 hover:bg-indigo-600 transition-all disabled:opacity-50"
              >
                {isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                Save
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Smartphone size={12} className="text-emerald-500" /> Contact
                  </label>
                  <input 
                    type="text"
                    value={settings.phone || ''}
                    onChange={(e) => handleSettingChange('phone', e.target.value)}
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Mail size={12} className="text-emerald-500" /> Email
                  </label>
                  <input 
                    type="text"
                    value={settings.email || ''}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={12} className="text-emerald-500" /> Address
                  </label>
                  <input 
                    type="text"
                    value={settings.address || ''}
                    onChange={(e) => handleSettingChange('address', e.target.value)}
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Shield size={12} className="text-emerald-500" /> Compliance
                  </label>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-black">PACRA</p>
                      <input 
                        type="text"
                        value={settings.pacra_id || ''}
                        onChange={(e) => handleSettingChange('pacra_id', e.target.value)}
                        className="w-full bg-transparent text-[10px] font-bold text-slate-900 outline-none border-b border-transparent focus:border-emerald-500/30"
                      />
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-black">TPIN</p>
                      <input 
                        type="text"
                        value={settings.tpin || ''}
                        onChange={(e) => handleSettingChange('tpin', e.target.value)}
                        className="w-full bg-transparent text-[10px] font-bold text-slate-900 outline-none border-b border-transparent focus:border-emerald-500/30"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Users size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">User Access</h2>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Personnel Management</p>
                </div>
              </div>
              <button 
                onClick={() => handleOpenUserModal()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md flex items-center gap-2 hover:bg-indigo-700 transition-all"
              >
                <Plus size={12} />
                Invite
              </button>
            </div>

            <div className="border border-slate-100 rounded-2xl overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">User</th>
                    <th className="px-6 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {content.users.map((user, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                            {user.Name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{user.Name}</p>
                            <p className="text-[9px] text-slate-400 font-medium">{user.Email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[8px] font-black uppercase tracking-widest">
                          {user.Role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className={`h-1 w-1 rounded-full ${user.LastLogin ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                          <span className="text-[9px] font-bold text-slate-600">
                            {user.LastLogin ? 'Active' : 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => handleOpenUserModal(user)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            <Edit size={12} />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.Email)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Management Modal */}
        {isUserModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-lg">
                    <Users size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight">
                      {editingUser ? 'Edit User' : 'Invite'}
                    </h3>
                    <p className="text-indigo-400 text-[8px] font-black uppercase tracking-widest">Access Control</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsUserModalOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Name</label>
                  <input 
                    type="text"
                    value={userFormData.Name || ''}
                    onChange={(e) => setUserFormData({...userFormData, Name: e.target.value})}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                  <input 
                    type="email"
                    value={userFormData.Email || ''}
                    onChange={(e) => setUserFormData({...userFormData, Email: e.target.value})}
                    placeholder="email@example.com"
                    disabled={!!editingUser}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={userFormData.Password || ''}
                      onChange={(e) => setUserFormData({...userFormData, Password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    />
                    <Lock size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Role</label>
                  <select 
                    value={userFormData.Role || 'User'}
                    onChange={(e) => setUserFormData({...userFormData, Role: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all appearance-none"
                  >
                    <option value="User">User</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsUserModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveUser}
                    disabled={isSaving}
                    className="flex-[2] py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                    {editingUser ? 'Update' : 'Invite'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'site' && (
          <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                  <SettingsIcon size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Site Config</h2>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Global Appearance</p>
                </div>
              </div>
              <button 
                onClick={saveSettingsToCloud}
                disabled={isSaving}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md flex items-center gap-2 hover:bg-sky-600 transition-all disabled:opacity-50"
              >
                {isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                Save
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Name</label>
                  <input 
                    type="text" 
                    value={settings.site_name || ''}
                    onChange={(e) => handleSettingChange('site_name', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-sky-500/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Icon (Upload or URL)</label>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-cyan-400 rounded-xl flex items-center justify-center text-slate-900 overflow-hidden shrink-0 border border-slate-200">
                      {settings.site_icon ? (
                        <img src={settings.site_icon} className="w-full h-full object-cover" alt="Icon" />
                      ) : (
                        <Shield size={18} />
                      )}
                    </div>
                    <div className="flex-1 flex gap-2">
                      <input 
                        type="text" 
                        value={settings.site_icon || ''}
                        onChange={(e) => handleSettingChange('site_icon', e.target.value)}
                        placeholder="Paste URL or upload..."
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-sky-500/10 transition-all"
                      />
                      <label className="cursor-pointer p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center text-slate-600">
                        {isUploading ? <RefreshCw size={16} className="animate-spin" /> : <Upload size={16} />}
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  </div>
                  <p className="text-[8px] text-slate-400 font-medium italic">Recommended: Square PNG/SVG under 1MB. This will also be used as the site favicon.</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Notifications</label>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell size={14} className="text-slate-400" />
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Email</span>
                    </div>
                    <div className="w-8 h-4 bg-indigo-600 rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone size={14} className="text-slate-400" />
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Push</span>
                    </div>
                    <div className="w-8 h-4 bg-slate-200 rounded-full relative">
                      <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsView;

