import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Zap, BarChart3, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-20 py-10">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Elevate Your Fitness Journey
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Track workouts, monitor nutrition, and visualize your progress with our premium, all-in-one fitness ecosystem.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full font-bold transition-all transform hover:scale-105">
            Get Started Free
          </Link>
          <Link to="/login" className="px-8 py-4 border border-gray-700 hover:border-gray-500 rounded-full font-bold transition-all">
            Login
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
        {[
          { icon: Activity, title: 'Workout Logs', desc: 'Detailed tracking for any activity from running to lifting.' },
          { icon: Zap, title: 'Fast Nutrition', desc: 'Log meals in seconds with our intuitive search interface.' },
          { icon: BarChart3, title: 'Visual Analytics', desc: 'Real-time charts to visualize your growth and consistency.' },
          { icon: ShieldCheck, title: 'Goal Setting', desc: 'Stay motivated with personalized goals and milestones.' }
        ].map((feature, i) => (
          <div key={i} className="p-8 bg-gray-800/50 border border-gray-700 rounded-3xl hover:border-blue-500/50 transition-colors group">
            <feature.icon className="w-12 h-12 text-blue-400 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default LandingPage;
