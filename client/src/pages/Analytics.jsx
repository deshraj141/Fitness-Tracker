import React, { useEffect, useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
    workoutService, 
    nutritionService, 
    goalService, 
    weightService,
    waterService
} from '../services/api';
import { Calendar, TrendingUp, Filter, ArrowDown, ArrowUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [data, setData] = useState({ 
    workouts: [], 
    nutrition: [], 
    goals: {}, 
    weightLogs: [], 
    waterLogs: [] 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [w, n, g, weight, water] = await Promise.all([
          workoutService.getAll(),
          nutritionService.getAll(),
          goalService.get(),
          weightService.getAll(),
          waterService.getAll()
        ]);
        setData({ 
            workouts: w.data, 
            nutrition: n.data, 
            goals: g.data,
            weightLogs: weight.data,
            waterLogs: water.data
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20 text-blue-400 font-bold animate-pulse text-2xl">crunching your data...</div>;

  // Process Weight Data
  const sortedWeight = [...data.weightLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
  const weightLabels = sortedWeight.map(l => new Date(l.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
  const weightValues = sortedWeight.map(l => l.weight);

  const weightChartData = {
    labels: weightLabels.length > 0 ? weightLabels : ['No Data'],
    datasets: [
      {
        label: 'Weight (kg)',
        data: weightValues.length > 0 ? weightValues : [0],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Goal',
        data: Array(weightLabels.length || 1).fill(data.goals.weight || 0),
        borderColor: '#10b981',
        borderDash: [5, 5],
        fill: false,
      }
    ]
  };

  // Process Energy Balance (last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toDateString();
  }).reverse();

  const consumedPerDay = last7Days.map(date => {
    return data.nutrition
        .filter(n => new Date(n.date).toDateString() === date)
        .reduce((sum, n) => sum + n.totalCalories, 0);
  });

  const burnedPerDay = last7Days.map(date => {
    return data.workouts
        .filter(w => new Date(w.date).toDateString() === date)
        .reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  });

  const energyBalanceData = {
    labels: last7Days.map(d => d.split(' ')[0]),
    datasets: [
      {
        label: 'Consumed',
        data: consumedPerDay,
        backgroundColor: '#10b981',
        borderRadius: 8,
      },
      {
        label: 'Burned',
        data: burnedPerDay,
        backgroundColor: '#3b82f6',
        borderRadius: 8,
      }
    ]
  };

  // Activity Distribution
  const typeCount = data.workouts.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {});

  const activityDistribution = {
    labels: Object.keys(typeCount).length > 0 ? Object.keys(typeCount) : ['No Workouts'],
    datasets: [{
      data: Object.values(typeCount).length > 0 ? Object.values(typeCount) : [1],
      backgroundColor: ['#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ec4899'],
      borderWidth: 0,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom', labels: { color: '#94a3b8', font: { weight: '600' }, padding: 20 } },
      tooltip: { backgroundColor: '#1e293b', titleColor: '#fff', bodyColor: '#fff', padding: 12, cornerRadius: 8 }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { weight: '500' } } },
      y: { grid: { color: '#334155', drawBorder: false }, ticks: { color: '#64748b' } }
    }
  };

  const weightChange = data.weightLogs.length >= 2 
    ? (data.weightLogs[0].weight - data.weightLogs[1].weight).toFixed(1)
    : 0;

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tight">Performance <span className="text-blue-500">Hub</span></h1>
          <p className="text-gray-400 mt-3 font-medium text-lg">Detailed analysis of your health journey and fitness milestones.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-2xl flex items-center gap-3">
             <Calendar className="text-blue-400" size={20} />
             <span className="font-bold text-gray-300">Last 7 Days</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Weight Trend */}
        <div className="p-10 bg-gray-800/40 border border-gray-700 rounded-[2.5rem] hover:bg-gray-800/60 transition-all">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-bold flex items-center gap-3"><TrendingUp className="text-blue-400" /> Weight Progress</h3>
            <div className={`flex items-center gap-2 font-black px-4 py-2 rounded-xl ${Number(weightChange) <= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {Number(weightChange) <= 0 ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
                {Math.abs(weightChange)} kg
            </div>
          </div>
          <div className="h-[350px]">
            <Line data={weightChartData} options={chartOptions} />
          </div>
        </div>

        {/* Energy Balance */}
        <div className="p-10 bg-gray-800/40 border border-gray-700 rounded-[2.5rem] hover:bg-gray-800/60 transition-all">
          <h3 className="text-2xl font-bold mb-10 flex items-center gap-3"><Calendar className="text-emerald-400" /> Energy Balance</h3>
          <div className="h-[350px]">
            <Bar data={energyBalanceData} options={chartOptions} />
          </div>
        </div>

        {/* Activity Distribution */}
        <div className="p-10 bg-gray-800/40 border border-gray-700 rounded-[2.5rem] hover:bg-gray-800/60 transition-all">
          <h3 className="text-2xl font-bold mb-10">Workout Intensity Mix</h3>
          <div className="h-[350px] relative">
            <Doughnut data={activityDistribution} options={{ ...chartOptions, scales: { x: { display: false }, y: { display: false } } }} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <div className="text-4xl font-black">{data.workouts.length}</div>
                    <div className="text-gray-500 font-bold text-xs uppercase tracking-widest">Sessions</div>
                </div>
            </div>
          </div>
        </div>

        {/* Summary Insights */}
        <div className="p-10 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-[2.5rem] flex flex-col justify-center text-center space-y-8">
          <div className="w-24 h-24 bg-blue-500/20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/20">
             <TrendingUp className="text-blue-400" size={48} />
          </div>
          <div className="space-y-3">
            <h3 className="text-4xl font-black">Doing Great!</h3>
            <p className="text-gray-400 text-xl font-medium leading-relaxed">
                You've consistently hit your calorie goals for the past 3 days. Your workout intensity is increasing steadily.
            </p>
          </div>
          <div className="pt-8 border-t border-blue-500/20 grid grid-cols-2 gap-8">
             <div className="p-6 bg-gray-900/40 rounded-3xl">
                <div className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Avg Duration</div>
                <div className="text-3xl font-black text-white">
                    {data.workouts.length > 0 
                        ? Math.round(data.workouts.reduce((a,c) => a + c.duration, 0) / data.workouts.length) 
                        : 0} min
                </div>
             </div>
             <div className="p-6 bg-gray-900/40 rounded-3xl">
                <div className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Burned</div>
                <div className="text-3xl font-black text-white">
                    {data.workouts.reduce((a,c) => a + (c.caloriesBurned || 0), 0)} <span className="text-sm font-bold text-gray-500">kcal</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
