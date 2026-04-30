'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TopNav, BottomNav, SidebarNav, LiveView, ForecastView, TrendsView, AlertsView, MapView, BreathingView } from '@/components/Views';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any>(null);
  const [locationName, setLocationName] = useState('Detecting...');
  
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);
  const [showPrompt, setShowPrompt] = useState(true);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          setShowPrompt(false);
        },
        (error) => {
          console.error("Error getting location", error);
          setCoords({ lat: 37.7749, lon: -122.4194 });
          setShowPrompt(false);
        }
      );
    } else {
      setCoords({ lat: 37.7749, lon: -122.4194 });
      setShowPrompt(false);
    }
  };

  const skipLocation = () => {
    setCoords({ lat: 37.7749, lon: -122.4194 });
    setShowPrompt(false);
  };

  useEffect(() => {
    if (!coords) return;
    async function fetchData() {
      try {
        const res = await fetch(`/api/air-quality?lat=${coords!.lat}&lon=${coords!.lon}`);
        const json = await res.json();
        setData(json);
        if (json.weather?.name) {
          setLocationName(json.weather.name);
        } else {
          setLocationName("Current Location");
        }
      } catch (e) {
        console.error("Failed to fetch data", e);
      }
    }
    fetchData();
  }, [coords]);

  useEffect(() => {
    if (!coords) return;
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/air-quality?lat=${coords!.lat}&lon=${coords!.lon}&action=history`);
        const json = await res.json();
        setHistoryData(json);
      } catch (e) {
        console.error("Failed to fetch history data", e);
      }
    }
    fetchHistory();
  }, [coords]);

  const handleLocationSelect = (lat: number, lon: number, name: string) => {
    if (lat === 0 && lon === 0) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
          setLocationName('Detecting...');
        });
      }
    } else {
      setCoords({ lat, lon });
      setLocationName(name);
    }
    setActiveTab('dashboard');
  };

  if (showPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 fixed inset-0 z-50">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-[0_10px_40px_-10px_rgba(11,28,48,0.1)] border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 z-10 relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 relative z-10">Location Access</h1>
          <p className="text-slate-500 mb-8 relative z-10 text-[15px] leading-relaxed">We need your location to show accurate, real-time air quality data and nearby pollution alerts.</p>
          <div className="w-full flex flex-col gap-3 relative z-10">
            <button onClick={requestLocation} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-2xl transition-colors shadow-lg shadow-emerald-600/20">
              Allow Location
            </button>
            <button onClick={skipLocation} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold py-4 rounded-2xl transition-colors border border-slate-200">
              Not Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative mesh-bg">
      <div className="relative z-20 flex-shrink-0">
        <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative z-20">
        <TopNav locationName={locationName} />
        
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 pb-32 md:pb-8 pt-4">
          
          {(activeTab === 'dashboard' || activeTab === 'live') && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="block xl:hidden max-w-4xl mx-auto">
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border border-white/40 mb-8">
                  <LiveView data={data} historyData={historyData} />
                </div>
              </div>
              
              <div className="hidden xl:grid grid-cols-12 gap-8 h-[calc(100vh-140px)] items-start">
                <div className="col-span-5 2xl:col-span-4 flex flex-col gap-8 h-full hide-scrollbar overflow-y-auto pr-2 pb-8">
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl rounded-[32px] p-8 shadow-xl border border-white/40">
                    <LiveView data={data} historyData={historyData} className="pb-0" />
                  </div>
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl rounded-[32px] p-8 shadow-xl border border-white/40">
                    <ForecastView data={data} className="pb-0 pt-0" />
                  </div>
                </div>
                
                <div className="col-span-7 2xl:col-span-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl rounded-[32px] p-8 shadow-xl border border-white/40 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Interactive Map</h2>
                    <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 shadow-sm">Live Data</span>
                  </div>
                  <div className="flex-1 rounded-2xl overflow-hidden shadow-[inset_0_4px_20px_rgba(0,0,0,0.05)] border border-slate-200/50 bg-slate-50">
                    <MapView onLocationSelect={handleLocationSelect} coords={coords!} className="w-full h-full pb-0" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'forecast' && (
              <motion.div 
                key="forecast"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="max-w-4xl mx-auto block xl:hidden"
              >
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border border-white/40 mb-8">
                  <ForecastView data={data} />
                </div>
              </motion.div>
            )}
            {activeTab === 'map' && (
              <motion.div 
                key="map"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="max-w-4xl mx-auto block xl:hidden"
              >
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border border-white/40 mb-8">
                  <MapView onLocationSelect={handleLocationSelect} coords={coords!} />
                </div>
              </motion.div>
            )}
            
            {activeTab === 'trends' && (
              <motion.div 
                key="trends"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border border-white/40 mb-8 block xl:hidden">
                  <TrendsView historyData={historyData} />
                </div>
              </motion.div>
            )}
            {activeTab === 'alerts' && (
              <motion.div 
                key="alerts"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl rounded-[32px] p-6 md:p-10 shadow-xl border border-white/40 mb-8">
                  <AlertsView onLocationSelect={handleLocationSelect} data={data} className="pb-8 pt-0" />
                </div>
              </motion.div>
            )}
            {activeTab === 'breathe' && (
              <motion.div 
                key="breathe"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border border-white/40 mb-8">
                  <BreathingView data={data} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>

      <div className="relative z-20">
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
