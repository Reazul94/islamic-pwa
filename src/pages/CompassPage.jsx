import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

const CompassPage = () => {
  const navigate = useNavigate();
  const { coordinates } = useSettingsStore();
  const [heading, setHeading] = useState(0);
  const [qiblaDir, setQiblaDir] = useState(0);

  const calculateQiblaDirection = (lat, lng) => {
    const kLat = 21.4225 * Math.PI / 180;
    const kLng = 39.8262 * Math.PI / 180;
    const uLat = lat * Math.PI / 180;
    const uLng = lng * Math.PI / 180;

    const y = Math.sin(kLng - uLng);
    const x = Math.cos(uLat) * Math.tan(kLat) - Math.sin(uLat) * Math.cos(kLng - uLng);
    
    let qiblaRad = Math.atan2(y, x);
    let qiblaDeg = qiblaRad * 180 / Math.PI;
    if (qiblaDeg < 0) qiblaDeg += 360;
    
    return qiblaDeg;
  };

  useEffect(() => {
    const qDir = calculateQiblaDirection(coordinates.latitude, coordinates.longitude);
    setQiblaDir(qDir);

    const handleOrientation = (e) => {
      if (e.alpha !== null) {
        setHeading(360 - e.alpha);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [coordinates]);

  const kaabaRotation = qiblaDir - heading;

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text p-4 pb-20 max-w-2xl mx-auto shadow-xl transition-colors duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 bg-theme-secondary hover:bg-theme-primary-light rounded-full transition-all"
        >
          <ArrowLeft size={18} className="text-theme-primary" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Qibla Compass</h2>
          <p className="text-xs text-theme-secondary">Mecca direction locator based on GPS orientation</p>
        </div>
      </div>

      <div className="bg-theme-card rounded-3xl border border-theme-border p-8 shadow-sm flex flex-col items-center text-center">
        <Compass size={32} className="text-theme-primary mb-3" />
        <h3 className="font-bold text-sm mb-2">Live Qibla Needle</h3>
        <p className="text-xs text-theme-secondary max-w-xs mb-8">
          Kaaba angle is <span className="font-extrabold text-theme-primary">{qiblaDir.toFixed(1)}°</span> from North. Calibrate and rotate your device until the gold needle aligns vertically.
        </p>

        {/* Compass Ring */}
        <div className="w-56 h-56 rounded-full border-4 border-theme-border relative flex items-center justify-center shadow-lg bg-theme-secondary select-none">
          <div 
            style={{ transform: `rotate(${-heading}deg)` }}
            className="absolute inset-2 rounded-full border border-dashed border-theme-border flex items-center justify-center transition-transform duration-200"
          >
            <span className="absolute top-1 text-xs font-bold text-red-500">N</span>
            <span className="absolute right-1 text-xs font-bold text-theme-secondary">E</span>
            <span className="absolute bottom-1 text-xs font-bold text-theme-secondary">S</span>
            <span className="absolute left-1 text-xs font-bold text-theme-secondary">W</span>
          </div>

          <div 
            style={{ transform: `rotate(${kaabaRotation}deg)` }}
            className="absolute w-2 h-44 flex flex-col justify-between items-center transition-transform duration-100"
          >
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[20px] border-b-theme-primary filter drop-shadow"></div>
            <div className="w-2 h-8 bg-theme-border rounded-full"></div>
          </div>
          
          <div className="w-6 h-6 bg-theme-card rounded-full border border-theme-border z-10 flex items-center justify-center text-xs">
            🕋
          </div>
        </div>

        <span className="text-[10px] text-theme-secondary font-bold mt-8">Device Heading: {heading.toFixed(0)}°</span>
      </div>
    </div>
  );
};

export default CompassPage;
