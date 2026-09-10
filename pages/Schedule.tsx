import React, { useState } from 'react';
import { SCHEDULE, SYMPOSIUM_DATES_DISPLAY, SYMPOSIUM_DATES_SHORT } from '../constants';
import { MapPin, Calendar, Sparkles, Cpu, Layers } from 'lucide-react';

const Schedule: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');

  const filteredSchedule = selectedDay === 'all' 
    ? SCHEDULE 
    : SCHEDULE.filter(item => item.day === selectedDay);

  return (
    <div className="py-24 bg-[#0A0A0A] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono font-bold uppercase tracking-widest mb-4">
            <Calendar size={14} />
            <span>2-Day National Level Symposium • {SYMPOSIUM_DATES_DISPLAY}</span>
          </div>
          <h2 className="text-gold font-cinzel text-sm tracking-[0.3em] uppercase mb-2">Chronological Itinerary</h2>
          <h3 className="text-4xl sm:text-5xl font-cinzel font-bold mb-4 uppercase tracking-widest text-white">Event Timeline</h3>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"></div>
          
          {/* Day Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border ${
                selectedDay === 'all'
                  ? 'bg-gold text-black border-gold shadow-lg shadow-gold/20'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-gold/40 hover:text-white'
              }`}
            >
              All Days Roadmap
            </button>
            <button
              onClick={() => setSelectedDay(1)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border flex items-center gap-2 ${
                selectedDay === 1
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              <Cpu size={14} />
              <span>Day 1 (28/09): Solar 2.0 Workshop & Project Display</span>
            </button>
            <button
              onClick={() => setSelectedDay(2)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border flex items-center gap-2 ${
                selectedDay === 2
                  ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <Layers size={14} />
              <span>Day 2 (29/09): 4 Tech & 4 Non-Tech Events</span>
            </button>
          </div>
        </div>

        {/* Day Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          <div className={`p-6 rounded-3xl border transition-all ${
            selectedDay === 1 || selectedDay === 'all' ? 'bg-emerald-950/20 border-emerald-500/30' : 'opacity-40 bg-white/5 border-white/5'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                Day 1 • 28/09/2026
              </span>
              <span className="text-gray-400 text-xs font-mono">Monday</span>
            </div>
            <h4 className="text-lg font-cinzel font-bold text-white mb-1">Solar 2.0 Workshop & Project Display</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Exclusively dedicated to innovative prototype demonstrations in Project Display and next-gen solar energy technology mastery in the Solar 2.0 Technical Workshop.
            </p>
          </div>

          <div className={`p-6 rounded-3xl border transition-all ${
            selectedDay === 2 || selectedDay === 'all' ? 'bg-amber-950/20 border-amber-500/30' : 'opacity-40 bg-white/5 border-white/5'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                Day 2 • 29/09/2026
              </span>
              <span className="text-gray-400 text-xs font-mono">Tuesday</span>
            </div>
            <h4 className="text-lg font-cinzel font-bold text-white mb-1">4 Technical & 4 Non-Technical Battles</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Full-scale competitive showdown featuring PaperXpose, Tech Spark, QuizTech 360°, Fault X, Short Film, Mystery Box, Quicktalk, and Prompt Writing Skills.
            </p>
          </div>
        </div>

        {/* Timeline Items */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2"></div>

          <div className="space-y-10">
            {filteredSchedule.map((item, index) => {
              const isDay1 = item.day === 1;
              const isDay2 = item.day === 2;

              return (
                <div key={index} className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Dot */}
                  <div className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 z-10 border-4 border-[#0A0A0A] ${
                    isDay1 ? 'bg-emerald-400 glow-emerald' : 'bg-gold glow-gold'
                  }`}></div>
                  
                  {/* Time */}
                  <div className="w-full pl-12 md:pl-0 md:w-1/2 flex justify-start md:justify-center">
                    <div className={`text-xl md:text-2xl font-cinzel font-bold ${
                      isDay1 ? 'text-emerald-400' : 'text-gold glow-text-gold'
                    } ${index % 2 === 0 ? 'md:pl-12 text-left' : 'md:pr-12 text-right'}`}>
                      {item.time}
                      <span className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 font-normal mt-0.5">
                        {item.dayTitle}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full pl-12 md:pl-0 md:w-1/2">
                    <div className={`bg-[#111] p-6 rounded-2xl border transition-all ${
                      isDay1 ? 'border-emerald-500/20 hover:border-emerald-400/50' : 'border-white/5 hover:border-gold/30'
                    } ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                          item.type === 'Workshop' 
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : item.type === 'Project Expo'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.type === 'Technical'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : item.type === 'Non-Technical'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-white/10 text-gray-300'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500">
                          {isDay1 ? 'Day 1 • 28/09' : 'Day 2 • 29/09'}
                        </span>
                      </div>
                      <h4 className="text-lg font-cinzel font-bold text-white mb-3">{item.activity}</h4>
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <MapPin size={13} className={isDay1 ? 'text-emerald-400' : 'text-gold'} />
                        <span>{item.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Schedule;
