
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Menu, X, Search, ChevronDown, LayoutDashboard, FileEdit, Settings } from 'lucide-react';
import { AppState, SpreadsheetUrls } from './types';
import { spreadsheetService } from './services/spreadsheetService';
import { AuthService } from './services/authService';
import Home from './components/Home';
import AboutView from './components/AboutView';
import ServicesView from './components/ServicesView';
import BlogView from './components/BlogView';
import ContactView from './components/ContactView';
import CareersView from './components/CareersView';
import Dashboard from './components/Dashboard';
import DataTable from './components/DataTable';
import AIChat from './components/AIChat';
import SettingsView from './components/SettingsView';
import SignInModal from './components/SignInModal';

const APPSCRIPT_URL = import.meta.env.VITE_APPSCRIPT_URL;

if (!APPSCRIPT_URL) {
  console.error("VITE_APPSCRIPT_URL environment variable is not set");
}

const App: React.FC = () => {
  const navigate = useNavigate();
  const getStoredUrls = (): SpreadsheetUrls => {
    return { scriptUrl: APPSCRIPT_URL || '' };
  };

  const [state, setState] = useState<AppState>({
    data: [],
    content: spreadsheetService.getMockContent(),
    metadata: null,
    isLoading: true,
    error: null,
    spreadsheetUrls: getStoredUrls(),
    isAuthenticated: !!AuthService.getStoredUser(),
    currentUser: AuthService.getStoredUser()
  });

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showSignOutToast, setShowSignOutToast] = useState(false);

  const loadData = useCallback(async (url: string, forceRefresh = false) => {
    if (!url) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // 1. Check Browser Cache First (Client-Side Persistence)
    const CACHE_KEY = 'nkaisosela_content_cache';
    const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
    const cached = localStorage.getItem(CACHE_KEY);
    
    if (cached && !forceRefresh) {
      const { timestamp, content, metadata } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_TTL;
      
      // If we have valid cache, show it immediately
      if (content) {
        setState(prev => ({
          ...prev,
          content,
          data: content.products,
          metadata,
          isLoading: false
        }));
        
        // If not expired, we don't even need to call the API
        if (!isExpired) return;
      }
    }

    // 2. Background Fetch (Stale-While-Revalidate)
    // If we reached here, we either have no cache, it's expired, or we forced a refresh
    if (!state.content.products.length) {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
    }

    try {
      const { content, metadata } = await spreadsheetService.fetchCloudDatabase(url);
      
      // Update State
      setState(prev => ({
        ...prev,
        content,
        data: content.products,
        metadata,
        isLoading: false
      }));

      // Update Browser Cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        content,
        metadata
      }));
    } catch (err) {
      // If background fetch fails but we have cached data, don't show an error
      if (!state.content.products.length) {
        setState(prev => ({ ...prev, isLoading: false, error: "Cloud connection failed." }));
      }
    }
  }, [state.content.products.length]);

  useEffect(() => { 
    loadData(state.spreadsheetUrls.scriptUrl);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadData, state.spreadsheetUrls.scriptUrl]);

  // Dynamic Favicon Update
  useEffect(() => {
    const siteIcon = state.content.settings.site_icon;
    if (siteIcon) {
      const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (link) {
        link.href = siteIcon;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = siteIcon;
        document.getElementsByTagName('head')[0].appendChild(newLink);
      }
    }
  }, [state.content.settings.site_icon]);

  const handleLoginSuccess = async (user: any) => {
    setState(prev => ({ ...prev, isAuthenticated: true, currentUser: user }));
    setIsSignInModalOpen(false);
    navigate('/admin');
    
    // Update LastLogin in the spreadsheet in the background
    if (state.spreadsheetUrls.scriptUrl) {
      try {
        await spreadsheetService.saveRecord(state.spreadsheetUrls.scriptUrl, 'users', {
          ...user,
          LastLogin: new Date().toISOString(),
          id: user.Email
        });
        // Force refresh data to update status in settings
        await loadData(state.spreadsheetUrls.scriptUrl, true);
      } catch (err) {
        console.error("Failed to update login time:", err);
      }
    }
  };

  const handleLogout = () => {
    setIsSigningOut(true);
    setTimeout(() => {
      AuthService.logout();
      setState(prev => ({ ...prev, isAuthenticated: false, currentUser: null }));
      setIsSigningOut(false);
      setShowSignOutToast(true);
      setTimeout(() => setShowSignOutToast(false), 3000);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white w-full overflow-x-hidden font-['Inter']">
      <ScrollToTop />
      
      {/* Sign Out Notification */}
      {showSignOutToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] animate-in slide-in-from-bottom-10">
          <div className="bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-xl">
            <div className="bg-amber-500 p-1.5 rounded-full"><X size={14} className="text-white" /></div>
            <p className="text-[11px] font-black uppercase tracking-widest">Session Terminated • Signed Out</p>
          </div>
        </div>
      )}
      
      {/* Signing Out Overlay */}
      {isSigningOut && (
        <div className="fixed inset-0 z-[3000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <User size={16} className="text-indigo-600" />
              </div>
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-900">Securing Session...</p>
          </div>
        </div>
      )}
      
      {/* Minimalist Floating Header based on Design */}
        <header className={`fixed top-0 left-0 right-0 z-[1000] w-full transition-all duration-500 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-md py-4' : 'bg-transparent py-8'}`}>
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12 flex items-center justify-between">
            
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-cyan-400 rounded-lg flex items-center justify-center text-slate-900 rotate-12 group-hover:rotate-0 transition-transform overflow-hidden">
                  {state.content.settings.site_icon ? (
                    <img src={state.content.settings.site_icon} className="w-full h-full object-cover" alt="Logo" />
                  ) : (
                    <ShieldCheck size={20} />
                  )}
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white uppercase">{state.content.settings.site_name ? state.content.settings.site_name.split(' ')[0] : 'Nkaisosela'}</h1>
              </div>
            </Link>

            {/* Centered Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              <HeaderNavLink to="/" label="Home" />
              <HeaderNavLink to="/about" label="About Us" />
              <HeaderNavLink to="/services" label="Services" />
              <HeaderNavLink to="/catalog" label="Products" />
              <HeaderNavLink to="/blog" label="News" />
              <HeaderNavLink to="/contact" label="Contact" />
              {state.isAuthenticated && <HeaderNavLink to="/admin" label="Dashboard" />}
            </nav>

            {/* Utility Icons */}
            <div className="flex items-center gap-6">
              {state.isAuthenticated && (
                <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/10">
                  <div className="h-6 w-6 rounded-full bg-cyan-400 flex items-center justify-center text-[10px] font-black text-slate-900">
                    {state.currentUser?.Name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-[11px] font-bold text-white/90 truncate max-w-[100px]">
                    {state.currentUser?.Name?.split(' ')[0] || 'User'}
                  </span>
                </div>
              )}
              <button className="hidden sm:block text-white/80 hover:text-white transition-colors">
                <Search size={20} />
              </button>
              <button 
                onClick={state.isAuthenticated ? handleLogout : () => setIsSignInModalOpen(true)}
                className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-full transition-all ${state.isAuthenticated ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white' : 'text-white/80 hover:text-white'}`}
              >
                <User size={20} />
                {state.isAuthenticated && <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-0 left-0 right-0 h-screen bg-slate-950 p-12 flex flex-col gap-6 animate-in fade-in slide-in-from-right-full duration-500">
              <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-8 text-white"><X size={32}/></button>
              <MobileHeaderLink to="/" label="Home" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileHeaderLink to="/about" label="About Us" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileHeaderLink to="/services" label="Services" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileHeaderLink to="/catalog" label="Products" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileHeaderLink to="/blog" label="News" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileHeaderLink to="/contact" label="Contact" onClick={() => setIsMobileMenuOpen(false)} />
              {state.isAuthenticated && <MobileHeaderLink to="/admin" label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />}
              <div className="mt-auto border-t border-white/10 pt-8">
                {state.isAuthenticated && (
                  <div className="mb-6 flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="h-12 w-12 rounded-full bg-cyan-400 flex items-center justify-center text-lg font-black text-slate-900">
                      {state.currentUser?.Name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-white font-bold">{state.currentUser?.Name || 'User'}</p>
                      <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">{state.currentUser?.Role || 'Authorized'}</p>
                    </div>
                  </div>
                )}
                <button 
                  onClick={() => { state.isAuthenticated ? handleLogout() : setIsSignInModalOpen(true); setIsMobileMenuOpen(false); }}
                  className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${state.isAuthenticated ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-cyan-400 text-slate-950'}`}
                >
                  {state.isAuthenticated ? 'Sign Out' : 'Sign In'}
                </button>
              </div>
            </div>
          )}
        </header>

        <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} users={state.content.users} onLoginSuccess={handleLoginSuccess} />

        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home clients={state.content.clients} faqs={state.content.faqs} testimonials={state.content.testimonials} gallery={state.content.gallery} settings={state.content.settings} isAuthenticated={state.isAuthenticated} />} />
            <Route path="/catalog" element={<div className="pt-32 px-12 pb-24"><DataTable data={state.data} metadata={state.metadata} isAuthenticated={state.isAuthenticated} onSignInClick={() => setIsSignInModalOpen(true)} /></div>} />
            <Route path="/about" element={<div className="pt-32 px-12 pb-24"><AboutView team={state.content.team} gallery={state.content.gallery} isAuthenticated={state.isAuthenticated} /></div>} />
            <Route path="/services" element={<div className="pt-32 px-12 pb-24"><ServicesView services={state.content.services} /></div>} />
            <Route path="/blog" element={<div className="pt-32 px-12 pb-24"><BlogView posts={state.content.blogs} /></div>} />
            <Route path="/careers" element={<div className="pt-32 px-12 pb-24"><CareersView jobs={state.content.careers} /></div>} />
            <Route path="/contact" element={<div className="pt-32 px-12 pb-24"><ContactView /></div>} />
            <Route path="/chat" element={<AIChat data={state.data} />} />
            <Route 
              path="/admin" 
              element={state.isAuthenticated ? (
                <div className="pt-32 px-12 pb-24">
                  <Dashboard 
                    data={state.data} 
                    metadata={state.metadata} 
                    content={state.content} 
                    scriptUrl={state.spreadsheetUrls.scriptUrl}
                    onRefresh={() => loadData(state.spreadsheetUrls.scriptUrl, true)}
                  />
                </div>
              ) : <Navigate to="/" />} 
            />
            <Route path="/sync" element={state.isAuthenticated ? <div className="pt-32 px-12 pb-24"><SettingsView onUpdateUrl={(url) => loadData(url, true)} currentUrl={state.spreadsheetUrls.scriptUrl} content={state.content} /></div> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="bg-slate-950 text-white py-24 px-12 border-t border-white/5">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <h3 className="text-2xl font-bold uppercase tracking-tight">{state.content.settings.site_name || 'Nkaisosela'}</h3>
              <p className="text-slate-400 max-w-sm">Empowering success in the digital era, your growth partner.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/catalog">Products</Link></li>
                <li><Link to="/blog">News</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white">Contact</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>{state.content.settings.address || 'Kapiri Mposhi, Zambia'}</li>
                <li>{state.content.settings.email || 'info@nkaisosela.com'}</li>
                <li>{state.content.settings.phone || '+260 970 426 228'}</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
  );
};

const HeaderNavLink: React.FC<{ to: string; label: string }> = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`text-[13px] font-medium transition-colors hover:text-cyan-400 ${isActive ? 'text-white border-b-2 border-cyan-400' : 'text-white/80'}`}>
      {label}
    </Link>
  );
};

const MobileHeaderLink: React.FC<{ to: string; label: string; onClick: () => void }> = ({ to, label, onClick }) => (
  <Link to={to} onClick={onClick} className="text-2xl font-bold text-white hover:text-cyan-400 transition-colors">
    {label}
  </Link>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

export default App;
