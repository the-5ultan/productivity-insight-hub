import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import { BarChart3, Network, Brain } from 'lucide-react';

const TypewriterHeadline = () => {
  const messages = [
    "Transform Digital Behavior Into Productivity Insights",
    "Discover Hidden Patterns Inside Student Productivity",
    "Turn Technology Usage Data Into Actionable Research"
  ];
  
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === messages[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2500);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % messages.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 40 : 70);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  return (
    <h1 className="text-white font-serif font-medium tracking-tight leading-[1.05] min-h-[2.8em] sm:min-h-[2.4em] md:min-h-[2.1em] flex flex-col justify-center items-center" 
        style={{ fontSize: 'clamp(1.8rem, 6vw, 4.5rem)' }}>
      <span className="block max-w-[15ch] md:max-w-none text-center px-2">
        {messages[index].substring(0, subIndex)}
        <span className="inline-block w-[2px] h-[0.9em] bg-white ml-1 animate-pulse" style={{ verticalAlign: 'middle' }} />
      </span>
    </h1>
  );
};

const LandingPage = () => {
  const partners = [
    'Iqra University',
    'Research Hub',
    'DataLab',
    'InsightIQ',
    'Techlytics AI'
  ];

  const capabilities = [
    {
      title: 'Descriptive Statistics',
      tags: ['Mean', 'Median', 'Variance', 'Standard Deviation'],
      desc: 'Automatically calculate and visualize core statistical measures to understand productivity behavior patterns.',
      icon: <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      title: 'Correlation Analysis',
      tags: ['Heatmaps', 'Relationships', 'Patterns', 'Insights'],
      desc: 'Discover how screen time, social media usage, study time, and sleep duration influence productivity scores.',
      icon: <Network className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      title: 'Predictive Intelligence',
      tags: ['Probability', 'Prediction', 'AI Insights', 'Research'],
      desc: 'Generate productivity predictions and receive intelligent interpretations of statistical findings.',
      icon: <Brain className="w-5 h-5 md:w-6 md:h-6" />
    }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white/30 overflow-x-hidden">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 md:pt-48 lg:pt-56 xl:pt-60 pb-20 sm:pb-28 md:pb-36 lg:pb-40 px-4 sm:px-6 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center space-x-3 px-4 sm:px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8 sm:mb-10 md:mb-14"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-white animate-pulse flex-shrink-0" />
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white/60">
              Modern AI-Powered Analytics Platform
            </span>
          </motion.div>

          <div className="mb-8 sm:mb-10 md:mb-14">
            <TypewriterHeadline />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/50 max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20 leading-[1.6] font-light tracking-wide px-2"
          >
            Analyze screen time, social media usage, study habits, and sleep patterns through <span className="text-white italic">advanced statistical analysis</span>, AI-powered interpretations, and predictive modeling for better productivity outcomes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-10"
          >
            <Link to="/register" className="btn-primary px-8 sm:px-10 md:px-14 py-3 md:py-5 text-[13px] sm:text-[14px] md:text-[15px] tracking-[0.1em] uppercase font-bold w-full sm:w-auto text-center">
              Start Analysis
            </Link>
            <Link to="/dashboard/reports" className="btn-secondary px-8 sm:px-10 md:px-14 py-3 md:py-5 text-[13px] sm:text-[14px] md:text-[15px] tracking-[0.1em] uppercase font-bold w-full sm:w-auto text-center">
              View Research
            </Link>
          </motion.div>

          {/* Hero Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mt-20 sm:mt-28 md:mt-36 lg:mt-44 max-w-4xl mx-auto px-2">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 relative group bg-white/5 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem]"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2rem] sm:rounded-[2.5rem]" />
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium mb-2 md:mb-3 text-white">87%</div>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/50 font-bold px-4 text-center">Prediction Accuracy</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 relative group bg-white/5 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem]"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2rem] sm:rounded-[2.5rem]" />
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium mb-2 md:mb-3 text-white">10K+</div>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/50 font-bold px-4 text-center">Analytics Generated</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 border-y border-white/5 bg-black/40 backdrop-blur-md px-4 sm:px-6 z-10">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-24 xl:gap-32 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
          {partners.map((partner) => (
            <span key={partner} className="text-lg sm:text-xl md:text-2xl font-serif font-medium tracking-tight whitespace-nowrap text-white">
              {partner}
            </span>
          ))}
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="features" className="relative py-24 sm:py-32 md:py-40 lg:py-48 px-4 sm:px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 sm:mb-20 md:mb-24 text-center">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] sm:tracking-[0.5em] uppercase text-white/40 mb-4 sm:mb-6 block"
            >
              Intelligence Platform
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-medium tracking-tight mb-6 sm:mb-8 text-white px-2"
            >
              Analytics <br />
              <span className="italic font-light text-white/60">Reimagined</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-lg sm:text-xl md:text-2xl text-white/50 max-w-2xl mx-auto font-light px-4"
            >
              Powerful statistical tools designed to uncover meaningful relationships between technology usage and productivity outcomes.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card group hover:translate-y-[-10px] transition-all duration-700 bg-white/5 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10"
              >
                <div className="mb-8 sm:mb-10 md:mb-12 p-3 sm:p-4 w-fit rounded-2xl bg-white/5 border border-white/10 text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-700">
                  {cap.icon}
                </div>
                <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                  {cap.tags.map(tag => (
                    <span key={tag} className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.15em] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/5 text-white/40 group-hover:border-white/20 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl sm:text-3xl mb-4 sm:mb-6 font-serif text-white">{cap.title}</h3>
                <p className="text-white/50 leading-relaxed text-base sm:text-lg font-light">
                  {cap.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 sm:py-20 md:py-24 border-t border-white/5 px-4 sm:px-6 z-10 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
          <div className="text-2xl sm:text-3xl font-serif font-medium tracking-tight flex items-center gap-3">
             <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
            Techlytics
          </div>
          <div className="text-[10px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.4em] text-secondary-accent/40 uppercase font-bold text-center md:text-left">
            © 2026 Transform Digital Behavior Into Productivity Insights
          </div>
          <div className="flex space-x-6 sm:space-x-8 md:space-x-10">
            { ['Twitter', 'LinkedIn', 'Github'].map(social => (
              <a key={social} href="#" className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-secondary-accent hover:text-white transition-colors duration-500 font-bold">
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
