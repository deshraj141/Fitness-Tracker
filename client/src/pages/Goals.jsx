import React, { useState, useEffect } from 'react';
import { goalService } from '../services/api';
import { Target, Weight, Zap, Flame, Trophy, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Goals = () => {
  const [goals, setGoals] = useState({ weight: 0, steps: 10000, calories: 2000 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await goalService.get();
      setGoals(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching goals', err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setGoals({ ...goals, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        weight: goals.weight ? Number(goals.weight) : undefined,
        steps: goals.steps ? Number(goals.steps) : undefined,
        calories: goals.calories ? Number(goals.calories) : undefined
      };
      await goalService.update(payload);
      toast.success('Goals updated successfully!');
      setMessage('Goals updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      toast.error('Failed to update goals');
      console.error('Error updating goals', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-blue-400">Loading your targets...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header>
        <h1 className="text-4xl font-black mb-2">Set Your Targets</h1>
        <p className="text-gray-400 font-medium text-lg">Define your path to success. We'll help you stay on track.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <GoalInfoCard 
          icon={Weight} 
          label="Target Weight" 
          value={`${goals.weight} kg`} 
          color="blue" 
          description="Your ultimate body weight goal."
        />
        <GoalInfoCard 
          icon={Zap} 
          label="Daily Steps" 
          value={`${goals.steps}`} 
          color="emerald" 
          description="Stay active every single day."
        />
        <GoalInfoCard 
          icon={Flame} 
          label="Calorie Burn" 
          value={`${goals.calories} kcal`} 
          color="orange" 
          description="Target daily energy expenditure."
        />
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-3xl p-10 space-y-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-3">
             <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Target size={16} className="text-blue-400" /> Weight Goal (kg)
             </label>
             <input 
                type="number" 
                name="weight"
                value={goals.weight}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-lg"
             />
          </div>
          <div className="space-y-3">
             <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Zap size={16} className="text-emerald-400" /> Daily Steps
             </label>
             <input 
                type="number" 
                name="steps"
                value={goals.steps}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-2xl focus:border-emerald-500 outline-none transition-all font-bold text-lg"
             />
          </div>
          <div className="space-y-3">
             <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Flame size={16} className="text-orange-400" /> Daily Calories
             </label>
             <input 
                type="number" 
                name="calories"
                value={goals.calories}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-2xl focus:border-orange-500 outline-none transition-all font-bold text-lg"
             />
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
           <div className="flex items-center gap-2 text-emerald-400 font-bold transition-all">
              {message && <><CheckCircle2 size={20} /> {message} </>}
           </div>
           <button 
                type="submit" 
                disabled={saving}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-2xl font-black text-lg transition-all flex items-center gap-2"
           >
             {saving ? 'Updating...' : <><Trophy size={20} /> Update Goals</>}
           </button>
        </div>
      </form>

      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 bg-blue-500/20 rounded-2xl">
             <Trophy size={40} className="text-blue-400" />
          </div>
          <div className="text-center md:text-left flex-1">
             <h3 className="text-xl font-bold mb-1">Stay Consistent!</h3>
             <p className="text-gray-400 font-medium">Changing goals is part of the journey. Keep pushing forward and document every small victory.</p>
          </div>
      </div>
    </div>
  );
};

const GoalInfoCard = ({ icon: Icon, label, value, color, description }) => {
  const colors = {
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
    orange: 'text-orange-400'
  };
  
  return (
    <div className="bg-gray-800/40 border border-gray-700 p-8 rounded-3xl hover:bg-gray-800/60 transition-all">
      <Icon className={`${colors[color] || colors.blue} mb-6`} size={32} />
      <h4 className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-1">{label}</h4>
      <div className="text-3xl font-black mb-3">{value}</div>
      <p className="text-gray-500 text-sm font-medium leading-relaxed">{description}</p>
    </div>
  );
};

export default Goals;
