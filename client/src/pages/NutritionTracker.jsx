import React, { useState, useEffect } from 'react';
import { nutritionService } from '../services/api';
import { Plus, Utensils, Zap, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const NutritionTracker = () => {
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    mealType: 'Breakfast',
    foodItems: [{ name: '', calories: '', protein: '', carbs: '', fats: '' }],
    totalCalories: 0
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await nutritionService.getAll();
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch nutrition logs', err);
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      foodItems: [...formData.foodItems, { name: '', calories: '', protein: '', carbs: '', fats: '' }]
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.foodItems];
    newItems[index][field] = value;
    
    // Auto-calculate total calories
    const total = newItems.reduce((acc, curr) => acc + (Number(curr.calories) || 0), 0);
    
    setFormData({ ...formData, foodItems: newItems, totalCalories: total });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        foodItems: formData.foodItems.map(item => ({
          name: item.name,
          calories: item.calories ? Number(item.calories) : 0,
          protein: item.protein ? Number(item.protein) : 0,
          carbs: item.carbs ? Number(item.carbs) : 0,
          fats: item.fats ? Number(item.fats) : 0,
        }))
      };
      await nutritionService.create(payload);
      toast.success('Meal logged successfully!');
      setShowForm(false);
      setFormData({ mealType: 'Breakfast', foodItems: [{ name: '', calories: '', protein: '', carbs: '', fats: '' }], totalCalories: 0 });
      fetchLogs();
    } catch (err) {
      toast.error('Failed to log nutrition');
      console.error('Failed to log nutrition', err);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black">Nutrition Tracker</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/20"
        >
          {showForm ? 'Cancel' : <><Plus size={20} /> Log Meal</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-3xl p-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 space-y-2 w-full">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Meal Type</label>
              <select 
                className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-xl focus:border-emerald-500 outline-none transition-colors appearance-none"
                value={formData.mealType}
                onChange={(e) => setFormData({...formData, mealType: e.target.value})}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
            <div className="flex-[2] space-y-2 w-full">
               <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-emerald-400">Total Calculation</span>
                  <span className="text-2xl font-black">{formData.totalCalories} kcal</span>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2"><Search size={18} className="text-emerald-400" /> Food Items</h3>
            {formData.foodItems.map((item, index) => (
              <div key={index} className="grid grid-cols-2 lg:grid-cols-6 gap-4 p-5 bg-gray-900/50 border border-gray-700/50 rounded-2xl items-end relative group">
                <div className="col-span-2 space-y-2">
                  <input 
                    placeholder="Food Name"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <input 
                    type="number" placeholder="Kcal"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                    value={item.calories}
                    onChange={(e) => handleItemChange(index, 'calories', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <input 
                    type="number" placeholder="P (g)"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                    value={item.protein}
                    onChange={(e) => handleItemChange(index, 'protein', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <input 
                    type="number" placeholder="C (g)"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                    value={item.carbs}
                    onChange={(e) => handleItemChange(index, 'carbs', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <input 
                    type="number" placeholder="F (g)"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                    value={item.fats}
                    onChange={(e) => handleItemChange(index, 'fats', e.target.value)}
                  />
                </div>
                {index > 0 && (
                   <button 
                    type="button"
                    onClick={() => {
                        const newItems = formData.foodItems.filter((_, i) => i !== index);
                        setFormData({...formData, foodItems: newItems});
                    }}
                    className="absolute -right-3 -top-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     <Trash2 size={14} />
                   </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              onClick={handleAddItem}
              className="w-full py-3 border-2 border-dashed border-gray-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-2xl text-gray-500 hover:text-emerald-400 font-bold transition-all"
            >
              + Add Another Item
            </button>
          </div>

          <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold text-lg transition-all">
            Save Nutrition Log
          </button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {logs.map((log, i) => (
          <div key={i} className="p-8 bg-gray-800/50 border border-gray-700 rounded-3xl hover:border-emerald-500/50 transition-all flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                            <Utensils className="text-emerald-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{log.mealType}</h3>
                            <span className="text-gray-400 text-sm font-medium">{new Date(log.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="text-2xl font-black text-white">{log.totalCalories} <span className="text-sm font-medium text-gray-400">kcal</span></div>
                </div>
                <div className="space-y-3 mb-8">
                    {log.foodItems.map((food, fi) => (
                        <div key={fi} className="flex justify-between text-gray-400 font-medium border-b border-gray-700/50 pb-2">
                           <span>{food.name}</span>
                           <span>{food.calories} kcal</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex-1 p-3 bg-gray-900/50 rounded-xl text-center">
                    <div className="text-xs font-bold text-gray-500 uppercase">Pro</div>
                    <div className="font-bold text-blue-400">{log.foodItems.reduce((a,c) => a+(c.protein||0), 0)}g</div>
                </div>
                <div className="flex-1 p-3 bg-gray-900/50 rounded-xl text-center">
                    <div className="text-xs font-bold text-gray-500 uppercase">Carb</div>
                    <div className="font-bold text-emerald-400">{log.foodItems.reduce((a,c) => a+(c.carbs||0), 0)}g</div>
                </div>
                <div className="flex-1 p-3 bg-gray-900/50 rounded-xl text-center">
                    <div className="text-xs font-bold text-gray-500 uppercase">Fat</div>
                    <div className="font-bold text-purple-400">{log.foodItems.reduce((a,c) => a+(c.fats||0), 0)}g</div>
                </div>
            </div>
          </div>
        ))}
        {logs.length === 0 && !showForm && (
          <div className="col-span-full text-center py-24 border-2 border-dashed border-gray-800 rounded-3xl">
            <p className="text-gray-500 text-lg font-medium">Your nutrition history is empty. Time for a healthy snack?</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionTracker;
