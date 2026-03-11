import React, { useEffect, useState } from 'react';
import { 
  workoutService, 
  nutritionService, 
  goalService, 
  waterService, 
  weightService 
} from '../services/api';
import { 
  BarChart as BarChartIcon, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  ArrowUpRight, 
  Calendar,
  Droplet,
  Plus,
  Scale
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [data, setData] = useState({
    workouts: [],
    nutrition: [],
    goals: { calories: 2000, steps: 10000, weight: 0 },
    water: [],
    weightLogs: []
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [workouts, nutrition, goals, water, weight] = await Promise.all([
        workoutService.getAll(),
        nutritionService.getAll(),
        goalService.get(),
        waterService.getAll(),
        weightService.getAll()
      ]);

      setData({
        workouts: workouts.data,
        nutrition: nutrition.data,
        goals: goals.data,
        water: water.data,
        weightLogs: weight.data
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
      setLoading(false);
    }
  };

  const handleAddWater = async () => {
    try {
      await waterService.create({ amount: 250 });
      toast.success('Added 250ml water!');
      fetchDashboardData();
    } catch (err) {
       toast.error('Failed to add water');
       console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-blue-400 text-xl font-bold">Initializing Dashboard...</div>;

  const todayNutrition = data.nutrition.filter(n => new Date(n.date).toDateString() === new Date().toDateString());
  const todayCalories = todayNutrition.reduce((acc, curr) => acc + curr.totalCalories, 0);
  const todayWater = data.water
    .filter(w => new Date(w.date).toDateString() === new Date().toDateString())
    .reduce((acc, curr) => acc + curr.amount, 0);

  const currentWeight = data.weightLogs.length > 0 ? data.weightLogs[0].weight : 'No data';

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black">Welcome, {user?.username}! 👋</h1>
          <p className="text-gray-400 mt-2 font-medium">Keep moving forward. Consistency is key.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-5 py-3 bg-gray-800 border border-gray-700 rounded-2xl flex items-center gap-3">
            <Calendar className="text-blue-400" size={20} />
            <span className="font-bold">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
          </div>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Dumbbell} 
          label="Total Workouts" 
          value={data.workouts.length} 
          trend="Lifetime" 
          color="blue"
        />
        <StatCard 
          icon={Utensils} 
          label="Today's Calories" 
          value={`${todayCalories} kcal`} 
          trend={`Goal: ${data.goals.calories}`} 
          color="emerald"
        />
        <StatCard 
          icon={Droplet} 
          label="Water Intake" 
          value={`${todayWater} ml`} 
          trend="Target: 2500ml" 
          color="cyan"
          action={handleAddWater}
        />
        <StatCard 
          icon={Scale} 
          label="Current Weight" 
          value={currentWeight !== 'No data' ? `${currentWeight} kg` : currentWeight} 
          trend={data.goals.weight ? `Goal: ${data.goals.weight} kg` : 'Set a goal'} 
          color="purple"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700 rounded-3xl p-8 overflow-hidden h-fit">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <BarChartIcon className="text-blue-400" /> Recent Activity
            </h3>
            <button className="text-blue-400 hover:text-blue-300 font-bold transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {data.workouts.slice(0, 5).map((w, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-gray-900/50 border border-gray-700/50 rounded-2xl hover:border-gray-500 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Dumbbell className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{w.type}</h4>
                    <span className="text-gray-400 text-sm font-medium">{new Date(w.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-white text-lg">{w.duration} min</div>
                  <div className="text-gray-400 text-sm font-bold uppercase tracking-wider">{w.intensity}</div>
                </div>
              </div>
            ))}
            {data.workouts.length === 0 && <p className="text-gray-500 text-center py-10 font-medium">No workouts logged yet. Time to move!</p>}
          </div>
        </div>

        {/* Nutritional Summary */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-8 h-fit space-y-8">
          <div>
            <h3 className="text-2xl font-bold mb-6">Today's Nutrition</h3>
            <div className="p-6 bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border border-blue-500/30 rounded-2xl text-center">
                <span className="text-gray-400 font-medium text-sm block mb-1">Calorie Budget</span>
                <span className="text-4xl font-black text-white">{todayCalories}</span>
                <span className="text-gray-400 font-bold ml-1">/ {data.goals.calories} kcal</span>
                <div className="mt-4 h-2 bg-gray-900 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min((todayCalories / data.goals.calories) * 100, 100)}%` }}
                    ></div>
                </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
             <h4 className="font-bold text-gray-300 mb-4 flex items-center gap-2">
                <Droplet className="text-cyan-400" size={18} /> Water Tracker
             </h4>
             <div className="flex items-center justify-between">
                <div>
                    <span className="text-2xl font-black">{todayWater}</span>
                    <span className="text-gray-500 font-bold ml-1">/ 2500 ml</span>
                </div>
                <button 
                    onClick={handleAddWater}
                    className="p-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                >
                    <Plus size={20} />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, color, action }) => {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    cyan: 'bg-cyan-500/10 text-cyan-400',
    purple: 'bg-purple-500/10 text-purple-400',
    orange: 'bg-orange-500/10 text-orange-400'
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-3xl group transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color] || colors.blue}`}>
              <Icon size={28} />
          </div>
          {action && (
              <button onClick={action} className="p-2 bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus size={16} />
              </button>
          )}
      </div>
      <span className="text-gray-400 font-medium text-sm block mb-1">{label}</span>
      <div className="text-3xl font-black mb-2">{value}</div>
      <div className={`text-gray-500 text-sm font-bold flex items-center gap-1`}>
        <TrendingUp size={14} /> {trend}
      </div>
    </div>
  );
};

export default Dashboard;
