
import React, { useState, useEffect } from 'react';
import { X, Database, Loader2, Save, FileText, Printer, ChevronDown } from 'lucide-react';
import { ManagementTab } from './ManagementSection';
import DocumentForm from './modal/DocumentForm';
import StandardCMSForm from './modal/StandardCMSForm';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface ManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSaving: boolean;
  editingItem: any;
  formData: any;
  activeTab: ManagementTab;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSave: (e: React.FormEvent) => void;
  settings?: Record<string, string>;
}

const ManagementModal: React.FC<ManagementModalProps> = ({
  isOpen, onClose, isSaving, editingItem, formData, activeTab, handleInputChange, handleSave, settings
}) => {
  const [uploading, setUploading] = useState(false);
  const [items, setItems] = useState<LineItem[]>([{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }]);
  const [taxRate, setTaxRate] = useState(0);
  const [taxType, setTaxType] = useState<'On total' | 'Deducted' | 'None'>('On total');
  const [currency, setCurrency] = useState('ZMW');
  const [signatureUrl, setSignatureUrl] = useState('');
  const [documentPhotoUrl, setDocumentPhotoUrl] = useState('');
  const [amountPaid, setAmountPaid] = useState(0);
  const [docMode, setDocMode] = useState<'edit' | 'preview'>('edit');
  const [showPaymentScheduling, setShowPaymentScheduling] = useState(false);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    type: 'Flat Amount',
    amount: '',
    method: 'Cash',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
  let taxAmount = (subtotal * taxRate) / 100;
  let totalAmount = subtotal;

  if (taxType === 'On total') {
    totalAmount = subtotal + taxAmount;
  } else if (taxType === 'Deducted') {
    totalAmount = subtotal - taxAmount;
  } else {
    taxAmount = 0;
    totalAmount = subtotal;
  }
  
  const balanceDue = totalAmount - amountPaid;

  const handleSignatureChange = (url: string) => {
    setSignatureUrl(url);
    handleInputChange({ target: { name: 'signatureUrl', value: url } } as any);
  };

  const handleDocumentPhotoChange = (url: string) => {
    setDocumentPhotoUrl(url);
    handleInputChange({ target: { name: 'documentPhotoUrl', value: url } } as any);
  };

  // Auto-generate Reference Number and Date for new documents
  useEffect(() => {
    if (activeTab === 'documents' && !editingItem && isOpen) {
      const date = new Date().toISOString().split('T')[0];
      const random = Math.floor(1000 + Math.random() * 9000);
      const ref = `${formData.docType?.substring(0, 3).toUpperCase() || 'DOC'}-${date.replace(/-/g, '')}-${random}`;
      
      // Update local form state via handleInputChange mock events
      handleInputChange({ target: { name: 'docNumber', value: ref } } as any);
      handleInputChange({ target: { name: 'date', value: date } } as any);
      handleInputChange({ target: { name: 'dueDate', value: date } } as any);
    }
  }, [isOpen, activeTab, editingItem, formData.docType]);

  // Sync complex items to formData.description as JSON and update total amount
  useEffect(() => {
    if (activeTab === 'documents') {
      handleInputChange({
        target: {
          name: 'description',
          value: JSON.stringify({ items, taxRate, taxType, currency, amountPaid, signatureUrl, documentPhotoUrl })
        }
      } as any);

      handleInputChange({
        target: {
          name: 'amount',
          value: totalAmount.toString()
        }
      } as any);
    }
  }, [items, taxRate, taxType, currency, amountPaid, signatureUrl, documentPhotoUrl, activeTab, totalAmount]);

  // Load items if editing existing record
  useEffect(() => {
    if (editingItem && activeTab === 'documents' && editingItem.description) {
      try {
        const parsed = JSON.parse(editingItem.description);
        if (parsed.items) setItems(parsed.items);
        if (parsed.taxRate !== undefined) setTaxRate(parsed.taxRate);
        if (parsed.taxType !== undefined) setTaxType(parsed.taxType);
        if (parsed.currency !== undefined) setCurrency(parsed.currency);
        if (parsed.amountPaid !== undefined) setAmountPaid(parsed.amountPaid);
        if (editingItem.signatureUrl) setSignatureUrl(editingItem.signatureUrl);
        else if (parsed.signatureUrl !== undefined) setSignatureUrl(parsed.signatureUrl);
        
        if (editingItem.documentPhotoUrl) setDocumentPhotoUrl(editingItem.documentPhotoUrl);
        else if (parsed.documentPhotoUrl !== undefined) setDocumentPhotoUrl(parsed.documentPhotoUrl);
      } catch (e) {
        console.error("Failed to parse document items");
      }
    } else if (activeTab === 'documents' && !editingItem) {
      setItems([{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }]);
      setTaxRate(0);
      setTaxType('On total');
      setCurrency('ZMW');
      setSignatureUrl('');
      setDocumentPhotoUrl('');
      setAmountPaid(0);
    }
  }, [editingItem, activeTab, isOpen]);

  if (!isOpen) return null;

  const handleSaveAndPrint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // First trigger the actual cloud save
    await handleSave(e);
    
    // For documents, trigger the PDF/Print system
    if (activeTab === 'documents') {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const fieldName = activeTab === 'clients' ? 'logoUrl' : 'imageUrl';
      handleInputChange({ target: { name: fieldName, value: base64String } } as any);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-start justify-center p-0 sm:p-4 md:p-8 overflow-y-auto bg-slate-900/90 backdrop-blur-2xl">
      <div className="absolute inset-0 no-print" onClick={onClose} />
      
      <div className="relative w-full h-fit min-h-screen sm:min-h-0 sm:max-w-6xl bg-slate-50 sm:rounded-2xl shadow-2xl animate-in zoom-in-95 duration-500 border border-slate-200 flex flex-col mb-2">
        {/* Modal Header - Professional Toolbar matching reference */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0 sm:rounded-t-2xl no-print">
          <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-lg w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button 
              type="button"
              onClick={() => setDocMode('preview')}
              className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all whitespace-nowrap ${docMode === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Preview
            </button>
            <button 
              type="button"
              onClick={() => setDocMode('edit')}
              className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all whitespace-nowrap ${docMode === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Edit
            </button>
            <button 
              type="button"
              className="px-4 py-1.5 rounded-md text-[10px] font-bold text-slate-500 hover:text-slate-700 whitespace-nowrap"
            >
              History
            </button>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <button 
              type="button" 
              onClick={() => setShowPaymentScheduling(true)}
              className="px-4 py-2 bg-slate-200/50 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap"
            >
              Payment scheduling
            </button>
            <button type="button" className="px-4 py-2 bg-slate-200/50 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap">PDF</button>
            <button 
              type="submit"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm whitespace-nowrap"
            >
              {activeTab === 'documents' ? `Email ${formData.docType || 'Invoice'}` : 'Save Record'}
            </button>
            <button onClick={onClose} className="ml-auto sm:ml-2 p-1.5 text-slate-400 hover:text-slate-900 rounded-lg transition-all shrink-0"><X size={18} /></button>
          </div>
        </div>

        {/* Modal Content & Footer wrapped in Form */}
        <form onSubmit={handleSaveAndPrint} className="flex flex-col h-full overflow-hidden relative">
          
          {/* Payment Scheduling Overlay */}
          {showPaymentScheduling && (
            <div className="absolute inset-0 z-[1300] bg-slate-900/20 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8 overflow-y-auto">
              <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 mt-10">
                {/* Header */}
                <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="text-base sm:text-lg font-semibold text-slate-800">Payment Scheduling</h2>
                  <button type="button" onClick={() => setShowPaymentScheduling(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>
                
                {/* Content */}
                <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                  {/* Summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs sm:text-sm text-slate-600">
                      <span>Invoice Total</span>
                      <span>{currency} {totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm text-slate-600">
                      <span>Paid</span>
                      <span>{currency} {amountPaid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm text-slate-600">
                      <span>Amount Remaining</span>
                      <span>{currency} {balanceDue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                      <span>Balance Due</span>
                      <span>{currency} {balanceDue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                  </div>

                  {/* Upcoming Payments */}
                  <div className="space-y-4">
                    <h3 className="text-xs sm:text-sm text-slate-600">Upcoming Payments</h3>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button type="button" className="w-full sm:w-auto px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium rounded-md transition-colors shadow-sm">
                        Request Deposit
                      </button>
                      <button type="button" className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-md transition-colors border border-slate-200">
                        Add Upcoming Payment
                      </button>
                    </div>
                  </div>

                  {/* Payment History */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-xs sm:text-sm text-slate-600">Payment History</h3>
                    <button 
                      type="button" 
                      onClick={() => setShowRecordPayment(true)}
                      className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-md transition-colors border border-slate-200"
                    >
                      Record Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Record Payment Overlay */}
          {showRecordPayment && (
            <div className="absolute inset-0 z-[1400] bg-slate-900/20 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8 overflow-y-auto">
              <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 mt-10">
                {/* Header */}
                <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">RECORD PAYMENT</h2>
                  <button type="button" onClick={() => setShowRecordPayment(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>
                
                {/* Content */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-4">
                    <label className="text-xs sm:text-sm font-medium text-slate-600">Name</label>
                    <div className="sm:col-span-2 text-xs sm:text-sm text-slate-400">Payment</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-4">
                    <label className="text-xs sm:text-sm font-medium text-slate-600">Type</label>
                    <div className="sm:col-span-2 relative w-full">
                      <select 
                        value={paymentForm.type}
                        onChange={(e) => setPaymentForm({...paymentForm, type: e.target.value})}
                        className="w-full border border-slate-300 p-2 sm:p-2.5 rounded text-xs sm:text-sm text-slate-700 appearance-none focus:outline-none focus:border-slate-400"
                      >
                        <option>Flat Amount</option>
                        <option>Percentage</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-4">
                    <label className="text-xs sm:text-sm font-medium text-slate-600">Amount</label>
                    <div className="sm:col-span-2 w-full">
                      <input 
                        type="number"
                        value={paymentForm.amount}
                        onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                        placeholder="0.00"
                        className="w-full border border-slate-300 p-2 sm:p-2.5 rounded text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-4">
                    <label className="text-xs sm:text-sm font-medium text-slate-600">Method</label>
                    <div className="sm:col-span-2 relative w-full">
                      <select 
                        value={paymentForm.method}
                        onChange={(e) => setPaymentForm({...paymentForm, method: e.target.value})}
                        className="w-full border border-slate-300 p-2 sm:p-2.5 rounded text-xs sm:text-sm text-slate-700 appearance-none focus:outline-none focus:border-slate-400"
                      >
                        <option>Cash</option>
                        <option>Bank Transfer</option>
                        <option>Credit Card</option>
                        <option>Mobile Money</option>
                        <option>Cheque</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-4">
                    <label className="text-xs sm:text-sm font-medium text-slate-600">Date</label>
                    <div className="sm:col-span-2 w-full">
                      <input 
                        type="date"
                        value={paymentForm.date}
                        onChange={(e) => setPaymentForm({...paymentForm, date: e.target.value})}
                        className="w-full border border-slate-300 p-2 sm:p-2.5 rounded text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 items-start gap-1 sm:gap-4">
                    <label className="text-xs sm:text-sm font-medium text-slate-600 sm:pt-2">Notes</label>
                    <div className="sm:col-span-2 w-full">
                      <textarea 
                        value={paymentForm.notes}
                        onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                        placeholder="Add a note"
                        className="w-full border border-slate-300 p-2 sm:p-2.5 rounded text-xs sm:text-sm text-slate-700 h-20 sm:h-24 resize-y focus:outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-4 sm:px-6 py-4 flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => {
                      const newAmountPaid = amountPaid + Number(paymentForm.amount || 0);
                      setAmountPaid(newAmountPaid);
                      handleInputChange({ target: { name: 'amountPaid', value: newAmountPaid } } as any);
                      setShowRecordPayment(false);
                      setPaymentForm({ ...paymentForm, amount: '', notes: '' });
                    }}
                    className="w-full sm:w-auto px-6 py-2 sm:py-2.5 bg-[#424242] hover:bg-[#333333] text-white text-xs sm:text-sm font-medium rounded transition-colors shadow-sm"
                  >
                    Save Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Main Form Area */}
            <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto">
              {activeTab === 'documents' ? (
                <DocumentForm 
                   formData={formData} 
                   handleInputChange={handleInputChange}
                   items={items} setItems={setItems}
                   taxRate={taxRate} setTaxRate={setTaxRate}
                   taxType={taxType}
                   currency={currency}
                   signatureUrl={signatureUrl} setSignatureUrl={handleSignatureChange}
                   documentPhotoUrl={documentPhotoUrl} setDocumentPhotoUrl={handleDocumentPhotoChange}
                   amountPaid={amountPaid} setAmountPaid={setAmountPaid}
                   handleImageUpload={handleImageUpload}
                   uploading={uploading}
                   settings={settings}
                   mode={docMode}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
                  <StandardCMSForm 
                    activeTab={activeTab} 
                    formData={formData} 
                    handleInputChange={handleInputChange} 
                    handleImageUpload={handleImageUpload} 
                    uploading={uploading} 
                  />
                </div>
              )}
            </div>

            {/* Customization Sidebar - Only for Documents */}
            {activeTab === 'documents' && (
              <div className="w-full md:w-72 bg-slate-50 md:bg-white border-t md:border-t-0 md:border-l border-slate-200 p-4 sm:p-6 space-y-6 md:space-y-8 overflow-y-auto no-print shrink-0">
                {/* Color/Template Section */}
                <div className="space-y-4">
                  <div className="p-3 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500" />
                      <span className="text-[11px] font-bold text-slate-700">Custom Color</span>
                    </div>
                    <ChevronDown size={14} className="text-slate-400" />
                  </div>
                  <button type="button" className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold transition-all">
                    Customize
                  </button>
                </div>

                {/* Tax Section */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Tax</h4>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Type</label>
                    <div className="relative">
                      <select 
                        value={taxType}
                        onChange={(e) => setTaxType(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-[11px] font-bold text-slate-900 appearance-none outline-none focus:ring-2 focus:ring-indigo-500/10"
                      >
                        <option value="On total">On total</option>
                        <option value="Deducted">Deducted</option>
                        <option value="None">None</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  {taxType !== 'None' && (
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Rate (%)</label>
                      <input 
                        type="number" 
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-[11px] font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/10"
                      />
                    </div>
                  )}
                </div>

                {/* Discount Section */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Discount</h4>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Type</label>
                    <div className="relative">
                      <select className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-[11px] font-bold text-slate-900 appearance-none outline-none focus:ring-2 focus:ring-indigo-500/10">
                        <option>None</option>
                        <option>Percentage</option>
                        <option>Fixed Amount</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Currency Section */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Currency</h4>
                  <div className="relative">
                    <select 
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-[11px] font-bold text-slate-900 appearance-none outline-none focus:ring-2 focus:ring-indigo-500/10"
                    >
                      <option value="ZMW">ZMW - Zambian Kwacha</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="ZAR">ZAR - SA Rand</option>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="CNY">CNY - Chinese Yuan</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Options Section */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Options</h4>
                  <button type="button" className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[11px] font-bold transition-all shadow-md">
                    Get Link
                  </button>
                  <button 
                    type="button"
                    onClick={() => window.print()}
                    className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-[11px] font-bold transition-all"
                  >
                    Print {formData.docType || 'Invoice'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer - Ultra Compact */}
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0 sm:rounded-b-2xl no-print">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all">Cancel</button>
            <button 
              disabled={isSaving || uploading}
              type="submit" 
              className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50 hover:bg-indigo-600"
            >
              {isSaving ? <Loader2 size={12} className="animate-spin" /> : activeTab === 'documents' ? <Printer size={12} /> : <Save size={12} />}
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagementModal;
