import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BlurText from '../components/BlurText';
import FadingVideo from '../components/FadingVideo';
import { BarChart3, Network, Brain } from 'lucide-react';

const LandingPage = () => {
  const videoSources = [
    'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-world-map-with-data-points-23214-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-connection-lines-in-dark-blue-background-23216-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-with-glowing-lines-and-dots-23215-large.mp4'
  ];

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
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      title: 'Correlation Analysis',
      tags: ['Heatmaps', 'Relationships', 'Patterns', 'Insights'],
      desc: 'Discover how screen time, social media usage, study time, and sleep duration influence productivity scores.',
      icon: <Network className="w-6 h-6" />
    },
    {
      title: 'Predictive Intelligence',
      tags: ['Probability', 'Prediction', 'AI Insights', 'Research'],
      desc: 'Generate productivity predictions and receive intelligent interpretations of statistical findings.',
      icon: <Brain className="w-6 h-6" />
    }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white/30 overflow-x-hidden">
      <FadingVideo sources={videoSources} />

      {/* Hero Section */}
      <section className="relative pt-52 pb-40 px-6 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-12"
          >
            <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/80">
              Future of Productivity Intelligence
            </span>
          </motion.div>

          <div className="mb-10 max-w-5xl mx-auto">
            <BlurText 
              text="Transform Digital Behavior Into Productivity Insights"
              className="text-6xl md:text-[7.5rem] font-serif font-medium tracking-tight leading-[1] text-white"
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-2xl text-white/70 max-w-3xl mx-auto mb-16 leading-relaxed font-light"
          >
            Analyze screen time, social media usage, study habits, sleep duration, and productivity patterns through <span className="text-white italic">advanced statistical analysis</span>, AI-powered interpretations, and predictive modeling.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link to="/register" className="btn-primary px-12 py-5 text-[15px] tracking-wide text-black bg-white rounded-full">
              Start Analysis
            </Link>
            <Link to="/dashboard/reports" className="btn-secondary px-12 py-5 text-[15px] tracking-wide text-white border border-white/20 rounded-full">
              View Research
            </Link>
          </motion.div>

          {/* Hero Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-44 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card flex flex-col items-center justify-center py-12 relative group bg-white/5 border border-white/10 rounded-[2.5rem]"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem]" />
              <div className="text-6xl md:text-7xl font-serif font-medium mb-3 text-white">87%</div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-white/50 font-bold">Prediction Accuracy</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card flex flex-col items-center justify-center py-12 relative group bg-white/5 border border-white/10 rounded-[2.5rem]"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem]" />
              <div className="text-6xl md:text-7xl font-serif font-medium mb-3 text-white">10K+</div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-white/50 font-bold">Analytics Generated</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="relative py-24 border-y border-white/5 bg-black/40 backdrop-blur-md px-6 z-10">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-16 md:gap-32 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
          {partners.map((partner) => (
            <span key={partner} className="text-xl md:text-2xl font-serif font-medium tracking-tight whitespace-nowrap text-white">
              {partner}
            </span>
          ))}
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="features" className="relative py-48 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 text-center">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[10px] font-bold tracking-[0.5em] uppercase text-white/40 mb-6 block"
            >
              Intelligence Platform
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-6xl md:text-8xl font-serif font-medium tracking-tight mb-8 text-white"
            >
              Analytics <br />
              <span className="italic font-light text-white/60">Reimagined</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto font-light"
            >
              Powerful statistical tools designed to uncover meaningful relationships between technology usage and productivity outcomes.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card group hover:translate-y-[-10px] transition-all duration-700 bg-white/5 border border-white/10 rounded-[2.5rem] p-10"
              >
                <div className="mb-12 p-4 w-fit rounded-2xl bg-white/5 border border-white/10 text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-700">
                  {cap.icon}
                </div>
                <div className="flex flex-wrap gap-2.5 mb-8">
                  {cap.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-white/40 group-hover:border-white/20 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-3xl mb-6 font-serif text-white">{cap.title}</h3>
                <p className="text-white/50 leading-relaxed text-lg font-light">
                  {cap.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-24 border-t border-white/5 px-6 z-10 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-3xl font-serif font-medium tracking-tight flex items-center gap-3">
             <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
            Techlytics
          </div>
          <div className="text-[11px] tracking-[0.4em] text-secondary-accent/40 uppercase font-bold text-center md:text-left">
            © 2026 Transform Digital Behavior Into Productivity Insights
          </div>
          <div className="flex space-x-10">
            { socialLinks.map(social => (
              <a key={social} href="#" className="text-[11px] uppercase tracking-[0.3em] text-secondary-accent hover:text-white transition-colors duration-500 font-bold">
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

const socialLinks = ['Twitter', 'LinkedIn', 'Github'];

export default LandingPage;
