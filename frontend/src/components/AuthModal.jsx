import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, CheckCircle2, User, GraduationCap, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleContinue = async () => {
    setError('');
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      nextStep();
    }, 600);
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6">
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
        className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        {/* Global Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 z-[110] text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left Side: Summary Card (Desktop only, Step 3) */}
        <AnimatePresence>
          {step === 3 && (
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="hidden md:flex w-72 xl:w-80 bg-white/[0.02] border-r border-white/5 p-6 xl:p-8 flex-col justify-end"
            >
              <div className="flex-1 flex flex-col justify-center">
                <div className="mb-8 sm:mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/60">Profile Completion</span>
                    <span className="text-[10px] sm:text-[11px] font-bold text-white">75%</span>
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

                <div className="space-y-4 sm:space-y-6">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/40 block">Member Benefits</span>
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
                      className="flex items-center gap-3 text-xs sm:text-[13px] text-white/70"
                    >
                      <CheckCircle2 size={14} className="text-white/40 flex-shrink-0" />
                      {benefit}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="pt-6 sm:pt-8 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 flex-shrink-0">
                    <User size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-[13px] font-medium text-white truncate">New Researcher</div>
                    <div className="text-[10px] sm:text-[11px] text-white/40">Joining June 2026</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Side / Main Side: Form */}
        <div className="flex-1 p-6 sm:p-8 md:p-10 lg:p-12 overflow-y-auto max-h-[70vh] md:max-h-none">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="initial" animate="enter" exit="exit">
                <h2 className="text-2xl sm:text-3xl font-serif font-medium text-white mb-2 sm:mb-3">Welcome to Techlytics</h2>
                <p className="text-sm sm:text-base text-white/50 mb-6 sm:mb-8 md:mb-10 font-light">Enter your email address to continue.</p>

                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/40 font-bold ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <input 
                        type="email" 
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError('');
                        }}
                        className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm sm:text-base text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all`}
                      />
                    </div>
                    {error && <p className="text-red-500 text-[10px] sm:text-[11px] ml-1 tracking-wide">{error}</p>}
                  </div>

                  <button onClick={handleContinue} className="btn-primary w-full py-3 sm:py-4 text-sm sm:text-[15px] flex items-center justify-center gap-2 group">
                    Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="relative py-3 sm:py-4 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center px-2"><div className="w-full border-t border-white/5"></div></div>
                    <span className="relative px-3 sm:px-4 bg-[#0a0a0a] text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/20 font-bold">OR</span>
                  </div>

                  <button 
                    onClick={handleGoogleLogin}
                    className="w-full bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 text-sm sm:text-[15px] font-semibold text-white transition-all flex items-center justify-center gap-3"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
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
                <h2 className="text-2xl sm:text-3xl font-serif font-medium text-white mb-2 sm:mb-3">Verify Your Email</h2>
                <p className="text-sm sm:text-base text-white/50 mb-6 sm:mb-8 md:mb-10 font-light">We've sent a 6-digit code to <span className="text-white break-all">{email || 'your email'}</span>.</p>

                <div className="space-y-6 sm:space-y-8 md:space-y-10">
                  <div className="flex justify-between gap-2 sm:gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <input 
                        key={i}
                        type="text"
                        maxLength="1"
                        className="w-full h-12 sm:h-14 md:h-16 lg:h-20 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-center text-lg sm:text-xl md:text-2xl font-medium text-white focus:outline-none focus:border-white/40 transition-all"
                      />
                    ))}
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <button onClick={nextStep} className="btn-primary w-full py-3 sm:py-4 text-sm sm:text-[15px]">Verify Code</button>
                    <div className="text-center">
                      <button className="text-xs sm:text-[13px] text-white/40 hover:text-white transition-colors">Resend Code <span className="text-white/20">(59s)</span></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={stepVariants} initial="initial" animate="enter" exit="exit">
                <h2 className="text-2xl sm:text-3xl font-serif font-medium text-white mb-2 sm:mb-3">Complete Your Profile</h2>
                <p className="text-sm sm:text-base text-white/50 mb-6 sm:mb-8 font-light">Help us personalize your analytics experience.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pb-4">
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/40 font-bold ml-1">Full Name</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/40 font-bold ml-1">Date of Birth</label>
                    <input type="date" className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/40 font-bold ml-1">Gender</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base text-white focus:outline-none focus:border-white/30">
                      <option className="bg-[#0a0a0a]">Male</option>
                      <option className="bg-[#0a0a0a]">Female</option>
                      <option className="bg-[#0a0a0a]">Prefer Not To Say</option>
                    </select>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/40 font-bold ml-1">University</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/40 font-bold ml-1">Degree Program</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/40 font-bold ml-1">Current Semester</label>
                    <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/40 font-bold ml-1">Country</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base text-white focus:outline-none focus:border-white/30" />
                  </div>
                   <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/40 font-bold ml-1">City</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="sm:col-span-2 space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/40 font-bold ml-1">Preferred Research Area</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base text-white focus:outline-none focus:border-white/30">
                      <option className="bg-[#0a0a0a]">Statistics</option>
                      <option className="bg-[#0a0a0a]">Data Science</option>
                      <option className="bg-[#0a0a0a]">Machine Learning</option>
                      <option className="bg-[#0a0a0a]">Software Engineering</option>
                      <option className="bg-[#0a0a0a]">Research Analytics</option>
                    </select>
                  </div>
                </div>

                <button onClick={nextStep} className="btn-primary w-full py-3 sm:py-4 text-sm sm:text-[15px] mt-6 sm:mt-8">Complete Setup</button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" variants={stepVariants} initial="initial" animate="enter" exit="exit" className="text-center py-6 sm:py-8 md:py-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 sm:mb-8 relative">
                   <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                   >
                     <CheckCircle2 size={36} className="text-white" />
                   </motion.div>
                   <div className="absolute inset-0 rounded-full border border-white/20 animate-ping" style={{ animationDuration: '3s' }} />
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-serif font-medium text-white mb-2 sm:mb-3">Welcome to Techlytics</h2>
                <p className="text-sm sm:text-base text-white/50 mb-8 sm:mb-10 md:mb-12 font-light">Your account is ready. Let's start your research journey.</p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-sm mx-auto">
                   <button onClick={() => { onClose(); navigate('/dashboard'); }} className="btn-primary flex-1 py-3 sm:py-4 text-xs sm:text-[13px] tracking-widest uppercase">Go To Dashboard</button>
                   <button onClick={() => { onClose(); navigate('/dashboard/analysis'); }} className="btn-secondary flex-1 py-3 sm:py-4 text-xs sm:text-[13px] tracking-widest uppercase">Start Analysis</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Summary Card (Mobile/Desktop, Step 3) */}
        <AnimatePresence>
          {step === 3 && (
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="w-full md:w-72 xl:w-80 bg-white/[0.02] border-t md:border-t-0 md:border-l border-white/5 p-6 xl:p-8 flex flex-col"
            >
              <div className="flex-1">
                <div className="mb-6 sm:mb-8 md:mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/60">Profile Completion</span>
                    <span className="text-[10px] sm:text-[11px] font-bold text-white">75%</span>
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

                <div className="space-y-4 sm:space-y-6">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/40 block">Member Benefits</span>
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
                      className="flex items-center gap-3 text-xs sm:text-[13px] text-white/70"
                    >
                      <CheckCircle2 size={14} className="text-white/40 flex-shrink-0" />
                      {benefit}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="pt-6 sm:pt-8 border-t border-white/5 mt-6 sm:mt-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 flex-shrink-0">
                    <User size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-[13px] font-medium text-white truncate">New Researcher</div>
                    <div className="text-[10px] sm:text-[11px] text-white/40">Joining June 2026</div>
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
