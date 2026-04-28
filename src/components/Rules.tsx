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
    <section id="rules" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6">Our Colorful Principles</h2>
          <p className="text-slate-600 text-lg md:text-xl">
            We believe neurodiversity is a spectrum of brilliant colors. Our community is built on trust, empathy, and shared empowerment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rules.map((rule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-10 rounded-[2rem] bg-slate-50 border-2 border-transparent hover:border-slate-200 hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
            >
              <div className={`w-16 h-16 rounded-2xl ${rule.color} flex items-center justify-center mb-8 shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                {rule.icon}
              </div>
              <h3 className="text-2xl font-bold text-brand-dark mb-4">{rule.title}</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
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
