
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Landmark, FileCheck, Receipt, X, Check, ChevronDown, ImageIcon } from 'lucide-react';
import { ImageUploadField } from './FormFields';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface DocumentFormProps {
  formData: any;
  handleInputChange: (e: any) => void;
  items: LineItem[];
  setItems: (items: LineItem[]) => void;
  taxRate: number;
  setTaxRate: (val: number) => void;
  taxType?: 'On total' | 'Deducted' | 'None';
  currency?: string;
  signatureUrl?: string;
  setSignatureUrl?: (url: string) => void;
  documentPhotoUrl?: string;
  setDocumentPhotoUrl?: (url: string) => void;
  amountPaid: number;
  setAmountPaid: (val: number) => void;
  handleImageUpload: (e: any) => void;
  uploading: boolean;
  settings?: Record<string, string>;
  mode?: 'edit' | 'preview';
}

const DocumentForm: React.FC<DocumentFormProps> = ({
  formData, handleInputChange, items, setItems, taxRate, setTaxRate, 
  taxType = 'On total', currency = 'ZMW',
  signatureUrl, setSignatureUrl,
  documentPhotoUrl, setDocumentPhotoUrl,
  amountPaid, setAmountPaid, 
  handleImageUpload, uploading, settings, mode = 'edit'
}) => {
  const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
  let taxAmount = (subtotal * taxRate) / 100;
  let total = subtotal;

  if (taxType === 'On total') {
    total = subtotal + taxAmount;
  } else if (taxType === 'Deducted') {
    total = subtotal - taxAmount;
  } else {
    taxAmount = 0;
    total = subtotal;
  }

  const balanceDue = total - amountPaid;

  const docType = (formData.docType || 'Invoice');
  const isTaxInvoice = taxType !== 'None' && taxRate > 0 && docType.toLowerCase() === 'invoice';
  const displayDocType = isTaxInvoice ? 'Tax Invoice' : docType;
  const showBankDetails = docType.toLowerCase() === 'invoice' && balanceDue > 0;
  
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSignaturePad && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#0f172a'; // slate-900
      }
    }
  }, [showSignaturePad]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    if (setSignatureUrl) setSignatureUrl(dataUrl);
    setShowSignaturePad(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (setDocumentPhotoUrl) setDocumentPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const siteName = settings?.site_name || "Nkaisosela Suppliers & General Dealers Ltd";
  const siteAddress = settings?.address || "Kapiri Mposhi, Zambia";
  const sitePhone = settings?.phone || "+260 970 426 228";
  const siteEmail = settings?.email || "info@nkaisosela.com";
  const siteIcon = settings?.site_icon || formData.imageUrl;

  const addLineItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = Number(updated.quantity) * Number(updated.rate);
        }
        return updated;
      }
      return item;
    }));
  };

  const removeLineItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '---';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (mode === 'preview') {
    return (
      <div id="print-area" className="bg-white p-8 sm:p-16 shadow-sm min-h-[1000px] animate-in fade-in duration-500 text-slate-800 font-['Inter']">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          {/* Logo & Company Info */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start w-full md:max-w-[60%]">
            <div className="shrink-0">
              {siteIcon ? (
                <img 
                  src={siteIcon} 
                  className="h-24 sm:h-32 w-auto object-contain mix-blend-multiply" 
                  alt="Logo" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 rounded flex items-center justify-center text-slate-400 font-semibold text-xs uppercase">No Logo</div>
              )}
            </div>
            <div className="space-y-1 pt-2">
              <h1 className="text-base sm:text-lg font-semibold uppercase tracking-tight leading-tight text-slate-900">{siteName}</h1>
              <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider space-y-0.5">
                <p>{siteAddress}</p>
                <p>Lusaka</p>
                <p>10101</p>
                <p>{sitePhone}</p>
                <p>{siteEmail}</p>
              </div>
            </div>
          </div>

          {/* Document Meta */}
          <div className="w-full md:w-auto text-left md:text-right space-y-4 pt-2 border-t md:border-t-0 border-slate-100 md:border-transparent mt-4 md:mt-0 md:pt-2">
            <div className="grid grid-cols-2 md:block gap-4">
              <div>
                <p className="text-[10px] font-medium uppercase text-slate-400 tracking-widest">{displayDocType.toUpperCase()}</p>
                <p className="text-sm font-semibold text-slate-900">{formData.docNumber || '---'}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase text-slate-400 tracking-widest">Date</p>
                <p className="text-sm font-semibold text-slate-900">{formatDate(formData.date)}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase text-slate-400 tracking-widest">Due Date</p>
                <p className="text-sm font-semibold text-slate-900">{formatDate(formData.dueDate)}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase text-slate-400 tracking-widest">Balance Due</p>
                <p className="text-sm font-semibold text-slate-900">{currency} {balanceDue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="mb-16">
          <p className="text-[10px] font-medium uppercase text-slate-400 tracking-widest mb-3">Bill To</p>
          <div className="text-sm font-medium text-slate-800 whitespace-pre-line leading-relaxed">
            {formData.clientName || 'No Client Details Provided'}
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-12">
          <div className="hidden md:grid grid-cols-12 gap-4 border-b border-slate-200 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            <div className="col-span-8">Description</div>
            <div className="col-span-2 text-right">Rate</div>
            <div className="col-span-1 text-center">Qty</div>
            <div className="col-span-1 text-right">Amount</div>
          </div>
          
          <div className="space-y-6 pt-4 border-t border-slate-200 md:border-t-0">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 items-start pb-4 border-b border-slate-100 last:border-0">
                <div className="w-full md:col-span-8">
                  <p className="text-sm font-medium text-slate-800">{item.description.split('\n')[0] || 'Item Name'}</p>
                  {item.description.includes('\n') && (
                    <p className="text-xs text-slate-500 font-normal mt-1">{item.description.split('\n').slice(1).join('\n')}</p>
                  )}
                </div>
                <div className="w-full flex justify-between md:contents">
                  <div className="md:col-span-2 md:text-right flex justify-between md:block w-full md:w-auto">
                    <span className="md:hidden text-[10px] font-medium text-slate-400 uppercase">Rate</span>
                    <p className="text-sm font-medium text-slate-800">{item.rate.toLocaleString()}</p>
                  </div>
                  <div className="md:col-span-1 md:text-center flex justify-between md:block w-full md:w-auto mt-1 md:mt-0">
                    <span className="md:hidden text-[10px] font-medium text-slate-400 uppercase">Qty</span>
                    <p className="text-sm font-medium text-slate-800">{item.quantity}</p>
                  </div>
                  <div className="md:col-span-1 md:text-right flex justify-between md:block w-full md:w-auto mt-1 md:mt-0">
                    <span className="md:hidden text-[10px] font-medium text-slate-400 uppercase">Amount</span>
                    <p className="text-sm font-medium text-slate-800">{item.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-20">
          <div className="w-full max-w-[300px] space-y-4">
            <div className="flex justify-between items-center text-sm font-medium text-slate-600">
              <span>Subtotal</span>
              <span className="text-slate-900">{subtotal.toLocaleString()}</span>
            </div>
            {taxType !== 'None' && (
              <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                <span>{taxType === 'Deducted' ? 'Tax (Deducted)' : 'Tax'} ({taxRate}%)</span>
                <span className="text-slate-900">{taxType === 'Deducted' ? '-' : ''}{taxAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm font-medium text-slate-600 pt-2 border-t border-slate-100">
              <span>Total</span>
              <span className="text-slate-900">{total.toLocaleString()}</span>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <div className="flex flex-col items-end gap-1">
                <p className="text-[10px] font-medium uppercase text-slate-500 tracking-widest">Balance Due</p>
                <p className="text-2xl font-semibold text-slate-900">{currency} {balanceDue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Signature & Footer */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-start md:items-end">
          <div className="space-y-8 w-full">
            <div className="pt-12">
              {docType.toLowerCase() === 'invoice' && (
                <p className="text-[10px] font-medium text-slate-500 italic mb-4">Certified that the particulars given above are true and correct.</p>
              )}
              <div className="w-full max-w-[12rem] h-20 border-b border-slate-300 mb-3 flex items-end justify-center relative">
                {signatureUrl ? (
                  <img src={signatureUrl} alt="Signature" className="max-h-full max-w-full object-contain" />
                ) : (
                  <div className="font-serif italic text-xl text-slate-300 opacity-40 select-none">Authorized Signature</div>
                )}
              </div>
              <p className="text-[10px] font-medium uppercase text-slate-400 tracking-widest mb-1">Date Signed</p>
              <p className="text-sm font-medium text-slate-800">{formatDate(formData.date)}</p>
            </div>
            
            <div>
              <div className="text-xs font-normal text-slate-500 italic max-w-xs mb-6">
                {formData.terms || 'No additional notes provided.'}
              </div>
              
              {showBankDetails && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-medium uppercase text-slate-400 tracking-widest mb-2">Payment Details</p>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p><span className="font-semibold text-slate-800">Bank:</span> {settings?.bankName || 'Zambia National Commercial Bank (ZANACO)'}</p>
                    <p><span className="font-semibold text-slate-800">Account Name:</span> {settings?.accountName || siteName}</p>
                    <p><span className="font-semibold text-slate-800">Account No:</span> {settings?.accountNumber || '1234567890'}</p>
                    <p><span className="font-semibold text-slate-800">Branch:</span> {settings?.branchCode || 'Kapiri Mposhi'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {documentPhotoUrl && (
            <div className="flex justify-start md:justify-end w-full">
              <img src={documentPhotoUrl} alt="Attachment" className="max-w-full md:max-w-[200px] max-h-[200px] object-contain rounded-lg shadow-sm border border-slate-200" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Edit Mode - Professional Layout matching reference
  return (
    <div className="bg-white p-8 sm:p-12 min-h-screen animate-in fade-in duration-500 font-['Inter'] text-slate-700">
      {/* Top Header: Doc Type & Logo */}
      <div className="flex justify-between items-start mb-12">
        <div className="w-full max-w-md">
          <input 
            type="text"
            name="docType"
            value={formData.docType || 'Invoice'}
            onChange={handleInputChange}
            className="w-full text-3xl font-bold text-slate-900 border border-slate-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="shrink-0">
          <ImageUploadField label="Logo" value={siteIcon} onUpload={handleImageUpload} loading={uploading} compact />
        </div>
      </div>

      {/* From & Bill To Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-12">
        {/* From Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">From</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-4">
              <label className="text-xs font-medium text-slate-500">Name</label>
              <input value={siteName} readOnly className="sm:col-span-2 w-full bg-slate-50 border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-600" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-4">
              <label className="text-xs font-medium text-slate-500">Email</label>
              <div className="sm:col-span-2 relative w-full">
                <input value={siteEmail} readOnly className="w-full bg-slate-50 border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-600 pr-8" />
                <Check size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 items-start gap-1 sm:gap-4">
              <label className="text-xs font-medium text-slate-500 pt-2">Address</label>
              <div className="sm:col-span-2 space-y-2 w-full">
                <input value={siteAddress} readOnly className="w-full bg-slate-50 border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-600" />
                <input value="Lusaka" readOnly className="w-full bg-slate-50 border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-600" />
                <input value="10101" readOnly className="w-full bg-slate-50 border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-600" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-4">
              <label className="text-xs font-medium text-slate-500">Phone</label>
              <input value={sitePhone} readOnly className="sm:col-span-2 w-full bg-slate-50 border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-600" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-4">
              <label className="text-xs font-medium text-slate-500">Business Number</label>
              <input value={siteName} readOnly className="sm:col-span-2 w-full bg-slate-50 border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-600" />
            </div>
            <button type="button" className="text-[10px] font-bold text-indigo-600 hover:underline">Show additional business details</button>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Bill To</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-4">
              <label className="text-xs font-medium text-slate-500">Name</label>
              <div className="sm:col-span-2 relative w-full">
                <input 
                  name="clientName"
                  value={formData.clientName || ''}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-900 pr-8 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none" 
                />
                <X size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-4">
              <label className="text-xs font-medium text-slate-500">Email</label>
              <div className="sm:col-span-2 relative w-full">
                <input 
                  name="clientEmail"
                  value={formData.clientEmail || ''}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-900 pr-8 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none" 
                />
                <Check size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 items-start gap-1 sm:gap-4">
              <label className="text-xs font-medium text-slate-500 pt-2">Address</label>
              <div className="sm:col-span-2 space-y-2 w-full">
                <input name="clientAddress" value={formData.clientAddress || ''} onChange={handleInputChange} className="w-full border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none" />
                <input name="clientCity" value={formData.clientCity || ''} onChange={handleInputChange} className="w-full border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none" />
                <input name="clientZip" value={formData.clientZip || ''} onChange={handleInputChange} className="w-full border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-4">
              <label className="text-xs font-medium text-slate-500">Phone</label>
              <input name="clientPhone" value={formData.clientPhone || ''} onChange={handleInputChange} className="sm:col-span-2 w-full border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-4">
              <label className="text-xs font-medium text-slate-500">Mobile</label>
              <input name="clientMobile" value={formData.clientMobile || ''} onChange={handleInputChange} placeholder="(123) 456 789" className="sm:col-span-2 w-full border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-4">
              <label className="text-xs font-medium text-slate-500">Fax</label>
              <input name="clientFax" value={formData.clientFax || ''} onChange={handleInputChange} placeholder="(123) 456 789" className="sm:col-span-2 w-full border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Document Meta Section */}
      <div className="border-t border-slate-100 pt-8 mb-12">
        <div className="w-full md:max-w-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
            <label className="text-xs font-medium text-slate-500">Number</label>
            <div className="sm:col-span-2 relative w-full">
              <input name="docNumber" value={formData.docNumber || ''} onChange={handleInputChange} className="w-full border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-900 pr-8 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none" />
              <Check size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
            <label className="text-xs font-medium text-slate-500">Date</label>
            <input type="date" name="date" value={formData.date || ''} onChange={handleInputChange} className="sm:col-span-2 w-full border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
            <label className="text-xs font-medium text-slate-500">Terms</label>
            <div className="sm:col-span-2 relative w-full">
              <select name="terms" value={formData.terms || '3 Days'} onChange={handleInputChange} className="w-full border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-900 appearance-none focus:ring-2 focus:ring-indigo-500/10 focus:outline-none">
                <option>3 Days</option>
                <option>7 Days</option>
                <option>15 Days</option>
                <option>30 Days</option>
                <option>Due on Receipt</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
            <label className="text-xs font-medium text-slate-500">Due</label>
            <input type="date" name="dueDate" value={formData.dueDate || ''} onChange={handleInputChange} className="sm:col-span-2 w-full border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Items Table Section */}
      <div className="mb-8">
        <div className="hidden md:grid grid-cols-12 gap-4 border-t border-b border-slate-200 py-2 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <div className="col-span-1"></div>
          <div className="col-span-7">Description</div>
          <div className="col-span-2 text-right">Rate</div>
          <div className="col-span-1 text-center">Qty</div>
          <div className="col-span-1 text-right">Amount</div>
        </div>

        <div className="space-y-8 md:space-y-4">
          {items.map((item) => (
            <div key={item.id} className="space-y-4 border border-slate-200 md:border-none p-4 md:p-0 rounded-lg md:rounded-none bg-slate-50/50 md:bg-transparent">
              <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center">
                <div className="w-full md:col-span-1 flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-xs font-bold text-slate-500 uppercase">Item</span>
                  <button type="button" onClick={() => removeLineItem(item.id)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-all">
                    <X size={16} />
                  </button>
                </div>
                <div className="w-full md:col-span-7">
                  <input 
                    value={item.description.split('\n')[0] || ''} 
                    onChange={(e) => {
                      const lines = item.description.split('\n');
                      lines[0] = e.target.value;
                      updateLineItem(item.id, 'description', lines.join('\n'));
                    }}
                    placeholder="Item name"
                    className="w-full border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                  />
                </div>
                <div className="w-full md:col-span-2">
                  <div className="flex items-center gap-2 md:block">
                    <span className="md:hidden text-xs font-medium text-slate-500 w-16">Rate</span>
                    <input 
                      type="number"
                      value={item.rate ?? 0}
                      onChange={(e) => updateLineItem(item.id, 'rate', e.target.value)}
                      className="w-full border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-900 md:text-right focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="w-full md:col-span-1">
                  <div className="flex items-center gap-2 md:block">
                    <span className="md:hidden text-xs font-medium text-slate-500 w-16">Qty</span>
                    <input 
                      type="number"
                      value={item.quantity ?? 1}
                      onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)}
                      className="w-full border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-900 md:text-center focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="w-full md:col-span-1">
                  <div className="flex items-center justify-between md:block md:text-right">
                    <span className="md:hidden text-xs font-bold text-slate-500 uppercase">Amount</span>
                    <span className="text-xs font-bold text-slate-900">{currency} {(item.amount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:grid md:grid-cols-12 gap-4">
                <div className="hidden md:block col-span-1"></div>
                <div className="w-full md:col-span-7 relative">
                  <textarea 
                    value={item.description.split('\n').slice(1).join('\n') || ''}
                    onChange={(e) => {
                      const lines = item.description.split('\n');
                      const title = lines[0] || '';
                      updateLineItem(item.id, 'description', `${title}\n${e.target.value}`);
                    }}
                    placeholder="Item description"
                    className="w-full border border-slate-200 p-2 rounded-md text-xs font-medium text-slate-600 h-24 resize-none focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                  />
                  <span className="absolute bottom-2 right-2 text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                    {(item.description.split('\n').slice(1).join('\n').length)}/5000
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="button" onClick={addLineItem} className="mt-6 p-2 bg-slate-800 hover:bg-slate-900 text-white rounded-md transition-all">
          <Plus size={16} />
        </button>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end mb-12 border-t border-slate-100 pt-8">
        <div className="w-full md:max-w-[300px] space-y-4">
          <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
            <span className="text-slate-400">Subtotal</span>
            <span>{currency} {subtotal.toLocaleString()}</span>
          </div>
          {taxType !== 'None' && (
            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
              <span className="text-slate-400">{taxType === 'Deducted' ? 'Tax (Deducted)' : 'Tax'} ({taxRate}%)</span>
              <span>{taxType === 'Deducted' ? '-' : ''}{currency} {taxAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest pt-2 border-t border-slate-100">
            <span className="text-slate-400">Total</span>
            <span>{currency} {total.toLocaleString()}</span>
          </div>
          <div className="pt-4 border-t border-slate-200">
            <div className="flex flex-col items-end gap-1">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Balance Due</p>
              <p className="text-2xl font-black uppercase">{currency} {balanceDue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="space-y-4 mb-12">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Notes</h3>
        <div className="relative">
          <textarea 
            name="terms"
            value={formData.terms || ''}
            onChange={handleInputChange}
            className="w-full border border-slate-200 p-4 rounded-md text-xs font-medium text-slate-600 h-48 resize-none focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
            placeholder="Notes..."
          />
          <span className="absolute bottom-2 right-2 text-[8px] text-slate-400 font-bold uppercase tracking-widest">
            {(formData.terms || '').length}/5000
          </span>
        </div>
      </div>

      {/* Signature Section */}
      <div className="space-y-4 mb-12">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Signature</h3>
        {signatureUrl ? (
          <div className="w-full max-w-[16rem] h-32 border border-slate-200 rounded-lg flex items-center justify-center bg-slate-50 p-2 relative group">
            <img src={signatureUrl} alt="Signature" className="max-h-full max-w-full object-contain" />
            <button 
              type="button" 
              onClick={() => setSignatureUrl && setSignatureUrl('')}
              className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : showSignaturePad ? (
          <div className="w-full max-w-md border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-600">Draw Signature</span>
              <button type="button" onClick={() => setShowSignaturePad(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <div className="w-full overflow-hidden touch-none">
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="w-full h-[200px] bg-white cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-between items-center">
              <button type="button" onClick={clearSignature} className="text-xs font-bold text-slate-500 hover:text-slate-700">
                Clear
              </button>
              <button type="button" onClick={saveSignature} className="px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-bold shadow-sm">
                Save Signature
              </button>
            </div>
          </div>
        ) : (
          <button 
            type="button" 
            onClick={() => setShowSignaturePad(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-all text-xs font-bold flex items-center gap-2 w-fit"
          >
            <Plus size={14} /> Add Signature
          </button>
        )}
      </div>

      {/* Photos Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Photos</h3>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handlePhotoUpload} 
          accept="image/*" 
          className="hidden" 
        />
        {documentPhotoUrl ? (
          <div className="relative w-48 h-48 group">
            <img src={documentPhotoUrl} alt="Document Photo" className="w-full h-full object-cover rounded-lg border border-slate-200" />
            <button 
              type="button" 
              onClick={() => setDocumentPhotoUrl && setDocumentPhotoUrl('')}
              className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-24 border border-slate-200 rounded-md flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-all"
          >
            <ImageIcon size={20} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Add Photo</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentForm;
