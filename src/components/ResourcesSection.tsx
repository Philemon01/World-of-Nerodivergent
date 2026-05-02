import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Resource, getPublishedResources } from '../lib/services';
import { FileText, Download, ExternalLink, ShieldCheck, Search, X, BookOpen } from 'lucide-react';

export default function ResourcesSection() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      // Fetch all published for client filtering
      const data = await getPublishedResources();
      setResources(data);
      setLoading(false);
    };
    fetchResources();
  }, []);

  const types = Array.from(new Set(resources.map(r => r.type))).filter(Boolean);

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         res.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || res.type === selectedType;
    return matchesSearch && matchesType;
  });

  if (loading && resources.length === 0) {
    return (
      <section id="resources" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
           <div className="h-10 w-64 bg-slate-200 rounded-full mb-12 animate-pulse mx-auto"></div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[1, 2, 3].map(i => (
               <div key={i} className="h-96 bg-white rounded-3xl animate-pulse shadow-sm"></div>
             ))}
           </div>
        </div>
      </section>
    );
  }

  return (
    <section id="resources" className="py-32 bg-slate-50 scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rainbow-green/10 text-rainbow-green font-black text-xs uppercase tracking-widest mb-6"
            >
              <ShieldCheck size={14} />
              Verified Community Resources
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black text-brand-dark leading-none mb-8"
            >
              Tools for <br/><span className="text-rainbow-green">Brighter Days.</span>
            </motion.h2>
            <p className="text-slate-600 text-xl font-medium">
              Curated guides, checklists, and templates designed to support neurodivergent success.
            </p>
          </div>

          <div className="w-full lg:w-auto space-y-4">
             {/* Search */}
             <div className="relative group min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rainbow-green transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder="Find a resource..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-rainbow-green outline-none transition-all font-bold text-brand-dark shadow-sm"
                />
                {searchQuery && (
                   <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rainbow-red transition-colors">
                      <X size={16} />
                   </button>
                )}
             </div>

             {/* Type Filter */}
             <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedType(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${!selectedType ? 'bg-rainbow-green text-white shadow-lg shadow-rainbow-green/20' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
                >
                  All
                </button>
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${selectedType === t ? 'bg-rainbow-green text-white shadow-lg shadow-rainbow-green/20' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
                  >
                    {t}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredResources.map((res, index) => (
              <motion.div
                layout
                key={res.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative bg-white border border-slate-100 rounded-[3rem] p-10 hover:shadow-2xl transition-all flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                   <FileText size={140} className="text-rainbow-green" />
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-rainbow-green mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <FileText size={32} />
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    <span className="px-2 py-0.5 bg-slate-100 rounded-md capitalize">{res.type}</span>
                    {res.isFree && <span>• Fully Free</span>}
                  </div>

                  <h3 className="text-2xl font-black text-brand-dark mb-4 leading-tight group-hover:text-rainbow-green transition-colors">
                    {res.title}
                  </h3>
                  
                  <p className="text-slate-600 font-medium mb-12 line-clamp-3 leading-relaxed">
                    {res.description}
                  </p>

                  <div className="mt-auto">
                    <a 
                      href={res.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-brand-dark text-white rounded-2xl font-black shadow-lg shadow-brand-dark/20 hover:scale-105 active:scale-95 transition-all w-full justify-center group/btn"
                    >
                      {res.isFree ? (
                        <>Download Guide <Download size={20} className="group-hover/btn:translate-y-0.5 transition-transform" /></>
                      ) : (
                        <>Access Tool <ExternalLink size={20} /></>
                      )}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredResources.length === 0 && (
           <div className="py-32 text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-slate-200 mx-auto mb-8 shadow-sm">
                 <BookOpen size={48} />
              </div>
              <h3 className="text-2xl font-black text-brand-dark mb-4 text-center">No documents found</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
                 Try a different search term or clear your type filter.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedType(null); }}
                className="px-8 py-4 bg-brand-dark text-white rounded-2xl font-black shadow-lg shadow-brand-dark/20 hover:scale-105 transition-all"
              >
                Clear all filters
              </button>
           </div>
        )}
      </div>
    </section>
  );
}
