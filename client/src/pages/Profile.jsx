import React, { useState, useEffect } from 'react';
import { User, Mail, Settings, Save, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/api';

const Profile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    height: '',
    age: '',
    gender: 'Prefer not to say'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await authService.getProfile();
      const user = res.data;
      setFormData({
        username: user.username || '',
        email: user.email || '',
        height: user.height || '',
        age: user.age || '',
        gender: user.gender || 'Prefer not to say'
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile', err);
      toast.error('Failed to load profile');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        age: formData.age ? Number(formData.age) : undefined,
        height: formData.height ? Number(formData.height) : undefined
      };
      const res = await authService.updateProfile(payload);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Profile updated!');
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile', err);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-blue-400">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header className="flex items-center justify-between">
        <div>
            <h1 className="text-4xl font-black mb-2">Your Profile</h1>
            <p className="text-gray-400 font-medium text-lg">Manage your account and physical information.</p>
        </div>
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center font-black text-3xl text-white shadow-xl shadow-blue-500/20">
            {formData.username.charAt(0).toUpperCase()}
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-3xl p-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <User size={16} className="text-blue-400" /> Username
                        </label>
                        <input 
                            type="text" 
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Mail size={16} className="text-blue-400" /> Email
                        </label>
                        <input 
                            type="email" 
                            value={formData.email}
                            disabled
                            className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-2xl opacity-50 cursor-not-allowed font-bold"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Age</label>
                        <input 
                            type="number" 
                            value={formData.age}
                            onChange={(e) => setFormData({...formData, age: e.target.value})}
                            className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Height (cm)</label>
                        <input 
                            type="number" 
                            value={formData.height}
                            onChange={(e) => setFormData({...formData, height: e.target.value})}
                            className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <User size={16} className="text-blue-400" /> Gender
                        </label>
                        <select 
                            value={formData.gender}
                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                            className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold appearance-none"
                        >
                            <option value="Prefer not to say">Prefer not to say</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                    <span className="text-emerald-400 font-bold">{message}</span>
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        {saving ? 'Saving...' : <><Save size={20} /> Save Changes</>}
                    </button>
                </div>
            </form>
        </div>

        <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-3xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <ShieldCheck className="text-emerald-400" /> Account Security
                </h3>
                <div className="space-y-4">
                    <button className="w-full py-3 bg-gray-900 border border-gray-700 hover:border-blue-500 rounded-xl font-bold text-sm transition-all text-gray-400 hover:text-white">
                        Change Password
                    </button>
                    <button className="w-full py-3 bg-gray-900 border border-gray-700 hover:border-blue-500 rounded-xl font-bold text-sm transition-all text-gray-400 hover:text-white">
                        Two-Factor Auth
                    </button>
                    <button className="w-full py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-all">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
