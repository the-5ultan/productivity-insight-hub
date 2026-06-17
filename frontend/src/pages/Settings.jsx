import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    secondaryEmail: '',
    avatar_url: '',
    university: '',
    degreeProgram: '',
    country: '',
    city: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      if (response.data.success) {
        const data = response.data.data;
        setProfile({
          name: data.User.name,
          secondaryEmail: data.secondaryEmail || '',
          avatar_url: data.User.avatar_url || '',
          university: data.university || '',
          degreeProgram: data.degreeProgram || '',
          country: data.country || '',
          city: data.city || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const response = await api.put('/user/profile', profile);
      if (response.data.success) {
        setSuccess(true);
        // Update local storage user data
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          name: profile.name,
          avatar_url: profile.avatar_url
        }));
        // Reload to update navbar
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-serif font-medium text-white mb-2">Account Settings</h1>
        <p className="text-white/50 font-light">Manage your profile and research preferences.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Picture Section */}
        <section className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-white/30 transition-all">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20">
                    <User size={48} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <label className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Profile Picture URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="text" 
                  value={profile.avatar_url}
                  onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
                />
              </div>
              <p className="text-[11px] text-white/30 italic ml-1">Paste a URL for your profile image.</p>
            </div>
          </div>
        </section>

        {/* Basic Information */}
        <section className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 md:p-10">
          <h3 className="text-xl font-serif text-white mb-8 flex items-center gap-3">
            <User size={20} className="text-white/40" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Full Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-white/30 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Secondary Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="email" 
                  value={profile.secondaryEmail}
                  onChange={(e) => setProfile({ ...profile, secondaryEmail: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">University</label>
              <input 
                type="text" 
                value={profile.university}
                onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-white/30 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Degree Program</label>
              <input 
                type="text" 
                value={profile.degreeProgram}
                onChange={(e) => setProfile({ ...profile, degreeProgram: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-white/30 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Country</label>
              <input 
                type="text" 
                value={profile.country}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-white/30 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">City</label>
              <input 
                type="text" 
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-white/30 transition-all"
              />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-green-400 text-sm font-medium"
              >
                <CheckCircle2 size={18} />
                Profile saved successfully
              </motion.div>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={saving}
            className="btn-primary py-4 px-12 flex items-center justify-center gap-3 disabled:opacity-50 min-w-[200px]"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
