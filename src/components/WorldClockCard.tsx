import React from 'react';
import { motion } from 'motion/react';
import { Trash2, Sun, Moon, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface WorldClockCardProps {
  city: string;
  timezone: string;
  onRemove: () => void;
  index: number;
  showAnalog: boolean;
  isPinned: boolean;
  onTogglePin: () => void;
}

export function WorldClockCard({ 
  city, 
  timezone, 
  onRemove, 
  index, 
  showAnalog,
  isPinned,
  onTogglePin 
}: WorldClockCardProps) {
  const [time, setTime] = React.useState<Date>(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const formattedDate = time.toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Get UTC offset
  const getUTCOffset = () => {
    const localTime = new Date(time.toLocaleString('en-US', { timeZone: timezone }));
    const utcTime = new Date(time.toLocaleString('en-US', { timeZone: 'UTC' }));
    const offset = (localTime.getTime() - utcTime.getTime()) / (1000 * 60 * 60);
    const sign = offset >= 0 ? '+' : '-';
    const hours = Math.abs(Math.floor(offset));
    const minutes = Math.abs((offset % 1) * 60);
    return `UTC${sign}${hours}${minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''}`;
  };

  // Check if it's daytime (6 AM - 6 PM)
  const isDaytime = () => {
    const localTime = new Date(time.toLocaleString('en-US', { timeZone: timezone }));
    const hour = localTime.getHours();
    return hour >= 6 && hour < 18;
  };

  // Get time difference from local timezone
  const getTimeDifference = () => {
    const localTime = new Date();
    const targetTime = new Date(time.toLocaleString('en-US', { timeZone: timezone }));
    const diff = (targetTime.getTime() - localTime.getTime()) / (1000 * 60 * 60);
    const absDiff = Math.abs(diff);
    const hours = Math.floor(absDiff);
    const minutes = Math.round((absDiff % 1) * 60);
    
    if (Math.abs(diff) < 0.1) return 'Local time';
    
    const sign = diff > 0 ? '+' : '-';
    return `${sign}${hours}${minutes > 0 ? `.5` : ''}h`;
  };

  // Analog clock rendering
  const renderAnalogClock = () => {
    const localTime = new Date(time.toLocaleString('en-US', { timeZone: timezone }));
    const hours = localTime.getHours() % 12;
    const minutes = localTime.getMinutes();
    const seconds = localTime.getSeconds();

    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
    const hourDegrees = ((hours + minutes / 60) / 12) * 360;

    return (
      <div className="relative w-32 h-32 mx-auto">
        {/* Clock face */}
        <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 bg-gradient-to-br from-zinc-900 to-black">
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-2 bg-amber-500/50"
              style={{
                top: '10%',
                left: '50%',
                transformOrigin: '0 40px',
                transform: `translateX(-50%) rotate(${i * 30}deg)`,
              }}
            />
          ))}
        </div>
        
        {/* Hour hand */}
        <div
          className="absolute w-1 h-10 bg-amber-400 rounded-full"
          style={{
            top: '30%',
            left: '50%',
            transformOrigin: '50% 80%',
            transform: `translateX(-50%) rotate(${hourDegrees}deg)`,
          }}
        />
        
        {/* Minute hand */}
        <div
          className="absolute w-0.5 h-14 bg-amber-300 rounded-full"
          style={{
            top: '20%',
            left: '50%',
            transformOrigin: '50% 85%',
            transform: `translateX(-50%) rotate(${minuteDegrees}deg)`,
          }}
        />
        
        {/* Second hand */}
        <div
          className="absolute w-px h-16 bg-red-400 rounded-full"
          style={{
            top: '15%',
            left: '50%',
            transformOrigin: '50% 87.5%',
            transform: `translateX(-50%) rotate(${secondDegrees}deg)`,
          }}
        />
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-amber-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>
    );
  };

  const daytime = isDaytime();
  const utcOffset = getUTCOffset();
  const timeDiff = getTimeDifference();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`relative bg-gradient-to-br from-zinc-900 to-black border-zinc-800 p-6 hover:border-amber-500/50 transition-all duration-300 group overflow-hidden ${
        isPinned ? 'ring-2 ring-amber-500/30' : ''
      }`}>
        {/* Background accent */}
        <div className={`absolute inset-0 bg-gradient-to-br ${
          daytime 
            ? 'from-amber-500/5 via-orange-500/5 to-transparent' 
            : 'from-blue-500/5 via-indigo-500/5 to-transparent'
        } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-amber-400">{city}</h3>
                {isPinned && (
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-zinc-500 text-sm">{formattedDate}</p>
                <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">
                  {utcOffset}
                </Badge>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={onTogglePin}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-amber-400 hover:bg-amber-400/10"
              >
                <Star className={`h-4 w-4 ${isPinned ? 'fill-amber-500' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Day/Night indicator */}
          <div className="flex items-center gap-2 mb-4">
            <div className={`p-1.5 rounded-full ${
              daytime ? 'bg-amber-500/20' : 'bg-blue-500/20'
            }`}>
              {daytime ? (
                <Sun className="h-3 w-3 text-amber-400" />
              ) : (
                <Moon className="h-3 w-3 text-blue-300" />
              )}
            </div>
            <span className="text-xs text-zinc-500">
              {daytime ? 'Daytime' : 'Nighttime'}
            </span>
            <span className="text-xs text-zinc-600">•</span>
            <span className="text-xs text-zinc-500">{timeDiff}</span>
          </div>
          
          {showAnalog ? (
            <div className="mt-6">
              {renderAnalogClock()}
              <div className="text-center mt-4 text-sm text-zinc-400 tabular-nums">
                {formattedTime}
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <div className="text-5xl tracking-tight text-white font-light tabular-nums">
                {formattedTime}
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
