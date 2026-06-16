import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, CheckCircle2, User, GraduationCap, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.3 } }
  };

  const stepVariants = {
    initial: { x: 20, opacity: 0 },
    enter: { x: 0, opacity: 1, transition: { duration: 0.4 } },
    exit: { x: -20, opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
      />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        {/* Global Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 z-[110] text-white/40 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Left Side: Summary Card (Visible only in Step 3 on Desktop) */}
        <AnimatePresence>
          {step === 3 && (
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="hidden md:flex w-80 bg-white/[0.02] border-r border-white/5 p-8 flex-col justify-end"
            >
              <div className="flex-1 flex flex-col justify-center">
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">Profile Completion</span>
                    <span className="text-[11px] font-bold text-white">75%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-white" 
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white/40 block">Member Benefits</span>
                  {[
                    "Save Analysis History",
                    "Generate Reports",
                    "Export Results",
                    "Personalized Insights"
                  ].map((benefit, i) => (
                    <motion.div 
                      key={benefit} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                      className="flex items-center gap-3 text-[13px] text-white/70"
                    >
                      <CheckCircle2 size={16} className="text-white/40" />
                      {benefit}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-white">New Researcher</div>
                    <div className="text-[11px] text-white/40">Joining June 2026</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Side / Main Side: Form */}
        <div className="flex-1 p-8 md:p-12">

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="initial" animate="enter" exit="exit">
                <h2 className="text-3xl font-serif font-medium text-white mb-3">Welcome to Techlytics</h2>
                <p className="text-white/50 mb-10 font-light">Enter your email address to continue.</p>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input 
                        type="email" 
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
                      />
                    </div>
                  </div>

                  <button onClick={nextStep} className="btn-primary w-full py-4 text-[15px] flex items-center justify-center gap-2 group">
                    Continue <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="relative py-4 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center px-2"><div className="w-full border-t border-white/5"></div></div>
                    <span className="relative px-4 bg-[#0a0a0a] text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold">OR</span>
                  </div>

                  <button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl py-4 text-[15px] font-semibold text-white transition-all flex items-center justify-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.85 0-5.27-1.92-6.13-4.51H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.87 14.13c-.22-.67-.35-1.39-.35-2.13s.13-1.46.35-2.13V7.03H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.97l3.69-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.03l3.69 2.84c.86-2.59 3.28-4.49 6.13-4.49z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="initial" animate="enter" exit="exit">
                <h2 className="text-3xl font-serif font-medium text-white mb-3">Verify Your Email</h2>
                <p className="text-white/50 mb-10 font-light">We've sent a 6-digit code to <span className="text-white">{email || 'your email'}</span>.</p>

                <div className="space-y-10">
                  <div className="flex justify-between gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <input 
                        key={i}
                        type="text"
                        maxLength="1"
                        className="w-full h-16 md:h-20 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-medium text-white focus:outline-none focus:border-white/40 transition-all"
                      />
                    ))}
                  </div>

                  <div className="space-y-6">
                    <button onClick={nextStep} className="btn-primary w-full py-4 text-[15px]">Verify Code</button>
                    <div className="text-center">
                      <button className="text-[13px] text-white/40 hover:text-white transition-colors">Resend Code <span className="text-white/20">(59s)</span></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={stepVariants} initial="initial" animate="enter" exit="exit" className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <h2 className="text-3xl font-serif font-medium text-white mb-3">Complete Your Profile</h2>
                <p className="text-white/50 mb-8 font-light">Help us personalize your analytics experience.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Full Name</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Date of Birth</label>
                    <input type="date" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Gender</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-white/30">
                      <option className="bg-[#0a0a0a]">Male</option>
                      <option className="bg-[#0a0a0a]">Female</option>
                      <option className="bg-[#0a0a0a]">Prefer Not To Say</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">University</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Degree Program</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Current Semester</label>
                    <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Country</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-white/30" />
                  </div>
                   <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">City</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Preferred Research Area</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-white/30">
                      <option className="bg-[#0a0a0a]">Statistics</option>
                      <option className="bg-[#0a0a0a]">Data Science</option>
                      <option className="bg-[#0a0a0a]">Machine Learning</option>
                      <option className="bg-[#0a0a0a]">Software Engineering</option>
                      <option className="bg-[#0a0a0a]">Research Analytics</option>
                    </select>
                  </div>
                </div>

                <button onClick={nextStep} className="btn-primary w-full py-4 text-[15px] mt-8">Complete Setup</button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" variants={stepVariants} initial="initial" animate="enter" exit="exit" className="text-center py-10">
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 relative">
                   <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                   >
                     <CheckCircle2 size={48} className="text-white" />
                   </motion.div>
                   <div className="absolute inset-0 rounded-full border border-white/20 animate-ping" style={{ animationDuration: '3s' }} />
                </div>
                
                <h2 className="text-4xl font-serif font-medium text-white mb-3">Welcome to Techlytics</h2>
                <p className="text-white/50 mb-12 font-light">Your account is ready. Let's start your research journey.</p>

                <div className="flex flex-col sm:flex-row gap-4 max-w-sm mx-auto">
                   <button onClick={() => { onClose(); navigate('/dashboard'); }} className="btn-primary flex-1 py-4 text-[13px] tracking-widest uppercase">Go To Dashboard</button>
                   <button onClick={() => { onClose(); navigate('/dashboard/analysis'); }} className="btn-secondary flex-1 py-4 text-[13px] tracking-widest uppercase">Start Analysis</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Summary Card (Visible only in Step 3) */}
        <AnimatePresence>
          {step === 3 && (
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="w-full md:w-80 bg-white/[0.02] border-l border-white/5 p-8 flex flex-col"
            >
              <div className="flex-1">
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">Profile Completion</span>
                    <span className="text-[11px] font-bold text-white">75%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-white" 
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white/40 block">Member Benefits</span>
                  {[
                    "Save Analysis History",
                    "Generate Reports",
                    "Export Results",
                    "Personalized Insights"
                  ].map((benefit, i) => (
                    <motion.div 
                      key={benefit} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                      className="flex items-center gap-3 text-[13px] text-white/70"
                    >
                      <CheckCircle2 size={16} className="text-white/40" />
                      {benefit}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-white">New Researcher</div>
                    <div className="text-[11px] text-white/40">Joining June 2026</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthModal;
