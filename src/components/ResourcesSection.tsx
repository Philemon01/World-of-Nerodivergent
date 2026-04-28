import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Resource, getPublishedResources } from '../lib/services';
import { FileText, Download, ExternalLink, ShieldCheck } from 'lucide-react';

export default function ResourcesSection() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      const data = await getPublishedResources();
      setResources(data);
      setLoading(false);
    };
    fetchResources();
  }, []);

  if (loading) return null;
  if (resources.length === 0) return null;

  return (
    <section id="resources" className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
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
              className="text-4xl md:text-6xl font-black text-brand-dark leading-[1.1]"
            >
              Tools for a <span className="text-rainbow-green">Brighter</span> Path.
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-slate-600 max-w-sm font-medium"
          >
            Download our curated guides and checklists designed specifically for the neurodivergent community.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((res, index) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <FileText size={120} className="text-rainbow-green" />
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-rainbow-green mb-8 group-hover:scale-110 transition-transform">
                  <FileText size={32} />
                </div>

                <div className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  {res.type} document {res.isFree && '• Free'}
                </div>

                <h3 className="text-2xl font-black text-brand-dark mb-4 group-hover:text-rainbow-green transition-colors">
                  {res.title}
                </h3>

                <p className="text-slate-600 font-medium mb-8 line-clamp-3">
                  {res.description}
                </p>

                <a 
                  href={res.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-brand-dark text-white rounded-2xl font-black shadow-lg shadow-brand-dark/20 hover:scale-105 active:scale-95 transition-all w-full justify-center group/btn"
                >
                  {res.isFree ? (
                    <>Download Now <Download size={20} className="group-hover/btn:translate-y-0.5 transition-transform" /></>
                  ) : (
                    <>Get Resource <ExternalLink size={20} /></>
                  )}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
