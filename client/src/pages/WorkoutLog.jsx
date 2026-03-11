import React, { useState, useEffect } from 'react';
import { workoutService } from '../services/api';
import { Plus, Dumbbell, Clock, Flame, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const WorkoutLog = () => {
  const [workouts, setWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    duration: '',
    caloriesBurned: '',
    intensity: 'Moderate'
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await workoutService.getAll();
      setWorkouts(res.data);
    } catch (err) {
      console.error('Failed to fetch workouts', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        duration: Number(formData.duration),
        caloriesBurned: formData.caloriesBurned ? Number(formData.caloriesBurned) : undefined
      };
      await workoutService.create(payload);
      toast.success('Workout logged successfully!');
      setShowForm(false);
      setFormData({ type: '', duration: '', caloriesBurned: '', intensity: 'Moderate' });
      fetchWorkouts();
    } catch (err) {
      toast.error('Failed to log workout');
      console.error('Failed to log workout', err);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black">Workout Log</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20"
        >
          {showForm ? 'Cancel' : <><Plus size={20} /> Log Activity</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-3xl p-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Activity Type</label>
              <input 
                type="text" 
                placeholder="e.g., Running, Weightlifting"
                className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-xl focus:border-blue-500 outline-none transition-colors"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Intensity</label>
              <select 
                className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-xl focus:border-blue-500 outline-none transition-colors appearance-none"
                value={formData.intensity}
                onChange={(e) => setFormData({...formData, intensity: e.target.value})}
              >
                <option value="Light">Light</option>
                <option value="Moderate">Moderate</option>
                <option value="Heavy">Heavy</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Duration (min)</label>
              <input 
                type="number" 
                className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-xl focus:border-blue-500 outline-none transition-colors"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Calories Burned</label>
              <input 
                type="number" 
                className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-xl focus:border-blue-500 outline-none transition-colors"
                value={formData.caloriesBurned}
                onChange={(e) => setFormData({...formData, caloriesBurned: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg transition-all">
            Save Workout
          </button>
        </form>
      )}

      <div className="space-y-4">
        {workouts.map((w, i) => (
          <div key={i} className="flex items-center justify-between p-6 bg-gray-800/50 border border-gray-700 rounded-3xl hover:border-gray-500 transition-all group">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <Dumbbell className="text-blue-400" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold">{w.type}</h3>
                <div className="flex items-center gap-4 text-gray-400 font-medium mt-1">
                  <span className="flex items-center gap-1"><Clock size={16} /> {w.duration} min</span>
                  <span className="flex items-center gap-1"><Flame size={16} /> {w.caloriesBurned || 0} kcal</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                w.intensity === 'Heavy' ? 'bg-red-500/10 text-red-400' : 
                w.intensity === 'Moderate' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                {w.intensity}
              </span>
              <ChevronRight className="text-gray-600 group-hover:text-blue-400 transition-colors" />
            </div>
          </div>
        ))}
        {workouts.length === 0 && !showForm && (
          <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-3xl">
            <p className="text-gray-500 text-lg font-medium">No workouts recorded yet. Start your journey today!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutLog;
