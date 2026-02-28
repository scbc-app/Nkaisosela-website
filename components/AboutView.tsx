
import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  Target, 
  Award, 
  Zap, 
  Users, 
  Heart, 
  CheckCircle2, 
  User as UserIcon,
  Globe,
  FileText,
  Settings,
  Pencil
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TeamMember, GalleryProject } from '../types';

interface AboutViewProps {
  team: TeamMember[];
  gallery: GalleryProject[];
  isAuthenticated?: boolean;
}

const AboutView: React.FC<AboutViewProps> = ({ team, gallery, isAuthenticated }) => {
  // Use team data from spreadsheet, fallback to defaults if empty
  const managementData = team.length > 0 ? team : [
    { name: 'Aaron Ngulube', role: 'Operations Manager', imageUrl: '' },
    { name: 'Mercy Chilekwa', role: 'Director', imageUrl: '' },
    { name: 'Catherine Ngulube', role: 'Director', imageUrl: '' },
    { name: 'Simon Ngulube', role: 'Director', imageUrl: '' }
  ];

  const getAvatarUrl = (name: string, imageUrl?: string) => {
    if (imageUrl && imageUrl.startsWith('data:image')) return imageUrl;
    if (imageUrl && imageUrl.startsWith('http')) return imageUrl;
    // Premium initial-based avatars
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f1f5f9&color=475569&size=512&bold=true`;
  };

  return (
    <div className="space-y-24 w-full overflow-x-hidden page-enter pb-24">
      
      {/* Section: Who We Are */}
      <section className="max-w-7xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-block px-4 py-1.5 bg-cyan-50 text-cyan-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">Who we are</div>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tightest leading-[1.1] uppercase">
              A Proudly <br/><span className="text-cyan-600">Zambian Company</span>
            </h1>
          </div>
          <div className="space-y-6 text-slate-600 font-medium leading-relaxed text-lg">
            <p>
              Nkaisosela Suppliers and General Dealers Ltd is a proudly Zambian-owned private company, registered under the Companies Act No. 10 of 2017. Established on November 24, 2022, and registered with PACRA (registration number 120220042415), we are also recognized by the Zambia Revenue Authority (TPIN Number 2000795009).
            </p>
            <p className="text-slate-500 text-base">
              Our mission is to demonstrate expertise in offering professional advice and executing comprehensive services in supplying and general dealing, serving diverse clients in the private sector and individuals with excellence.
            </p>
          </div>
        </div>
        <div className="relative aspect-square sm:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000" 
            className="w-full h-full object-cover" 
            alt="Nkaisosela Team" 
          />
          <div className="absolute inset-0 bg-slate-900/20"></div>
        </div>
      </section>

      {/* Section: Operational Network & Mission */}
      <section className="bg-slate-50 py-24 px-6 rounded-[4rem]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="h-14 w-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center">
              <MapPin size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Operational Network</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Our company proudly operates from our head office located in Kapiri Mposhi, Central Province, Zambia. This central location enables us to effectively manage and coordinate our operations, ensuring seamless service delivery across all regions.
            </p>
          </div>
          <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Target size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Our Mission</h3>
            <p className="text-slate-500 font-medium leading-relaxed italic">
              "To demonstrate expertise in offering professional advice and executing comprehensive services in supplying and general dealing, serving diverse clients in the private sector and individuals with excellence."
            </p>
          </div>
        </div>
      </section>

      {/* Section: Core Values (Business Integrity) - Redesigned to be minimalist and subtle */}
      <section className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tightest">Business Integrity</h2>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-cyan-600">The principles that drive us</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { title: 'Compliance', desc: 'Strict ZRA regulations adherence', icon: <FileText size={18}/> },
            { title: 'Customer First', desc: 'Prioritizing unique client needs', icon: <Heart size={18}/> },
            { title: 'Prompt Service', desc: 'Efficiency in every delivery', icon: <Zap size={18}/> },
            { title: 'Innovation', desc: 'Motivated and creative staff', icon: <Users size={18}/> },
            { title: 'Pure Integrity', desc: 'Fairness in every transaction', icon: <ShieldCheck size={18}/> }
          ].map((v, i) => (
            <div key={i} className="p-8 bg-white border border-slate-100 rounded-3xl hover:border-cyan-200 hover:shadow-lg transition-all text-center space-y-4">
              <div className="mx-auto text-cyan-600">{v.icon}</div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{v.title}</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Company Capacity */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="bg-slate-900 text-white rounded-[4rem] p-12 sm:p-20 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tightest uppercase">Company Capacity</h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                We deliver high-quality products and services to every region in Zambia, ensuring efficient and timely delivery. Our expertise spans various sectors, backed by stringent quality control and a robust logistics network, guaranteeing customer satisfaction across the country.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-8 bg-white/5 border border-white/10 rounded-3xl text-center">
                <Truck className="text-cyan-400 mx-auto mb-3" size={24} />
                <p className="text-[9px] font-black uppercase tracking-widest">Nationwide</p>
              </div>
              <div className="p-8 bg-white/5 border border-white/10 rounded-3xl text-center">
                <Globe className="text-cyan-400 mx-auto mb-3" size={24} />
                <p className="text-[9px] font-black uppercase tracking-widest">Regional</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 blur-[100px] rounded-full"></div>
        </div>
      </section>

      {/* Section: Management */}
      <section className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tightest">Our Management</h2>
            {isAuthenticated && (
              <Link to="/admin" className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                <Pencil size={12} /> Edit Management Team
              </Link>
            )}
          </div>
          <p className="text-slate-500 text-sm font-medium">
            Our company is led by qualified directors overseeing operations, supported by technical staff ensuring client satisfaction. We emphasize close supervision to secure nationwide business.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {managementData.map((member: any, i) => (
            <div key={i} className="group text-center space-y-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center relative shadow-sm hover:shadow-lg transition-all duration-500">
                <img 
                  src={getAvatarUrl(member.name || member.Item, member.imageUrl)} 
                  className={`w-full h-full object-cover transition-all duration-500 ${!member.imageUrl ? 'opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100' : ''}`} 
                  alt={member.name || member.Item} 
                />
                {isAuthenticated && (
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Link to="/admin" className="p-2 bg-white text-slate-900 rounded-full shadow-lg hover:scale-110 transition-transform">
                      <Settings size={14} />
                    </Link>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">{member.name || member.Item}</h4>
                <p className="text-[9px] font-black text-cyan-600 uppercase tracking-widest">{member.role || 'Officer'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Registry & Compliance - Redesigned to be subtle and integrated */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-white border border-slate-200 rounded-[3rem] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tightest uppercase leading-none">Registry & <br/>Compliance</h2>
              <p className="text-slate-500 text-sm font-medium">Fully certified Zambian enterprise adhering to strict financial and legal standards.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400">
                  <Building2 size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PACRA Registration</p>
                  <p className="text-sm font-mono font-black text-slate-900">120220042415</p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tax Identity (TPIN)</p>
                  <p className="text-sm font-mono font-black text-slate-900">2000795009</p>
                </div>
              </div>
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Award size={14} className="text-cyan-600" /> Authorized Supplier Entity
            </p>
          </div>
          <div className="lg:col-span-7 h-[400px] rounded-[2.5rem] overflow-hidden shadow-inner border border-slate-100 grayscale hover:grayscale-0 transition-all duration-700">
            <iframe 
              src="https://maps.google.com/maps?q=-13.967971,28.677111&z=15&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }}
              title="Office Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Section: Full Project Gallery */}
      {gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tightest">Project Showcase</h2>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-cyan-600">A visual record of our operational excellence</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {gallery.map((project) => (
              <div key={project.id} className="group relative aspect-square rounded-[3rem] overflow-hidden bg-slate-100 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                <img 
                  src={project.imageUrl} 
                  alt={project.projectName} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-all duration-500 p-10 flex flex-col justify-end translate-y-4 group-hover:translate-y-0">
                  <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2">{project.location}</p>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight leading-tight">{project.projectName}</h4>
                  {project.description && (
                    <p className="text-slate-400 text-[10px] font-medium mt-4 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutView;
