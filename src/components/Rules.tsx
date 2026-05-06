import { motion } from 'motion/react';
import { Heart, Brain, Users, Lightbulb, ShieldCheck, Sparkles } from 'lucide-react';

const rules = [
  {
    icon: <Heart className="text-white" />,
    color: "bg-rainbow-red",
    title: "Supportive Environment",
    description: "A safe haven where every member is heard, understood, and supported without judgment."
  },
  {
    icon: <Brain className="text-white" />,
    color: "bg-rainbow-orange",
    title: "Empowering Minds",
    description: "Focusing on strengths and providing tools to navigate a world not always built for neurodiversity."
  },
  {
    icon: <Users className="text-white" />,
    color: "bg-rainbow-green",
    title: "Community Hub",
    description: "Connecting families and individuals to share experiences, strategies, and success stories."
  },
  {
    icon: <Lightbulb className="text-white" />,
    color: "bg-rainbow-blue",
    title: "Resource Sharing",
    description: "Access to high-quality educational materials, advocacy tools, and original research."
  },
  {
    icon: <ShieldCheck className="text-white" />,
    color: "bg-rainbow-indigo",
    title: "Safe Space",
    description: "Strict community guidelines ensure a respectful, inclusive, and privacy-focused space."
  },
  {
    icon: <Sparkles className="text-white" />,
    color: "bg-rainbow-violet",
    title: "Spectrum Advocacy",
    description: "Celebrating the unique brilliance of every individual within the neurodivergent spectrum."
  }
];

export default function Rules() {
  return (
    <section id="rules" className="py-12 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3">Our Colorful Principles</h2>
          <p className="text-slate-600 text-sm md:text-base font-medium">
            We believe neurodiversity is a spectrum of brilliant colors. Our community is built on trust, empathy, and shared empowerment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rules.map((rule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-[1.25rem] bg-slate-50 border-2 border-transparent hover:border-slate-200 hover:shadow-lg transition-all duration-500 group relative overflow-hidden"
            >
              <div className={`w-10 h-10 rounded-xl ${rule.color} flex items-center justify-center mb-5 shadow-md group-hover:rotate-6 transition-transform duration-300`}>
                {rule.icon}
              </div>
              <h3 className="text-lg font-bold text-brand-dark mb-2">{rule.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm font-medium">
                {rule.description}
              </p>
              
              {/* Subtle background color peek */}
              <div className={`absolute -right-10 -bottom-10 w-32 h-32 ${rule.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
