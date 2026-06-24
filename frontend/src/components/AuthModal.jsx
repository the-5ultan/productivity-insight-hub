import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, CheckCircle2, User, GraduationCap, MapPin, Search, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError('');
      setSuccess('');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setOtp(Array(6).fill(''));
      setResendCooldown(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!isOpen) return null;

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    if (!name.trim()) { setError('Full name is required.'); return; }
    if (!email.trim()) { setError('Email address is required.'); return; }
    if (!validateEmail(email)) { setError('Please enter a valid email address.'); return; }
    if (!password) { setError('Password is required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setIsSubmitting(true);
    try {
      const res = await authAPI.register({ name, email, password });
      setSuccess(res.data.message || 'Registration successful! Check your email for the verification code.');
      setError('');
      setResendCooldown(60);
      setTimeout(() => setStep(2), 800);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      setSuccess('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpInput = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    otpRefs.current[nextIndex]?.focus();
  };

  const handleVerifyOtp = async () => {
    setError('');
    setSuccess('');
    const code = otp.join('');
    if (code.length !== 6) { setError('Please enter the complete 6-digit code.'); return; }

    setIsVerifying(true);
    try {
      const res = await authAPI.verifyOtp({ email, otpCode: code });
      if (res.data.success) {
        setSuccess('Email verified successfully!');
        try {
          const loginRes = await authAPI.login({ email, password });
          const { accessToken, refreshToken, user } = loginRes.data;
          login(user, accessToken);
          if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
          if (accessToken) localStorage.setItem('accessToken', accessToken);
        } catch {
          // Auto-login failed but email is verified
        }
        setError('');
        setTimeout(() => setStep(3), 600);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed. Please try again.';
      setError(msg);
      setOtp(Array(6).fill(''));
      otpRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;
    setError('');
    setSuccess('');
    setIsResending(true);
    try {
      const res = await authAPI.resendOtp({ email });
      setSuccess(res.data.message || 'A new code has been sent.');
      setResendCooldown(60);
      setOtp(Array(6).fill(''));
      otpRefs.current[0]?.focus();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend code. Please try again.';
      setError(msg);
    } finally {
      setIsResending(false);
    }
  };

  const handleProfileComplete = async () => {
    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
    }, 400);
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
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 z-[110] text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex-1 p-6 sm:p-8 md:p-10 lg:p-12 overflow-y-auto max-h-[70vh] md:max-h-none">
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs sm:text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="initial" animate="enter" exit="exit">
                <h2 className="text-2xl sm:text-3xl font-serif font-medium text-white mb-2 sm:mb-3">Create Your Account</h2>
                <p className="text-sm sm:text-base text-white/50 mb-6 sm:mb-8 md:mb-10 font-light">Fill in your details to get started.</p>

                <div className="space-y-4 sm:space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-white/40 font-bold ml-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(''); }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 text-sm sm:text-base text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-white/40 font-bold ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-12 pr-4 text-sm sm:text-base text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-white/40 font-bold ml-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 pr-12 text-sm sm:text-base text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-white/40 font-bold ml-1">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 text-sm sm:text-base text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>

                  <button
                    onClick={handleRegister}
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3 sm:py-4 text-sm sm:text-[15px] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={16} className="animate-spin" /> Creating Account...</>
                    ) : (
                      <>Create Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>

                  <div className="relative py-3 sm:py-4 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center px-2"><div className="w-full border-t border-white/5" /></div>
                    <span className="relative px-3 sm:px-4 bg-[#0a0a0a] text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-white/20 font-bold">OR</span>
                  </div>

                  <button
                    onClick={() => { window.location.href = `${API_BASE_URL}/api/auth/google`; }}
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

                  <p className="text-center text-xs sm:text-sm text-white/30">
                    Already have an account?{' '}
                    <span
                      onClick={() => { onClose(); document.querySelector('[data-login]')?.click(); }}
                      className="text-white/60 hover:text-white cursor-pointer transition-colors"
                    >Log in</span>
                  </p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="initial" animate="enter" exit="exit">
                <h2 className="text-2xl sm:text-3xl font-serif font-medium text-white mb-2 sm:mb-3">Verify Your Email</h2>
                <p className="text-sm sm:text-base text-white/50 mb-6 sm:mb-8 md:mb-10 font-light">
                  We've sent a 6-digit code to <span className="text-white break-all">{email}</span>.
                </p>

                <div className="space-y-6 sm:space-y-8 md:space-y-10">
                  <div className="flex justify-between gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpInput(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onFocus={(e) => e.target.select()}
                        className="w-full h-12 sm:h-14 md:h-16 lg:h-20 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-center text-lg sm:text-xl md:text-2xl font-medium text-white focus:outline-none focus:border-white/40 transition-all"
                      />
                    ))}
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <button
                      onClick={handleVerifyOtp}
                      disabled={isVerifying || otp.join('').length !== 6}
                      className="btn-primary w-full py-3 sm:py-4 text-sm sm:text-[15px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isVerifying ? (
                        <><Loader2 size={16} className="animate-spin" /> Verifying...</>
                      ) : (
                        'Verify Code'
                      )}
                    </button>

                    <div className="text-center">
                      {resendCooldown > 0 ? (
                        <span className="text-xs sm:text-[13px] text-white/30">
                          Resend code in{' '}
                          <span className="text-white/60 font-medium">{resendCooldown}s</span>
                        </span>
                      ) : (
                        <button
                          onClick={handleResendOtp}
                          disabled={isResending}
                          className="text-xs sm:text-[13px] text-white/40 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isResending ? (
                            <><Loader2 size={12} className="inline animate-spin mr-1" /> Sending...</>
                          ) : (
                            'Resend Code'
                          )}
                        </button>
                      )}
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
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-white/40 font-bold ml-1">Full Name</label>
                    <input type="text" defaultValue={name} className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-white/40 font-bold ml-1">Date of Birth</label>
                    <input type="date" className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-white/40 font-bold ml-1">Gender</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base text-white focus:outline-none focus:border-white/30">
                      <option className="bg-[#0a0a0a]">Male</option>
                      <option className="bg-[#0a0a0a]">Female</option>
                      <option className="bg-[#0a0a0a]">Prefer Not To Say</option>
                    </select>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-white/40 font-bold ml-1">University</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-white/40 font-bold ml-1">Degree Program</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-white/40 font-bold ml-1">Current Semester</label>
                    <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-white/40 font-bold ml-1">Country</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-white/40 font-bold ml-1">City</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base text-white focus:outline-none focus:border-white/30" />
                  </div>
                  <div className="sm:col-span-2 space-y-1 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-white/40 font-bold ml-1">Preferred Research Area</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3.5 px-3 sm:px-4 text-sm sm:text-base text-white focus:outline-none focus:border-white/30">
                      <option className="bg-[#0a0a0a]">Statistics</option>
                      <option className="bg-[#0a0a0a]">Data Science</option>
                      <option className="bg-[#0a0a0a]">Machine Learning</option>
                      <option className="bg-[#0a0a0a]">Software Engineering</option>
                      <option className="bg-[#0a0a0a]">Research Analytics</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleProfileComplete}
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3 sm:py-4 text-sm sm:text-[15px] mt-6 sm:mt-8 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Setting up...</>
                  ) : (
                    'Complete Setup'
                  )}
                </button>
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
                  <button
                    onClick={() => { onClose(); navigate('/dashboard'); }}
                    className="btn-primary flex-1 py-3 sm:py-4 text-xs sm:text-[13px] tracking-widest uppercase"
                  >
                    Go To Dashboard
                  </button>
                  <button
                    onClick={() => { onClose(); navigate('/dashboard/analysis'); }}
                    className="btn-secondary flex-1 py-3 sm:py-4 text-xs sm:text-[13px] tracking-widest uppercase"
                  >
                    Start Analysis
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
                  {["Save Analysis History", "Generate Reports", "Export Results", "Personalized Insights"].map((benefit, i) => (
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
