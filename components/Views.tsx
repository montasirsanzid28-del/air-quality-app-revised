'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, LayoutDashboard, CalendarDays, TrendingUp, Bell, Activity, 
  Wind, Search, Mic, Navigation, ChevronRight, AlertTriangle, Leaf,
  Cloud, CloudSun, Sun, CloudRain, Clock, History, Car, Factory, EyeOff, X
} from 'lucide-react';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getUS_AQI, getAQIString, getPollutantLevel, getAQIColor } from '@/lib/aqi';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';

function PollutantCard({ item, chartData, idx, onClick }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="[perspective:1200px] h-full relative" style={{ zIndex: 1 }}>
      <motion.div 
        layoutId={`card-${item.label}`}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.02, zIndex: 10, transition: { type: "spring", stiffness: 400, damping: 25 } }}
        whileTap={{ scale: 0.97, transition: { type: "spring", stiffness: 400, damping: 25 } }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * idx, duration: 0.4 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl flex flex-col gap-4 border border-white/60 cursor-[url('/cursor-pointer.png'),_pointer] h-full relative"
      >
        <motion.div layoutId={`header-${item.label}`} className="flex justify-between items-start pointer-events-none" style={{ transform: "translateZ(30px)" }}>
          <div>
            <motion.div layoutId={`title-${item.label}`} className="text-[12px] font-semibold text-slate-500 mb-1 tracking-widest font-space-grotesk">{item.label}</motion.div>
            <motion.div layoutId={`value-${item.label}`} className="text-2xl font-semibold text-slate-800">{Math.round(item.val)} <span className="text-sm font-normal text-slate-500">{item.unit}</span></motion.div>
          </div>
          <motion.span layoutId={`pill-${item.label}`} className="px-3 py-1 bg-blue-50 text-emerald-600 rounded-full text-xs font-semibold">{getPollutantLevel(item.label, item.val)}</motion.span>
        </motion.div>
        <motion.div layoutId={`chart-${item.label}`} className="h-16 w-full -ml-3 -mb-4 mt-2 pointer-events-none" style={{ transform: "translateZ(20px)" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`gradient-${item.label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill={`url(#gradient-${item.label})`} />
              </AreaChart>
            </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function TopNav({ locationName }: { locationName: string }) {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 hover:opacity-80 hover:scale-95 transition-all cursor-pointer p-2 rounded-xl">
          <MapPin className="text-emerald-500 w-6 h-6" />
          <h1 className="font-semibold text-lg text-slate-900 tracking-tight">{locationName}</h1>
        </div>
        <span className="text-[10px] text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-full font-bold tracking-widest uppercase border border-slate-300/30">Developed by Mont</span>
      </div>
    </header>
  );
}

export function SidebarNav({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  return (
    <nav className="hidden md:flex w-24 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-r border-slate-200/50 flex-col items-center py-8 gap-8 h-screen sticky top-0 shadow-[4px_0_24px_-10px_rgba(16,185,129,0.1)] shrink-0 z-50">
       <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
         <Leaf className="w-7 h-7" />
       </div>
       <div className="flex flex-col gap-6 w-full px-2">
          <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center justify-center p-3 transition-colors ${activeTab === 'dashboard' || activeTab === 'live' ? 'bg-emerald-50 text-emerald-600 rounded-2xl' : 'text-slate-400 hover:text-emerald-500'}`}>
            <LayoutDashboard className="mb-1 w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Dash</span>
          </button>
          <button onClick={() => setActiveTab('breathe')} className={`flex flex-col items-center justify-center p-3 transition-colors ${activeTab === 'breathe' ? 'bg-emerald-50 text-emerald-600 rounded-2xl' : 'text-slate-400 hover:text-emerald-500'}`}>
            <Wind className="mb-1 w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Breathe</span>
          </button>
          <button onClick={() => setActiveTab('trends')} className={`flex flex-col items-center justify-center p-3 transition-colors ${activeTab === 'trends' ? 'bg-emerald-50 text-emerald-600 rounded-2xl' : 'text-slate-400 hover:text-emerald-500'}`}>
            <TrendingUp className="mb-1 w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Trends</span>
          </button>
          <button onClick={() => setActiveTab('alerts')} className={`flex flex-col items-center justify-center p-3 transition-colors ${activeTab === 'alerts' ? 'bg-emerald-50 text-emerald-600 rounded-2xl' : 'text-slate-400 hover:text-emerald-500'}`}>
            <Bell className="mb-1 w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Alerts</span>
          </button>
       </div>
    </nav>
  );
}

export function BottomNav({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/70 backdrop-blur-2xl border-t border-white/20 shadow-[0_-10px_40px_-15px_rgba(16,185,129,0.1)] rounded-t-[32px]">
      <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center justify-center px-3 py-2 transition-colors ${activeTab === 'dashboard' || activeTab === 'live' ? 'bg-emerald-50 text-emerald-600 rounded-full scale-90' : 'text-slate-400 hover:text-emerald-500'}`}>
        <LayoutDashboard className="mb-1 w-5 h-5" />
        <span className="text-[10px] sm:text-[11px] font-medium">Home</span>
      </button>
      <button onClick={() => setActiveTab('breathe')} className={`flex flex-col items-center justify-center px-3 py-2 transition-colors ${activeTab === 'breathe' ? 'bg-emerald-50 text-emerald-600 rounded-full scale-90' : 'text-slate-400 hover:text-emerald-500'}`}>
        <Wind className="mb-1 w-5 h-5" />
        <span className="text-[10px] sm:text-[11px] font-medium">Breathe</span>
      </button>
      <button onClick={() => setActiveTab('forecast')} className={`flex flex-col items-center justify-center px-3 py-2 transition-colors ${activeTab === 'forecast' ? 'bg-emerald-50 text-emerald-600 rounded-full scale-90' : 'text-slate-400 hover:text-emerald-500'}`}>
        <CalendarDays className="mb-1 w-5 h-5" />
        <span className="text-[10px] sm:text-[11px] font-medium">Forecast</span>
      </button>
      <button onClick={() => setActiveTab('trends')} className={`flex flex-col items-center justify-center px-3 py-2 transition-colors ${activeTab === 'trends' ? 'bg-emerald-50 text-emerald-600 rounded-full scale-90' : 'text-slate-400 hover:text-emerald-500'}`}>
        <TrendingUp className="mb-1 w-5 h-5" />
        <span className="text-[10px] sm:text-[11px] font-medium">Trends</span>
      </button>
      <button onClick={() => setActiveTab('map')} className={`flex flex-col items-center justify-center px-3 py-2 transition-colors ${activeTab === 'map' ? 'bg-emerald-50 text-emerald-600 rounded-full scale-90' : 'text-slate-400 hover:text-emerald-500'}`}>
        <MapPin className="mb-1 w-5 h-5" />
        <span className="text-[10px] sm:text-[11px] font-medium">Map</span>
      </button>
      <button onClick={() => setActiveTab('alerts')} className={`hidden sm:flex flex-col items-center justify-center px-3 py-2 transition-colors ${activeTab === 'alerts' ? 'bg-emerald-50 text-emerald-600 rounded-full scale-90' : 'text-slate-400 hover:text-emerald-500'}`}>
        <Bell className="mb-1 w-5 h-5" />
        <span className="text-[11px] font-medium">Alerts</span>
      </button>
    </nav>
  );
}

export function LiveView({ data, historyData, className = "" }: { data: any; historyData: any; className?: string }) {
  const [displayAqi, setDisplayAqi] = useState(0);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const pm25 = data?.aqi?.list?.[0]?.components?.['pm2_5'] || 0;
  const pm10 = data?.aqi?.list?.[0]?.components?.['pm10'] || 0;
  const o3 = data?.aqi?.list?.[0]?.components?.['o3'] || 0;
  const no2 = data?.aqi?.list?.[0]?.components?.['no2'] || 0;
  
  const aqi = pm25 === 0 && pm10 === 0 ? 0 : getUS_AQI(pm25, pm10);
  const aqiLabel = getAQIString(aqi);

  useEffect(() => {
    if (!aqi) return;
    let startTime: number;
    let animationFrame: number;
    const duration = 1500;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayAqi(Math.round(ease * aqi));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [aqi]);

  if (!data?.aqi?.list?.[0]) return <div>Loading...</div>;

  const pollutantData = [
    { label: 'PM2.5', val: pm25, unit: 'µg/m³', desc: 'Fine inhalable particles, with diameters that are generally 2.5 micrometers and smaller.' },
    { label: 'PM10', val: pm10, unit: 'µg/m³', desc: 'Inhalable particles, with diameters that are generally 10 micrometers and smaller.' },
    { label: 'O3', val: o3, unit: 'ppb', desc: 'Ozone at ground level is a harmful air pollutant, because of its effects on people and the environment.' },
    { label: 'NO2', val: no2, unit: 'ppb', desc: 'Nitrogen dioxide is introduced into the air by natural and human causes, highly reactive gas.' },
  ];

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      <section className="flex flex-col items-center justify-center pt-8 pb-12">
        <div className="relative w-[280px] h-[280px] flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-2xl" viewBox="0 0 280 280">
            <circle cx="140" cy="140" r="130" stroke="#eff4ff" strokeWidth="20" fill="none" />
            <motion.circle 
              cx="140" cy="140" r="130" 
              stroke={aqi <= 50 ? "#10b981" : aqi <= 100 ? "#facc15" : aqi <= 150 ? "#f97316" : aqi <= 200 ? "#ef4444" : aqi <= 300 ? "#9333ea" : "#be123c"}
              strokeWidth="20" 
              fill="none" 
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 816" }}
              animate={{ strokeDasharray: `${Math.min((aqi / 300), 1) * 816} 816` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="w-[240px] h-[240px] bg-[#f8f9ff] rounded-full flex flex-col items-center justify-center shadow-[inset_0_4px_20px_rgba(0,0,0,0.03)] relative z-10">
            <span className="text-[12px] font-semibold text-slate-500 uppercase mb-2 tracking-widest font-space-grotesk">AQI</span>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`text-[72px] font-bold ${getAQIColor(aqi)} leading-none tracking-tighter`}
            >
              {displayAqi}
            </motion.h1>
            <span className="text-2xl font-semibold text-slate-800 mt-1">{aqiLabel}</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        {pollutantData.map((item, idx) => {
          const rawProp = item.label.toLowerCase().replace('.', '_');
          let chartData: any[] = [];
          if (historyData?.history?.list) {
            chartData = historyData.history.list.slice(-24).map((hItem: any, i: number) => ({
              time: i,
              val: hItem.components?.[rawProp] || 0
            }));
          } else {
            chartData = [40, 60, 30, 80, 50].map((val, i) => ({ time: i, val }));
          }

          return (
            <PollutantCard 
              key={item.label}
              item={item}
              idx={idx}
              chartData={chartData}
              onClick={() => setSelectedItem({ ...item, chartData })}
            />
          );
        })}
      </section>

      <section className="bg-emerald-500 text-white rounded-2xl p-6 shadow-[0_8px_30px_-5px_rgba(16,185,129,0.3)] flex items-center gap-4 mt-4">
        <Activity className="w-10 h-10 flex-shrink-0" />
        <div>
          <h3 className="text-xl font-semibold">Air is crisp—great time for a run</h3>
          <p className="opacity-90 mt-1">Conditions are optimal for outdoor activities in your area.</p>
        </div>
      </section>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/20 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          >
             <motion.div 
               layoutId={`card-${selectedItem.label}`}
               className="bg-white/90 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl w-full max-w-2xl overflow-hidden cursor-default border border-white"
               onClick={(e) => e.stopPropagation()}
             >
                <motion.div layoutId={`header-${selectedItem.label}`} className="flex justify-between items-start mb-6">
                  <div>
                    <motion.div layoutId={`title-${selectedItem.label}`} className="text-sm font-semibold text-emerald-600 mb-2 tracking-widest font-space-grotesk">{selectedItem.label} Details</motion.div>
                    <motion.div layoutId={`value-${selectedItem.label}`} className="text-5xl font-bold text-slate-800">{Math.round(selectedItem.val)} <span className="text-2xl font-normal text-slate-500">{selectedItem.unit}</span></motion.div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <motion.span layoutId={`pill-${selectedItem.label}`} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold shadow-sm border border-emerald-100">{getPollutantLevel(selectedItem.label, selectedItem.val)}</motion.span>
                    <button onClick={() => setSelectedItem(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                      <X className="w-6 h-6 text-slate-600" />
                    </button>
                  </div>
                </motion.div>

                <p className="text-slate-600 text-lg leading-relaxed mb-10">{selectedItem.desc}</p>
                
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Past 24 Hours</h4>
                <motion.div layoutId={`chart-${selectedItem.label}`} className="h-64 w-full -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={selectedItem.chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                       <defs>
                         <linearGradient id={`gradient-expanded-${selectedItem.label}`} x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <RechartsTooltip 
                         contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                         labelFormatter={() => null}
                         formatter={(value: any) => [`${Math.round(value)} ${selectedItem.unit}`, selectedItem.label]}
                       />
                       <Area 
                         type="monotone" 
                         dataKey="val" 
                         stroke="#10b981" 
                         strokeWidth={3} 
                         fillOpacity={1} 
                         fill={`url(#gradient-expanded-${selectedItem.label})`} 
                       />
                     </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ForecastView({ data, className = "pb-32 pt-8" }: { data: any, className?: string }) {
  if (!data?.forecast) return <div>Loading...</div>;

  const todayForecasts = data.forecast.list.slice(0, 5);
  
  const dailyMap = new Map();
  if (data.forecast?.list) {
    data.forecast.list.forEach((f: any) => {
      const d = new Date(f.dt * 1000);
      const dayStr = format(d, 'EEE');
      if (!dailyMap.has(dayStr)) {
        dailyMap.set(dayStr, { name: dayStr, high: -Infinity, low: Infinity, weather: f.weather[0].description });
      }
      const curr = dailyMap.get(dayStr);
      curr.high = Math.max(curr.high, f.main.temp_max);
      curr.low = Math.min(curr.low, f.main.temp_min);
    });
  }
  const dailySummary = Array.from(dailyMap.values()).slice(0, 5);
  if (dailySummary.length > 0) dailySummary[0].name = 'Today';
  
  const forecastAqiList = data.forecastAqi?.list || [];
  
  const getWeatherIcon = (weather: string) => {
    if (weather.includes('rain')) return <CloudRain className="w-6 h-6 text-emerald-600" />;
    if (weather.includes('cloud')) return <Cloud className="w-6 h-6 text-emerald-600" />;
    if (weather.includes('partly')) return <CloudSun className="w-6 h-6 text-emerald-600" />;
    return <Sun className="w-6 h-6 text-orange-400" />;
  };

  return (
    <div className={`flex flex-col gap-12 ${className}`}>
      <section>
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[12px] text-emerald-700 tracking-widest font-semibold uppercase font-space-grotesk">Activity Recommendation</span>
                <h2 className="text-2xl font-semibold text-slate-900 mt-1">Best Day for Outdoor Activities</h2>
              </div>
              <div className="bg-emerald-500 text-white p-2 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <div className="flex-1 bg-blue-50/50 rounded-2xl p-4">
                <p className="text-slate-600">{dailySummary[0] ? `Looking good for ${dailySummary[0].name}` : 'Great day'}</p>
                <div className="flex items-end gap-2 mt-2">
                  <span className="text-3xl font-bold text-slate-900">{dailySummary[0] ? `${Math.round(dailySummary[0].high)}°` : ''}</span>
                  <span className="text-emerald-600 mb-1 capitalize ml-2">{dailySummary[0] ? dailySummary[0].weather : ''}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-semibold text-slate-900 mb-4">Today&apos;s Forecast</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
          {todayForecasts.map((f: any, i: number) => (
             <div key={i} className="bg-white rounded-2xl p-3 min-w-[80px] flex flex-col items-center gap-2 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] border border-blue-50/50">
               <span className="text-slate-500 text-sm">{i === 0 ? 'Now' : format(new Date(f.dt * 1000), 'h a')}</span>
               {getWeatherIcon(f.weather[0].description)}
               <span className="text-lg font-semibold text-slate-900">{Math.round(f.main.temp)}°</span>
               <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold w-full text-center">{Math.round((f.main.temp % 30) + 10)}</div>
             </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-semibold text-slate-900 mb-4">7-Day Outlook</h3>
        <div className="flex flex-col gap-2">
          {dailySummary.map((dayLine: any, i: number) => {
            const aqiTarget = forecastAqiList[i * 8] || forecastAqiList[0];
            let avgStr = '50';
            if (aqiTarget) {
               avgStr = getUS_AQI(aqiTarget.components?.pm2_5 || 0, aqiTarget.components?.pm10 || 0).toString();
            }
            return (
            <div key={i} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-[0_2px_8px_-4px_rgba(0,0,0,0.04)]">
              <div className="w-1/3">
                <span className="text-lg text-slate-900 font-medium">{dayLine.name}</span>
              </div>
              <div className="flex items-center gap-2 w-1/4 justify-center">
                {getWeatherIcon(dayLine.weather)}
                <span className="text-slate-500 whitespace-nowrap">{Math.round(dayLine.high)}° / {Math.round(dayLine.low)}°</span>
              </div>
              <div className="w-1/3 flex justify-end items-center gap-2">
                <span className="text-sm text-slate-400">Avg AQI</span>
                <div className="bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-xs font-semibold">{avgStr}</div>
              </div>
            </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export function TrendsView({ historyData, className = "pb-32 pt-8" }: { historyData: any, className?: string }) {
  if (!historyData?.history?.list) return <div>Loading...</div>;

  // Process historical data for chart
  const dataMap = new Map();
  historyData.history.list.forEach((item: any) => {
    const d = new Date(item.dt * 1000);
    const dayStr = format(d, 'EEE');
    if (!dataMap.has(dayStr)) {
      dataMap.set(dayStr, { name: dayStr, pm25: 0, pm10: 0, count: 0 });
    }
    const curr = dataMap.get(dayStr);
    curr.pm25 += item.components?.['pm2_5'] || 0;
    curr.pm10 += item.components?.['pm10'] || 0;
    curr.count += 1;
  });

  const chartData = Array.from(dataMap.values()).map((d: any) => ({
    name: d.name,
    pm25: Math.round(d.pm25 / d.count),
    pm10: Math.round(d.pm10 / d.count),
  }));

  const peaks: any[] = [];
  if (historyData?.history?.list) {
    const list = historyData.history.list;
    for (let i = 1; i < list.length; i++) {
       const prev = list[i-1];
       const curr = list[i];
       const prevAqi = getUS_AQI(prev.components.pm2_5, prev.components.pm10);
       const currAqi = getUS_AQI(curr.components.pm2_5, curr.components.pm10);
       if (currAqi > prevAqi + 20 && currAqi > 50) {
          const isPm25 = curr.components.pm2_5 > curr.components.pm10;
          peaks.push({
            icon: isPm25 ? Car : Factory,
            bg: isPm25 ? 'bg-red-100' : 'bg-orange-100',
            text: isPm25 ? 'text-red-700' : 'text-orange-700',
            title: isPm25 ? 'Traffic/Smoke Spike' : 'Industrial/Coarse Dust',
            time: format(new Date(curr.dt * 1000), 'EEE, h:mm a'),
            desc: `Sudden increase in particulate matter detected in the recorded observations.`,
            alert: `AQI ${currAqi}`,
            itemType: isPm25 ? 'PM2.5' : 'PM10',
            alertColor: isPm25 ? 'text-red-600 bg-red-50' : 'text-orange-600 bg-orange-50'
          });
       }
    }
  }
  peaks.reverse();
  const recentPeaks = peaks.slice(0, 3);

  return (
    <div className={`flex flex-col gap-12 ${className}`}>
      <section>
        <div className="flex flex-col mb-8 gap-4">
          <h2 className="text-[32px] leading-[40px] font-semibold text-slate-900 tracking-tight">Environmental Trends</h2>
          <p className="text-slate-600 max-w-md">Track particulate matter fluctuations and identify patterns in your local air quality.</p>
        </div>
        
        <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_-10px_rgba(0,108,73,0.08)] flex flex-col gap-8 relative overflow-hidden">
          <div className="flex flex-wrap gap-2 relative z-10">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(0,108,73,0.5)]"></span>
              PM2.5 (Fine)
            </div>
            <div className="flex items-center gap-2 bg-orange-50 text-orange-800 px-4 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(133,83,0,0.5)]"></span>
              PM10 (Coarse)
            </div>
          </div>

          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPm25" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPm10" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(11,28,48,0.1)' }} />
                <Area type="monotone" dataKey="pm10" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#colorPm10)" />
                <Area type="monotone" dataKey="pm25" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorPm25)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-8">
          <History className="text-emerald-600 w-8 h-8" />
          <h3 className="text-2xl font-semibold text-slate-900">Pollution Peaks</h3>
        </div>

        <div className="flex flex-col gap-4">
          {recentPeaks.length > 0 ? recentPeaks.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 flex gap-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
              <div className={`${item.bg} ${item.text} p-4 rounded-full flex-shrink-0 h-14 w-14 flex items-center justify-center`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                  <h4 className="text-[20px] font-semibold text-slate-900">{item.title}</h4>
                  <span className="text-[12px] px-3 py-1 bg-slate-50 text-slate-500 rounded-full font-semibold">{item.time}</span>
                </div>
                <p className="text-slate-600 text-[16px] leading-relaxed">{item.desc}</p>
                <div className="mt-4 flex gap-2">
                  <span className={`${item.alertColor} px-3 py-1.5 rounded-md text-[11px] font-bold tracking-widest uppercase`}>{item.alert}</span>
                  <span className="bg-blue-50 text-slate-600 px-3 py-1.5 rounded-md text-[11px] font-bold tracking-widest uppercase">Primary: {item.itemType}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-2 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] text-center">
              <Leaf className="w-10 h-10 text-emerald-500 mb-2"/>
              <h4 className="text-[20px] font-semibold text-slate-900">No Recent Pollution Peaks</h4>
              <p className="text-slate-600">Air quality has been relatively stable over the last week.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import MapWrapper from './MapWrapper';

export function MapView({ 
  onLocationSelect, 
  coords,
  className = "pb-32 h-[calc(100vh-140px)]"
}: { 
  onLocationSelect: (lat: number, lon: number, name: string) => void;
  coords: { lat: number, lon: number };
  className?: string;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = async () => {
    if (!query) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (Array.isArray(data)) setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <div className="relative pt-6 z-10 font-sans">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search for cities or countries..." 
            className="w-full bg-white px-6 py-4 rounded-2xl pl-12 shadow-[0_4px_20px_-2px_rgba(11,28,48,0.05)] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800 placeholder-slate-400 font-medium transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-500 transition-colors" />
          {isSearching ? (
             <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin absolute right-4 top-1/2 -translate-y-1/2"></div>
          ) : (
            <button onClick={search} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-emerald-600 font-semibold px-3 py-1 rounded-lg hover:bg-emerald-50 transition-colors">Find</button>
          )}
        </div>
        
        {results.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(11,28,48,0.1)] border border-slate-100 overflow-hidden z-20">
            {results.map((r, i) => (
              <button 
                key={i} 
                onClick={() => {
                  onLocationSelect(r.lat, r.lon, r.name);
                  setResults([]);
                  setQuery('');
                }}
                className="w-full px-6 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between group border-b border-slate-50 last:border-0"
              >
                <div>
                  <div className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">{r.name}</div>
                  <div className="text-sm text-slate-500">{r.state || ''} {r.country}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 relative rounded-2xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(11,28,48,0.05)] border border-slate-200" style={{ zIndex: 0 }}>
        <MapWrapper 
          center={coords} 
          onLocationSelect={(lat, lon) => {
            onLocationSelect(lat, lon, 'Selected Location');
          }}
        />
        
        {/* Helper text overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow border border-slate-200 pointer-events-none">
          <span className="text-xs font-semibold text-slate-700 tracking-wider uppercase font-space-grotesk whitespace-nowrap">Tap map to select location</span>
        </div>
      </div>
    </div>
  );
}

export function AlertsView({ onLocationSelect, data, className = "pb-32 pt-8" }: { onLocationSelect: (lat: number, lon: number, name: string) => void; data: any; className?: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const search = async () => {
    if (!query) return;
    const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (Array.isArray(data)) setResults(data);
  };

  return (
    <div className={`flex flex-col gap-12 ${className}`}>
      <section className="flex flex-col gap-8">
        <div className="relative w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            className="w-full bg-white h-14 pl-14 pr-14 rounded-full border-none shadow-[0_4px_20px_-2px_rgba(11,28,48,0.05)] text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none" 
            placeholder="Search cities, zip codes..." 
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
          />
          <button onClick={search} className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90">
            <Mic className="w-5 h-5" />
          </button>
        </div>

        {results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col gap-2">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-2 px-2">Results</h3>
            {results.map((r: any, i) => (
              <button key={i} onClick={() => { setResults([]); onLocationSelect(r.lat, r.lon, r.name); }} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl text-left transition-colors">
                <MapPin className="text-slate-400 w-5 h-5" />
                <div>
                  <div className="font-semibold text-slate-900">{r.name}</div>
                  <div className="text-sm text-slate-500">{r.state || ''} {r.country}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        <button onClick={() => onLocationSelect(0, 0, 'Current Location')} className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-[0_4px_20px_-2px_rgba(11,28,48,0.05)] text-left hover:bg-slate-50 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
            <Navigation className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">Use Current Location</h3>
            <p className="text-slate-500">Detecting automatically</p>
          </div>
        </button>
      </section>

      <section className="flex flex-col gap-4">
         <h2 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-2 font-space-grotesk">Active Alerts</h2>
         {data?.aqi?.list?.[0] ? (() => {
            const pm25 = data.aqi.list[0].components?.['pm2_5'] || 0;
            const pm10 = data.aqi.list[0].components?.['pm10'] || 0;
            const aqi = getUS_AQI(pm25, pm10);
            
            let alertInfo = {
              title: "No Active Alerts",
              desc: "Air quality is excellent. Enjoy your outdoor activities safely.",
              bg: "bg-emerald-50",
              border: "border-emerald-100",
              text: "text-emerald-900",
              subText: "text-emerald-700",
              iconColor: "text-emerald-600",
              icon: Leaf,
              tagLabel: "Good",
              tagStyles: "bg-emerald-100 text-emerald-800"
            };

            if (aqi > 50 && aqi <= 100) {
              alertInfo = {
                title: "Moderate Air Quality",
                desc: "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",
                bg: "bg-yellow-50",
                border: "border-yellow-200",
                text: "text-yellow-900",
                subText: "text-yellow-700",
                iconColor: "text-yellow-600",
                icon: AlertTriangle,
                tagLabel: "Moderate",
                tagStyles: "bg-yellow-200 text-yellow-800"
              };
            } else if (aqi > 100 && aqi <= 150) {
              alertInfo = {
                title: "Unhealthy for Sensitive Groups",
                desc: "Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
                bg: "bg-orange-50",
                border: "border-orange-200",
                text: "text-orange-900",
                subText: "text-orange-700",
                iconColor: "text-orange-600",
                icon: AlertTriangle,
                tagLabel: "Unhealthy (SG)",
                tagStyles: "bg-orange-500 text-white"
              };
            } else if (aqi > 150 && aqi <= 200) {
              alertInfo = {
                title: "Unhealthy Air Quality",
                desc: "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.",
                bg: "bg-red-50",
                border: "border-red-200",
                text: "text-red-900",
                subText: "text-red-700",
                iconColor: "text-red-600",
                icon: AlertTriangle,
                tagLabel: "Unhealthy",
                tagStyles: "bg-red-500 text-white"
              };
            } else if (aqi > 200 && aqi <= 300) {
              alertInfo = {
                title: "Very Unhealthy",
                desc: "Health alert: The risk of health effects is increased for everyone. Avoid prolonged outdoor exertion.",
                bg: "bg-purple-50",
                border: "border-purple-200",
                text: "text-purple-900",
                subText: "text-purple-700",
                iconColor: "text-purple-600",
                icon: AlertTriangle,
                tagLabel: "Very Unhealthy",
                tagStyles: "bg-purple-600 text-white"
              };
            } else if (aqi > 300) {
              alertInfo = {
                title: "Hazardous Air Quality",
                desc: "Health warning of emergency conditions: everyone is more likely to be affected. Remain indoors and keep windows closed.",
                bg: "bg-slate-900",
                border: "border-slate-800",
                text: "text-slate-100",
                subText: "text-slate-300",
                iconColor: "text-rose-500",
                icon: AlertTriangle,
                tagLabel: "Hazardous",
                tagStyles: "bg-black text-rose-500"
              };
            }

            const Icon = alertInfo.icon;
            
            return (
              <div className={`rounded-2xl p-6 flex flex-col gap-4 border shadow-sm ${alertInfo.bg} ${alertInfo.border}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full bg-white/40 ${alertInfo.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${alertInfo.text}`}>{alertInfo.title}</h3>
                      <p className={`font-semibold text-sm opacity-80 ${alertInfo.text}`}>{data?.weather?.name || 'Current Location'}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold tracking-widest px-3 py-1 rounded-full uppercase whitespace-nowrap ${alertInfo.tagStyles}`}>
                    {alertInfo.tagLabel}
                  </span>
                </div>
                <p className={`${alertInfo.subText} mt-2`}>{alertInfo.desc}</p>
                <div className={`mt-2 pt-4 border-t border-black/5 flex items-center justify-between`}>
                    <div className={`flex items-center gap-2 ${alertInfo.iconColor}`}>
                      <Wind className="w-5 h-5" />
                      <span className="text-lg font-bold">{aqi} AQI</span>
                    </div>
                </div>
              </div>
            );
         })() : <div>Loading...</div>}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center pl-2 pr-2">
          <h2 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest font-space-grotesk">Recently Searched</h2>
        </div>
        <div className="flex flex-col gap-2">
          {data?.weather?.name ? (
             <button onClick={() => onLocationSelect(0,0,'Current Location')} className="bg-white p-5 rounded-2xl shadow-[0_4px_20px_-2px_rgba(11,28,48,0.05)] flex justify-between items-center hover:bg-slate-50 transition-colors w-full text-left group">
               <div>
                 <h3 className="text-lg font-semibold text-slate-900">{data.weather.name}</h3>
                 <p className="text-slate-500 capitalize">{data.weather.weather?.[0]?.description}, {Math.round(data.weather.main?.temp)}°F</p>
               </div>
               <div className="flex items-center gap-6">
                 <div className="text-right hidden sm:block">
                   {data.aqi?.list?.[0] && (() => {
                      const pm25 = data.aqi.list[0].components?.['pm2_5'] || 0;
                      const pm10 = data.aqi.list[0].components?.['pm10'] || 0;
                      const aqi = getUS_AQI(pm25, pm10);
                      const cColor = getAQIColor(aqi).replace('text-', 'text-');
                      return (
                        <>
                         <div className={`text-lg font-bold ${cColor}`}>{aqi} AQI</div>
                         <div className={`text-[11px] font-bold tracking-widest uppercase ${cColor}`}>{getAQIString(aqi)}</div>
                        </>
                      );
                   })()}
                 </div>
                 <ChevronRight className="text-slate-400 group-hover:text-slate-900 transition-colors w-6 h-6" />
               </div>
             </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export function BreathingView({ data, className = "pb-32 pt-8" }: { data: any, className?: string }) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');

  // AQI integration
  const pm25 = data?.aqi?.list?.[0]?.components?.['pm2_5'] || 0;
  const pm10 = data?.aqi?.list?.[0]?.components?.['pm10'] || 0;
  const aqi = getUS_AQI(pm25, pm10);
  
  const isGoodAir = aqi <= 50;
  const isModerateAir = aqi > 50 && aqi <= 100;

  useEffect(() => {
    if (!isActive) return;

    let mounted = true;
    let inhaleTimeout: NodeJS.Timeout;
    let holdTimeout: NodeJS.Timeout;
    let exhaleTimeout: NodeJS.Timeout;
    
    // Box breathing: 4 inhale, 2 hold, 4 exhale, 2 hold
    const runCycle = () => {
      if (!mounted) return;
      setPhase('inhale');
      inhaleTimeout = setTimeout(() => {
        if (!mounted) return;
        setPhase('hold');
        holdTimeout = setTimeout(() => {
          if (!mounted) return;
          setPhase('exhale');
          exhaleTimeout = setTimeout(() => {
            if (!mounted) return;
            setPhase('hold');
            setTimeout(runCycle, 2000);
          }, 4000);
        }, 2000); // 2s hold
      }, 4000); // 4s inhale
    };

    runCycle();

    return () => {
      mounted = false;
      clearTimeout(inhaleTimeout);
      clearTimeout(holdTimeout);
      clearTimeout(exhaleTimeout);
    };
  }, [isActive]);

  const getInstruction = () => {
    switch (phase) {
      case 'idle': return 'Ready?';
      case 'inhale': return 'Breathe in...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe out...';
    }
  };

  const getScale = () => {
    switch (phase) {
      case 'idle': return 1;
      case 'inhale': return 1.8;
      case 'hold': return 1.8;
      case 'exhale': return 1;
    }
  };

  const getMessage = () => {
    if (isGoodAir) return "The air quality is excellent right now. Feel free to open a window and take some refreshing deep breaths.";
    if (isModerateAir) return "Air quality is acceptable. Let's do a relaxing breathing exercise to lower stress.";
    return "Air quality is poor. Here is a safe, indoor breathing exercise to stay centered and clear your mind.";
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[60vh] gap-12 ${className}`}>
      
      <div className="text-center max-w-lg mx-auto px-6">
        <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Mindful Breathing</h2>
        <p className="text-slate-600 text-lg leading-relaxed font-medium">{getMessage()}</p>
      </div>

      <div className="relative w-80 h-80 flex items-center justify-center my-8">
        <motion.div
          animate={{ scale: getScale() }}
          transition={{ duration: phase === 'hold' ? 2 : 4, ease: "easeInOut" }}
          className="absolute inset-0 bg-emerald-300 rounded-full opacity-30 blur-2xl flex-shrink-0"
        />
        <motion.div
          animate={{ scale: getScale() }}
          transition={{ duration: phase === 'hold' ? 2 : 4, ease: "easeInOut" }}
          className="absolute inset-8 bg-emerald-400 rounded-full opacity-40 backdrop-blur-md flex-shrink-0 mix-blend-overlay"
        />
        <motion.div
          animate={{ scale: getScale() }}
          transition={{ duration: phase === 'hold' ? 2 : 4, ease: "easeInOut" }}
          className="relative z-10 w-36 h-36 bg-white/70 backdrop-blur-xl shadow-2xl flex items-center justify-center rounded-3xl rotate-45 border border-white/80"
        >
           <div className="-rotate-45 text-center flex flex-col items-center justify-center">
             <span className="text-emerald-700 font-bold text-xl tracking-wide block drop-shadow-sm">{getInstruction()}</span>
           </div>
        </motion.div>
      </div>

      <button
        onClick={() => {
          setIsActive(!isActive);
          if (isActive) setPhase('idle');
        }}
        className={`px-10 py-5 rounded-full font-bold shadow-xl transition-all duration-300 transform active:scale-95 z-20 ${
          isActive 
            ? 'bg-slate-100/80 backdrop-blur-md text-slate-700 hover:bg-white border border-white/50 shadow-slate-200/50' 
            : 'bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-emerald-600/30 ring-4 ring-emerald-600/20'
        }`}
      >
        {isActive ? 'Stop Exercise' : 'Start Breathing'}
      </button>

    </div>
  );
}
