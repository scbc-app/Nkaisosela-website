import React from 'react';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogViewProps {
  posts: BlogPost[];
}

const BlogView: React.FC<BlogViewProps> = ({ posts }) => {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 w-full overflow-x-hidden">
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-10 px-2">
        <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">Industry Insights</div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter">Blog & <br className="sm:hidden"/><span className="text-indigo-600">Company News</span></h1>
        <p className="text-base sm:text-xl text-slate-500 font-medium">Synced in real-time with our master industrial reports.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
        {posts.map((post) => (
          <article key={post.id} className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
            <div className="h-60 overflow-hidden relative">
              <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm flex items-center gap-1.5"><Tag size={12} />{post.category}</span>
              </div>
            </div>
            <div className="p-8 space-y-4 flex-1 flex flex-col">
              <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-indigo-400" /> {post.date}</span>
                <span className="flex items-center gap-1.5"><User size={14} className="text-indigo-400" /> {post.author}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{post.title}</h3>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest leading-relaxed flex-1 opacity-70">{post.excerpt}</p>
              <div className="pt-6 border-t border-slate-50">
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-2 group-hover:gap-4 transition-all">Read Article <ArrowRight size={16} /></button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default BlogView;