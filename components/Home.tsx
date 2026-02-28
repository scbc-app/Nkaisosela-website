
import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShieldCheck,
  Truck,
  Building2,
  Handshake,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  Zap,
  Briefcase,
  Target,
  Award,
  Wallet,
  Activity,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ClientPartner, FAQItem, Testimonial, GalleryProject } from '../types';

interface HomeProps {
  clients: ClientPartner[];
  faqs: FAQItem[];
  testimonials: Testimonial[];
  gallery: GalleryProject[];
  settings: Record<string, string>;
  isAuthenticated: boolean;
}

const Home: React.FC<HomeProps> = ({ clients, faqs, testimonials, gallery, settings, isAuthenticated }) => {
  const siteName = settings.site_name || "";
  return (
    <div className="space-y-24 w-full overflow-x-hidden page-enter pb-24">
      {/* Hero Section - Professional Transparent Design */}
      <section className="relative h-screen min-h-[700px] w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover" 
            alt={`${siteName} Hero`} 
          />
          <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[1px]"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="space-y-4">
            <span className="text-cyan-400 text-sm font-medium tracking-wide uppercase">Empowering success in the digital era, your growth partner</span>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-white leading-[1.1] tracking-tight">
              {siteName}
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link 
              to="/catalog" 
              className="group w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 rounded-lg font-bold text-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Discover Products <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to={isAuthenticated ? "/admin" : "/contact"} 
              className="w-full sm:w-auto px-10 py-5 border border-white/30 text-white rounded-lg font-bold text-sm bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get started now"}
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 opacity-60">
           <div className="flex gap-2">
             <div className="w-2 h-2 rounded-full bg-white"></div>
             <div className="w-2 h-2 rounded-full bg-white/30"></div>
             <div className="w-2 h-2 rounded-full bg-white/30"></div>
           </div>
        </div>
      </section>

      {/* Welcome & Mission Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Welcome to {siteName}</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              At {siteName}, we are dedicated to providing exceptional products and services to meet your needs. With a strong commitment to quality and customer satisfaction, we strive to be your preferred supplier for all your requirements.
            </p>
          </div>
          <p className="text-slate-500 font-medium">
            {siteName} is a proudly Zambian-owned private company, established to meet your diverse needs with excellence. We are officially registered under the Company's Act No. 10 of 2017, ensuring our commitment to the highest standards of business practice.
          </p>
          <div className="p-8 bg-slate-900 rounded-3xl text-white space-y-4">
            <div className="flex items-center gap-3">
              <Target className="text-cyan-400" size={24} />
              <h4 className="text-xl font-bold uppercase tracking-tight">Our Mission</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed italic">
              "Our mission is to deliver superior products and services that exceed customer expectations. We aim to foster long-term relationships based on trust, integrity, and mutual respect."
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt={`${siteName} Professional`} />
          </div>
          <div className="absolute -bottom-8 -left-8 bg-cyan-400 p-10 rounded-[2rem] shadow-xl max-w-xs hidden md:block">
            <Award className="text-slate-900 mb-4" size={32} />
            <h4 className="text-slate-900 font-bold uppercase tracking-widest text-xs mb-2">Commitment to Excellence</h4>
            <p className="text-slate-800 text-xs font-medium leading-relaxed">Managed by a team of highly qualified directors and skilled technical staff.</p>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="bg-slate-50 py-24 px-6 sm:px-12 rounded-[5rem]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Our Approach</h2>
            <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Consistent Quality & Oversight</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-12 bg-white rounded-[3rem] shadow-sm space-y-6 hover:shadow-xl transition-all group">
              <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Activity size={32} />
              </div>
              <h4 className="text-2xl font-bold">Close Supervision</h4>
              <p className="text-slate-500 text-sm leading-relaxed">We ensure meticulous oversight of all services and works to maintain the highest possible standards.</p>
            </div>
            <div className="p-12 bg-white rounded-[3rem] shadow-sm space-y-6 hover:shadow-xl transition-all group">
              <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <ShieldCheck size={32} />
              </div>
              <h4 className="text-2xl font-bold">Quality Services</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Our success is built on the consistent delivery of quality services and products across all sectors.</p>
            </div>
            <div className="p-12 bg-white rounded-[3rem] shadow-sm space-y-6 hover:shadow-xl transition-all group">
              <div className="h-16 w-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
                <Users size={32} />
              </div>
              <h4 className="text-2xl font-bold">Experienced Team</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Our management possesses extensive knowledge and experience having worked with industry giants.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Operations, Finance, Supply Chain */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 space-y-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="h-16 w-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center"><Briefcase size={28} /></div>
            <h3 className="text-2xl font-bold">Operations</h3>
            <p className="text-slate-500 text-sm leading-relaxed">We ensure efficient and effective operations using the best practices and latest technology. Our team works hard to complete every project on time and to the highest standards.</p>
          </div>
          <div className="space-y-6">
            <div className="h-16 w-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center"><Wallet size={28} /></div>
            <h3 className="text-2xl font-bold">Finance</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Our financial team maintains stability and growth through careful planning and strict controls. We prioritize transparency and accountability to build trust.</p>
          </div>
          <div className="space-y-6">
            <div className="h-16 w-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center"><Truck size={28} /></div>
            <h3 className="text-2xl font-bold">Supply Chain</h3>
            <p className="text-slate-500 text-sm leading-relaxed">We have a strong supply chain network to ensure smooth delivery. Our team focuses on sourcing high-quality products and ensuring timely deliveries.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-900 py-32 px-6 sm:px-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/5 blur-[120px] rounded-full -mr-64 -mt-64"></div>
        <div className="max-w-7xl mx-auto space-y-20 relative z-10">
          <div className="max-w-xl space-y-4">
            <h2 className="text-5xl font-bold tracking-tight">Why Choose Us?</h2>
            <p className="text-slate-400 text-lg">Unmatched reliability in general dealing and supply.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-cyan-400 text-slate-950 rounded-xl flex items-center justify-center"><Award size={24} /></div>
              <h4 className="text-xl font-bold uppercase tracking-tight">Quality Assurance</h4>
              <p className="text-slate-400 text-sm leading-relaxed">We ensure that every product meets stringent quality standards through rigorous verification processes.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-cyan-400 text-slate-950 rounded-xl flex items-center justify-center"><Zap size={24} /></div>
              <h4 className="text-xl font-bold uppercase tracking-tight">Competitive Pricing</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Enjoy competitive prices without compromising on quality, thanks to our optimized supply network.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-cyan-400 text-slate-950 rounded-xl flex items-center justify-center"><Users size={24} /></div>
              <h4 className="text-xl font-bold uppercase tracking-tight">Customer Focus</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Our dedicated team is committed to providing personalized service and support tailored to your unique needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Picture Gallery Section */}
      {gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Picture Gallery</h2>
              <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Visual highlights of our projects</p>
            </div>
            <Link to="/about" className="text-cyan-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">
              View All Projects <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gallery.slice(0, 6).map((item, idx) => (
              <div key={item.id} className={`group relative overflow-hidden rounded-[2.5rem] bg-slate-200 aspect-square ${idx === 0 ? 'md:col-span-2 md:aspect-auto' : ''}`}>
                <img src={item.imageUrl} alt={item.projectName} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end text-white">
                  <h5 className="font-bold text-xl">{item.projectName}</h5>
                  <p className="text-xs text-slate-300 mt-2">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-slate-50 py-24 px-6 sm:px-12 rounded-[4rem]">
          <div className="max-w-[1440px] mx-auto space-y-12">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight text-center">Customer Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.slice(0, 2).map(t => (
                <div key={t.id} className="p-10 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-6">
                  <div className="flex text-amber-500 gap-1">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-lg text-slate-600 font-medium italic leading-relaxed">"{t.quote}"</p>
                  <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                      {t.clientName.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900">{t.clientName}</h5>
                      <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest">{t.companyName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-24 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Quick answers to common inquiries</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <FAQAccordionItem key={faq.id} faq={faq} />
            ))}
          </div>
        </section>
      )}

      {/* Partners & Clients Section */}
      {clients.length > 0 && (
        <section className="bg-slate-900 py-32 px-6 sm:px-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>
          <div className="max-w-7xl mx-auto space-y-20 relative z-10">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-white tracking-tight">Our Partners & Clients</h2>
              <p className="text-slate-400 uppercase tracking-widest text-xs font-bold">Trusted by industry leaders across Zambia</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {clients.map((client) => (
                <div key={client.id} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-500 flex flex-col items-center text-center space-y-6 group">
                  <div className="h-20 w-full flex items-center justify-center">
                    {client.logoUrl ? (
                      <img 
                        src={client.logoUrl} 
                        alt={client.clientName} 
                        className="max-h-full max-w-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Building2 size={48} className="text-cyan-400/30" />
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">{client.clientName}</h4>
                      <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{client.industry}</p>
                    </div>
                    {(client.address || client.details) && (
                      <div className="pt-4 border-t border-white/10 space-y-2">
                        {client.address && (
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                            <MapPin size={10} className="text-cyan-400" /> {client.address}
                          </p>
                        )}
                        {client.details && (
                          <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                            "{client.details}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const FAQAccordionItem: React.FC<{ faq: FAQItem }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-bold text-slate-900">{faq.question}</span>
        {isOpen ? <ChevronUp size={20} className="text-cyan-600" /> : <ChevronDown size={20} className="text-slate-400" />}
      </button>
      {isOpen && (
        <div className="px-8 pb-6 text-slate-500 text-sm leading-relaxed animate-in slide-in-from-top-2 duration-300">
          {faq.answer}
        </div>
      )}
    </div>
  );
};

export default Home;
