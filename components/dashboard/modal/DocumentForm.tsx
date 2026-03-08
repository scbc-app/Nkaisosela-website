
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Landmark, FileCheck, Receipt, X, Check, ChevronDown, ImageIcon, Upload, ArrowUp } from 'lucide-react';
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
  const discount = Number(formData.discount || 0);
  const shipping = Number(formData.shipping || 0);
  
  let taxAmount = ((subtotal - discount) * taxRate) / 100;
  let total = subtotal - discount + taxAmount + shipping;

  if (taxType === 'On total') {
    total = subtotal - discount + taxAmount + shipping;
  } else if (taxType === 'Deducted') {
    total = subtotal - discount - taxAmount + shipping;
  } else {
    taxAmount = 0;
    total = subtotal - discount + shipping;
  }

  const balanceDue = total - amountPaid;

  const docType = (formData.docType || 'Invoice');
  const isTaxInvoice = taxType !== 'None' && taxRate > 0 && docType.toLowerCase() === 'invoice';
  const displayDocType = isTaxInvoice ? 'Tax Invoice' : docType;
  
  const [useSystemBankDetails, setUseSystemBankDetails] = useState(false);

  const hasBankDetails = Boolean(
    formData.bankDetails || 
    (useSystemBankDetails && (settings?.bankName || settings?.accountName || settings?.accountNumber))
  );
  const isQuote = docType.toLowerCase().includes('quot') || docType.toLowerCase().includes('proforma');
  const isReceipt = docType.toLowerCase().includes('receipt');
  const isFullyPaid = docType.toLowerCase() === 'invoice' && balanceDue <= 0;
  
  const showBankDetails = hasBankDetails && !isReceipt && (isQuote || balanceDue > 0);
  const showDueDate = !isReceipt && !isFullyPaid;
  
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
      <div id="document-preview-container" className="bg-white mx-auto w-[800px] min-h-[1131px] text-slate-800 font-['Inter',_sans-serif] flex flex-col relative shadow-sm border border-slate-200 box-border">
        {/* Top Accent Line */}
        <div className="h-4 w-full bg-slate-900"></div>
        
        <div className="px-12 py-12 flex-1 flex flex-col">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-12">
            <div className="flex flex-col max-w-[50%]">
              {siteIcon ? (
                <img 
                  src={siteIcon} 
                  className="h-16 w-auto object-contain mb-6" 
                  alt="Logo" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-16 w-16 bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs mb-6 tracking-widest">LOGO</div>
              )}
              <div className="text-[13px] text-slate-600 whitespace-pre-line leading-relaxed">
                {formData.companyDetails ? formData.companyDetails : (
                  <>
                    <span className="font-bold text-slate-900 text-base block mb-1">{siteName}</span>
                    {siteAddress}
                    <br />{sitePhone}
                    <br />{siteEmail}
                  </>
                )}
              </div>
            </div>
            
            <div className="text-right flex flex-col items-end">
              <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-widest mb-2">
                {displayDocType}
              </h1>
              <div className="text-sm text-slate-500 mb-8 font-medium tracking-widest uppercase">
                {formData.docNumber || '---'}
              </div>
              
              <table className="text-[13px] text-right border-collapse">
                <tbody>
                  <tr>
                    <td className="py-1 pr-4 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Date</td>
                    <td className="py-1 text-slate-900 font-medium">{formatDate(formData.date)}</td>
                  </tr>
                  {formData.dueDate && showDueDate && (
                    <tr>
                      <td className="py-1 pr-4 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Due Date</td>
                      <td className="py-1 text-slate-900 font-medium">{formatDate(formData.dueDate)}</td>
                    </tr>
                  )}
                  {formData.poNumber && (
                    <tr>
                      <td className="py-1 pr-4 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">PO Number</td>
                      <td className="py-1 text-slate-900 font-medium">{formData.poNumber}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="mb-12">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">Bill To</h3>
            <div className="text-[13px] text-slate-900 whitespace-pre-line leading-relaxed font-medium">
              {formData.clientName || '---'}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-10">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200">
                  <th className="py-3 px-4 text-left font-bold text-slate-700 uppercase tracking-wider text-[10px] w-1/2">Description</th>
                  <th className="py-3 px-4 text-right font-bold text-slate-700 uppercase tracking-wider text-[10px]">Rate</th>
                  <th className="py-3 px-4 text-right font-bold text-slate-700 uppercase tracking-wider text-[10px]">Qty</th>
                  <th className="py-3 px-4 text-right font-bold text-slate-700 uppercase tracking-wider text-[10px]">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="py-4 px-4 text-left align-top">
                      <p className="font-semibold text-slate-900">{item.description.split('\n')[0] || 'Item Name'}</p>
                      {item.description.includes('\n') && (
                        <p className="text-[11px] text-slate-500 mt-1 whitespace-pre-line leading-relaxed">{item.description.split('\n').slice(1).join('\n')}</p>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right text-slate-700 align-top">{item.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="py-4 px-4 text-right text-slate-700 align-top">{item.quantity}</td>
                    <td className="py-4 px-4 text-right text-slate-900 font-semibold align-top">{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mb-16">
            <div className="w-full sm:w-1/2 min-w-[300px]">
              <table className="w-full text-[13px] border-collapse">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-left font-medium text-slate-500">Subtotal</td>
                    <td className="py-3 px-4 text-right text-slate-900 font-medium">{currency} {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  {discount > 0 && (
                    <tr className="border-b border-slate-100">
                      <td className="py-3 px-4 text-left font-medium text-slate-500">Discount</td>
                      <td className="py-3 px-4 text-right text-slate-900 font-medium">-{currency} {discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  )}
                  {taxRate > 0 && (
                    <tr className="border-b border-slate-100">
                      <td className="py-3 px-4 text-left font-medium text-slate-500">Tax ({taxRate}%)</td>
                      <td className="py-3 px-4 text-right text-slate-900 font-medium">{currency} {taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  )}
                  {shipping > 0 && (
                    <tr className="border-b border-slate-100">
                      <td className="py-3 px-4 text-left font-medium text-slate-500">Shipping</td>
                      <td className="py-3 px-4 text-right text-slate-900 font-medium">{currency} {shipping.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  )}
                  <tr className="bg-slate-50">
                    <td className="py-4 px-4 text-left font-bold text-slate-900 text-base border-t border-slate-200">Total</td>
                    <td className="py-4 px-4 text-right font-bold text-slate-900 text-base border-t border-slate-200">{currency} {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  {amountPaid > 0 && (
                    <>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 px-4 text-left font-medium text-slate-500">Amount Paid</td>
                        <td className="py-3 px-4 text-right text-slate-900 font-medium">-{currency} {amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="py-4 px-4 text-left font-bold text-slate-900 text-base border-t border-slate-200">Balance Due</td>
                        <td className="py-4 px-4 text-right font-bold text-slate-900 text-base border-t border-slate-200">{currency} {balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Section (Terms, Bank, Signature) */}
          <div className="mt-auto pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-8">
            <div className="flex-1 space-y-6 w-full">
              {formData.terms && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Terms & Conditions</h4>
                  <div className="text-[11px] text-slate-600 whitespace-pre-line leading-relaxed">
                    {formData.terms}
                  </div>
                </div>
              )}
              
              {showBankDetails && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Payment Details</h4>
                  <div className="text-[11px] text-slate-600 space-y-1">
                    {formData.bankDetails && (
                      <div className="whitespace-pre-line mb-3">{formData.bankDetails}</div>
                    )}
                    {useSystemBankDetails && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 max-w-lg">
                        {settings?.bankName && <div className="flex justify-between sm:justify-start sm:gap-2"><span className="font-semibold text-slate-700">Bank:</span> <span>{settings.bankName}</span></div>}
                        {settings?.accountName && <div className="flex justify-between sm:justify-start sm:gap-2"><span className="font-semibold text-slate-700">Account Name:</span> <span>{settings.accountName}</span></div>}
                        {settings?.accountNumber && <div className="flex justify-between sm:justify-start sm:gap-2"><span className="font-semibold text-slate-700">Account No:</span> <span>{settings.accountNumber}</span></div>}
                        {settings?.branchCode && <div className="flex justify-between sm:justify-start sm:gap-2"><span className="font-semibold text-slate-700">Branch:</span> <span>{settings.branchCode}</span></div>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end justify-end space-y-6 shrink-0 w-full sm:w-auto mt-8 sm:mt-0">
              {signatureUrl && (
                <div className="flex flex-col items-center">
                  <img src={signatureUrl} alt="Signature" className="h-16 object-contain mb-2" />
                  <div className="w-48 border-t border-slate-300 text-center pt-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Authorized Signature</p>
                  </div>
                </div>
              )}
              {documentPhotoUrl && (
                <img src={documentPhotoUrl} alt="Attachment" className="w-24 h-24 object-contain rounded border border-slate-200" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Edit Mode - Professional Layout matching reference
  return (
    <div className="bg-white p-8 sm:p-12 min-h-screen animate-in fade-in duration-500 font-['Inter'] text-slate-700 max-w-5xl mx-auto">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{docType} number</label>
              <input 
                type="text"
                name="docNumber"
                value={formData.docNumber || ''}
                onChange={handleInputChange}
                className="w-full border border-slate-300 p-2.5 rounded-md text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Purchase order</label>
              <input 
                type="text"
                name="poNumber"
                value={formData.poNumber || ''}
                onChange={handleInputChange}
                className="w-full border border-slate-300 p-2.5 rounded-md text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Your company details</label>
            <textarea 
              name="companyDetails"
              value={formData.companyDetails !== undefined ? formData.companyDetails : `${siteName}\n${siteAddress}\n${sitePhone}\n${siteEmail}`}
              onChange={handleInputChange}
              className="w-full border border-slate-300 p-2.5 rounded-md text-sm h-32 resize-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
            <div className="relative">
              <select 
                name="currency"
                value={formData.currency || currency}
                onChange={handleInputChange}
                className="w-full border border-slate-300 p-2.5 rounded-md text-sm appearance-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all bg-white"
              >
                <option value="USD">🇺🇸 US dollar</option>
                <option value="ZMW">🇿🇲 Zambian Kwacha</option>
                <option value="EUR">🇪🇺 Euro</option>
                <option value="GBP">🇬🇧 British Pound</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Logo</label>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full border border-slate-300 rounded-md p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-all h-[72px]"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {siteIcon ? (
                  <img src={siteIcon} alt="Logo" className="max-w-full max-h-full object-contain grayscale" />
                ) : (
                  <Upload size={20} className="text-slate-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 hover:underline decoration-slate-400 underline-offset-2">Upload file</p>
                <p className="text-xs text-slate-500">JPG, JPEG, PNG, less than 5MB</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bill to</label>
            <textarea 
              name="clientName"
              value={formData.clientName || ''}
              onChange={handleInputChange}
              className="w-full border border-slate-300 p-2.5 rounded-md text-sm h-32 resize-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{docType} date</label>
              <div className="relative">
                <input 
                  type="date"
                  name="date"
                  value={formData.date || ''}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 p-2.5 rounded-md text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                />
              </div>
            </div>
            {showDueDate && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due date</label>
                <div className="relative">
                  <input 
                    type="date"
                    name="dueDate"
                    value={formData.dueDate || ''}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 p-2.5 rounded-md text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-[#f2f4f2] rounded-lg p-6 mb-8">
        <div className="hidden md:grid grid-cols-12 gap-4 mb-2 text-sm font-medium text-slate-700">
          <div className="col-span-6">Item description</div>
          <div className="col-span-2">Unit cost</div>
          <div className="col-span-2">Quantity</div>
          <div className="col-span-2">Amount</div>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-6">
                <span className="md:hidden text-xs font-medium text-slate-500 mb-1 block">Item description</span>
                <input 
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                  className="w-full border border-slate-300 p-2.5 rounded-md text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none bg-white"
                />
              </div>
              <div className="md:col-span-2">
                <span className="md:hidden text-xs font-medium text-slate-500 mb-1 block">Unit cost</span>
                <input 
                  type="number"
                  value={item.rate || ''}
                  onChange={(e) => updateLineItem(item.id, 'rate', e.target.value)}
                  className="w-full border border-slate-300 p-2.5 rounded-md text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none bg-white"
                />
              </div>
              <div className="md:col-span-2">
                <span className="md:hidden text-xs font-medium text-slate-500 mb-1 block">Quantity</span>
                <input 
                  type="number"
                  value={item.quantity || ''}
                  onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)}
                  className="w-full border border-slate-300 p-2.5 rounded-md text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none bg-white"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-3">
                <div className="flex-1 border border-slate-300 p-2.5 rounded-md text-sm bg-white text-slate-700">
                  {item.amount.toLocaleString()}
                </div>
                <button type="button" className="text-slate-400 hover:text-slate-600 hidden md:block">
                  <ArrowUp size={18} />
                </button>
                <button type="button" onClick={() => removeLineItem(item.id)} className="w-8 h-8 rounded-full bg-[#e6ece6] flex items-center justify-center text-slate-600 hover:bg-[#d5e0d5] transition-colors shrink-0">
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center justify-center">
          <button type="button" onClick={addLineItem} className="w-10 h-10 rounded-full bg-[#95e875] flex items-center justify-center text-slate-800 hover:bg-[#85d865] transition-colors mb-2">
            <Plus size={20} />
          </button>
          <span className="text-sm font-medium text-slate-700">Add item</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes / payment terms</label>
            <textarea 
              name="terms"
              value={formData.terms || ''}
              onChange={handleInputChange}
              placeholder="Payment is due within 15 days"
              className="w-full border border-slate-300 p-2.5 rounded-md text-sm h-32 resize-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bank account details</label>
            <textarea 
              name="bankDetails"
              value={formData.bankDetails || ''}
              onChange={handleInputChange}
              placeholder="Enter manual bank details here (optional)..."
              className="w-full border border-slate-300 p-2.5 rounded-md text-sm h-32 resize-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
            />
            <div className="mt-3 flex items-center gap-2">
              <input 
                type="checkbox" 
                id="useSystemBankDetails"
                checked={useSystemBankDetails}
                onChange={(e) => setUseSystemBankDetails(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded border-slate-300 focus:ring-green-500 cursor-pointer"
              />
              <label htmlFor="useSystemBankDetails" className="text-sm text-slate-600 cursor-pointer select-none">
                Include system bank details (saved in Settings)
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6">
          <div className="flex justify-between items-center text-sm text-slate-600">
            <span>Subtotal</span>
            <span>{currency} {subtotal.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-slate-600 w-32">Tax %</span>
            <div className="relative flex-1">
              <input 
                type="number"
                value={taxRate || ''}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full border border-slate-300 p-2.5 rounded-md text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">%</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-slate-600 w-32">Discount ({currency})</span>
            <input 
              type="number"
              name="discount"
              value={formData.discount || ''}
              onChange={handleInputChange}
              className="flex-1 border border-slate-300 p-2.5 rounded-md text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-slate-600 w-32">Shipping fee</span>
            <input 
              type="number"
              name="shipping"
              value={formData.shipping || ''}
              onChange={handleInputChange}
              className="flex-1 border border-slate-300 p-2.5 rounded-md text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
            />
          </div>

          <div className="flex justify-between items-center pt-4">
            <span className="text-base font-bold text-slate-900">Total</span>
            <span className="text-xl font-bold text-slate-900">{currency} {total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <button type="submit" className="w-full bg-[#95e875] hover:bg-[#85d865] text-slate-900 font-semibold py-3 rounded-full transition-colors">
        Create the {docType.toLowerCase()}
      </button>

    </div>
  );
};

export default DocumentForm;
