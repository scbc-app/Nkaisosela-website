
import React from 'react';
import { MapPin, Phone, Mail, Clock, Send, Twitter, Facebook, Instagram, Linkedin, ExternalLink } from 'lucide-react';
import ContactInfoItem from './contact/ContactInfoItem';
import ContactSocialIcon from './contact/ContactSocialIcon';

const ContactView: React.FC = () => {
  // Restored precise coordinates for Chanika Lodge, Kapiri Mposhi
  const latitude = -13.967971;
  const longitude = 28.677111;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;

  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-10">
        <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
          Contact Us
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
          Get in Touch <br/>
          <span className="text-indigo-600">With Our Experts</span>
        </h1>
        <p className="text-lg text-slate-500 font-medium">
          Whether you have questions about our products, need assistance, or want to discuss a customized solution, our friendly team is here to help.
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Information */}
        <div className="space-y-12">
          <div className="space-y-8">
            <ContactInfoItem 
              icon={<MapPin size={24} />}
              title="Our Head Office"
              line1="Chanika Lodge, Shop #3"
              line2="Kapiri Mposhi, Central Province, Zambia"
            />
            <ContactInfoItem 
              icon={<Phone size={24} />}
              title="Phone Support"
              line1="+260 970 426 228"
              line2="Monday - Saturday: 08:00 - 17:00"
            />
            <ContactInfoItem 
              icon={<Mail size={24} />}
              title="Email Inquiry"
              line1="info@nkaisosela.com"
              line2="sales@nkaisosela.com"
            />
            <ContactInfoItem 
              icon={<Clock size={24} />}
              title="Business Hours"
              line1="Weekdays: 08:00 - 17:00"
              line2="Saturdays: 08:30 - 13:00"
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Follow Us</h4>
            <div className="flex gap-4">
              <ContactSocialIcon icon={<Facebook size={20} />} />
              <ContactSocialIcon icon={<Twitter size={20} />} />
              <ContactSocialIcon icon={<Instagram size={20} />} />
              <ContactSocialIcon icon={<Linkedin size={20} />} />
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50">
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Name</label>
                <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                <input type="email" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</label>
              <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all">
                <option>General Inquiry</option>
                <option>Product Quotation</option>
                <option>Advertising & Partnership</option>
                <option>Partnership Proposal</option>
                <option>Support Request</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Message</label>
              <textarea rows={5} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all" placeholder="Tell us how we can help you..."></textarea>
            </div>
            <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3">
              <Send size={18} />
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="h-[500px] w-full rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm relative group bg-slate-100">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
        ></iframe>
        <div className="absolute top-8 left-8">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl border border-white/20 max-w-xs space-y-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <MapPin size={20} />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Visit Our Office</h4>
            <p className="text-slate-500 text-xs leading-relaxed">Chanika Lodge, Shop #3, Kapiri Mposhi, Zambia</p>
            <p className="text-indigo-600/60 text-[10px] font-bold tracking-tight">Coordinates: {latitude}, {longitude}</p>
            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors pt-2"
            >
              Get Directions <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactView;
