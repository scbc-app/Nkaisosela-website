
import React from 'react';
import { 
  Truck, 
  Package, 
  Layers, 
  Pickaxe, 
  ShoppingBag, 
  Wrench, 
  ArrowRight, 
  Settings, 
  Droplets, 
  Sprout, 
  Cog, 
  MessageCircle, 
  ShieldCheck 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ServiceItem } from '../types';

interface ServicesViewProps {
  services: ServiceItem[];
}

const ServicesView: React.FC<ServicesViewProps> = ({ services }) => {
  return (
    <div className="space-y-20 page-enter w-full overflow-x-hidden pb-24">
      {/* Header Section */}
      <section className="text-center max-w-5xl mx-auto space-y-6 pt-12 px-6">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-7xl font-black text-slate-900 leading-[1.1] tracking-tightest uppercase">
            Industry-leading Specialists <br/>
            <span className="text-indigo-600">In Supplying & Dealing</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">
            Discover a diverse range of solutions tailored to meet your unique requirements. From essential offerings to specialized solutions, we are committed to delivering excellence in every aspect. Explore how Nkaisosela Suppliers & General Dealers can support your needs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {services.map((service) => (
          <div key={service.id} className="group bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full overflow-hidden">
            {service.imageUrl && (
              <div className="h-64 w-full overflow-hidden">
                <img 
                  src={service.imageUrl} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <div className="p-10 flex-1 flex flex-col space-y-6">
              <div className="h-16 w-16 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                {<Wrench size={32} />}
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-900 leading-tight">
                  {service.title}
                </h3>
              </div>
              <p className="text-slate-500 text-sm font-medium leading-relaxed flex-1">
                {service.desc}
              </p>
              <div className="pt-8 border-t border-slate-50">
                <Link 
                  to="/contact" 
                  className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-3 hover:gap-5 transition-all group/btn"
                >
                  Request Service <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Footer Call to Action - Reduced Size */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="bg-slate-900 rounded-[2.5rem] p-10 sm:p-14 text-center space-y-8 relative overflow-hidden">
          <div className="relative z-10 space-y-5">
            <div className="inline-flex h-12 w-12 bg-white/10 rounded-xl items-center justify-center text-indigo-400 mb-2 border border-white/5">
              <MessageCircle size={24} />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tightest">
              Want to talk to someone?
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto font-medium">
              Whether you have questions about our products, need assistance, or want to discuss a customized solution, our friendly team is here to help. Contact us today for expert advice and personalized service tailored to your needs.
            </p>
            <div className="pt-4">
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 hover:scale-105 transition-all shadow-xl shadow-indigo-500/20"
              >
                Get In Touch Now <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          {/* Subtle Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full"></div>
        </div>
      </section>
    </div>
  );
};

export default ServicesView;
