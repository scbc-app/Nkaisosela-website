
import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  X,
  MessageSquare,
  ShoppingCart,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SheetRow, SheetMetadata } from '../types';

interface DataTableProps {
  data: SheetRow[];
  metadata: SheetMetadata | null;
  isAuthenticated?: boolean;
  onSignInClick?: () => void;
}

const PRODUCT_IMAGES: Record<string, string> = {
  'ppe': 'https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=60&w=400',
  'stationary': 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=60&w=400',
  'construction': 'https://images.unsplash.com/photo-1590059393150-f86029986b88?auto=format&fit=crop&q=60&w=400',
  'electrical': 'https://images.unsplash.com/photo-1558444479-c8f01052877a?auto=format&fit=crop&q=60&w=400',
  'it equipment': 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=60&w=400',
  'machinery': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=60&w=400',
  'default': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=60&w=400'
};

const getProductImage = (category: any) => {
  const cat = String(category || '').toLowerCase();
  return PRODUCT_IMAGES[cat] || PRODUCT_IMAGES['default'];
};

const DataTable: React.FC<DataTableProps> = ({ data, metadata, isAuthenticated, onSignInClick }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<SheetRow | null>(null);
  const itemsPerPage = 8;

  const filteredData = data.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    const columns = metadata?.columns || ['Item', 'Category', 'Stock', 'Price', 'Status'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + columns.join(",") + "\n"
      + data.map(row => columns.map(col => `"${row[col]}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "nkaisosela_price_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-in fade-in duration-500 px-4">
        <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2 shadow-inner">
          <Lock size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">Partner Access Required</h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto text-sm leading-relaxed">
            Our comprehensive price list and product catalog are exclusively available to registered partners and clients.
          </p>
        </div>
        <div className="flex items-center gap-4 pt-4">
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
          >
            Go Back
          </button>
          <button 
            onClick={onSignInClick}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-200 transition-all"
          >
            Sign In to Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-10 w-full overflow-hidden pb-12 px-1">
      {/* Order Selection Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="p-8 sm:p-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Order Options</h3>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Product: {String(selectedProduct.Item)}</p>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Link 
                  to={`/contact?subject=Inquiry: ${selectedProduct.Item}`}
                  className="group p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all flex items-center gap-5"
                >
                  <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm transition-colors">
                    <MessageSquare size={24} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Quick Inquiry</h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Ask a question about this item</p>
                  </div>
                </Link>

                <Link 
                  to={`/contact?subject=Order Request: ${selectedProduct.Item}&type=formal`}
                  className="group p-6 bg-indigo-600 rounded-3xl border border-indigo-500 hover:bg-indigo-700 transition-all flex items-center gap-5 shadow-xl shadow-indigo-100"
                >
                  <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center text-white shadow-sm">
                    <ShoppingCart size={24} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Professional Order</h4>
                    <p className="text-[10px] font-bold text-indigo-200 mt-1 uppercase tracking-widest">Request a formal quotation</p>
                  </div>
                </Link>
              </div>

              <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Our team will respond within 24 business hours.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="shrink-0 h-12 w-12 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tightest leading-none uppercase">Price List</h2>
            <p className="text-slate-500 font-medium text-sm mt-2">
              Browse our list of <span className="text-indigo-600 font-black">{data.length}</span> products.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {isAuthenticated && (
            <Link 
              to="/admin?module=products"
              className="w-full sm:w-auto px-6 py-4 bg-indigo-600 text-white rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add New Item
            </Link>
          )}
          <button 
            onClick={handleExport}
            className="w-full sm:w-auto px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[9px] sm:text-[10px] font-black text-slate-700 hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm flex items-center justify-center gap-2"
          >
            <Download size={16} /> Save Price List
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden w-full">
        {/* Simple Search */}
        <div className="p-4 sm:p-6 border-b border-slate-50 bg-slate-50/20">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Type to search for an item..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {paginatedData.map((row) => (
            <div key={row.id} className="p-5 sm:p-6 space-y-4 hover:bg-slate-50/50 transition-colors flex flex-col justify-between h-full group">
              <div className="space-y-4">
                <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 shadow-sm relative">
                  <img 
                    src={row.imageUrl || row.ImageUrl || row.Image || row.image || getProductImage(row.Category)} 
                    alt="Product" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2">
                    <CellContent column="Status" value={row.Status} />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight line-clamp-2">{String(row.Item || 'Item')}</h4>
                  <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mt-1">{String(row.Category || 'General')}</p>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Price</p>
                    <CellContent column="Price" value={row.Price} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Stock</p>
                    <p className="text-[11px] font-bold text-slate-900">{String(row.Stock || 0)} {String(row.Unit || '')}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedProduct(row)}
                  className="block w-full py-3.5 bg-indigo-50 text-indigo-600 text-center rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {paginatedData.length === 0 && (
          <div className="py-24 text-center space-y-4 opacity-40 px-6">
            <Search className="mx-auto" size={48} />
            <p className="text-sm font-black uppercase tracking-widest">No items match your search.</p>
          </div>
        )}

        {/* Vertical Pagination for Mobile */}
        <div className="p-5 sm:p-6 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
            Page {currentPage} of {totalPages || 1}
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="flex-1 sm:flex-none p-3 bg-white border border-slate-100 rounded-xl disabled:opacity-30 shadow-sm flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest px-4"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="flex-1 sm:flex-none p-3 bg-white border border-slate-100 rounded-xl disabled:opacity-30 shadow-sm flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest px-4"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CellContent: React.FC<{ column: string; value: any }> = ({ column, value }) => {
  const strVal = String(value);
  
  if (column.toLowerCase() === 'status') {
    const isAvailable = strVal.toLowerCase() === 'available' || strVal.toLowerCase() === 'active';
    const isLow = strVal.toLowerCase() === 'low stock' || strVal.toLowerCase() === 'review';
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/95 backdrop-blur-sm rounded-full border border-slate-100 shadow-sm">
        <div className={`h-1 w-1 rounded-full ${isAvailable ? 'bg-emerald-500' : isLow ? 'bg-amber-500' : 'bg-red-500'}`}></div>
        <span className={`text-[7px] font-black uppercase tracking-widest ${isAvailable ? 'text-emerald-600' : isLow ? 'text-amber-600' : 'text-red-600'}`}>
          {strVal}
        </span>
      </div>
    );
  }

  if (column.toLowerCase().includes('price')) {
    return <span className="text-xs font-black text-slate-900">K{Number(value).toLocaleString()}</span>;
  }

  return <span className="text-xs font-bold text-slate-700">{strVal}</span>;
};

export default DataTable;
