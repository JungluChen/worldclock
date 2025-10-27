import React from 'react';
import { motion } from 'motion/react';
import { MapPin, X } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Badge } from './ui/badge';

interface CityLocation {
  city: string;
  timezone: string;
  lat: number;
  lng: number;
}

interface WorldMapProps {
  cities: Array<{ city: string; timezone: string }>;
  onCityClick?: (city: string) => void;
}

// City coordinates (latitude, longitude)
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'New York': { lat: 40.7128, lng: -74.0060 },
  'London': { lat: 51.5074, lng: -0.1278 },
  'Paris': { lat: 48.8566, lng: 2.3522 },
  'Tokyo': { lat: 35.6762, lng: 139.6503 },
  'Hong Kong': { lat: 22.3193, lng: 114.1694 },
  'Dubai': { lat: 25.2048, lng: 55.2708 },
  'Sydney': { lat: -33.8688, lng: 151.2093 },
  'Los Angeles': { lat: 34.0522, lng: -118.2437 },
  'Singapore': { lat: 1.3521, lng: 103.8198 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'São Paulo': { lat: -23.5505, lng: -46.6333 },
  'Berlin': { lat: 52.5200, lng: 13.4050 },
  'Toronto': { lat: 43.6532, lng: -79.3832 },
  'Shanghai': { lat: 31.2304, lng: 121.4737 },
  'Moscow': { lat: 55.7558, lng: 37.6173 },
  'Seoul': { lat: 37.5665, lng: 126.9780 },
  'Chicago': { lat: 41.8781, lng: -87.6298 },
  'Mexico City': { lat: 19.4326, lng: -99.1332 },
  'Istanbul': { lat: 41.0082, lng: 28.9784 },
  'Bangkok': { lat: 13.7563, lng: 100.5018 },
};

export function WorldMap({ cities, onCityClick }: WorldMapProps) {
  const [open, setOpen] = React.useState(false);
  const [hoveredCity, setHoveredCity] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Convert lat/lng to SVG coordinates
  const latLngToXY = (lat: number, lng: number) => {
    // Map projection (simple equirectangular)
    const x = ((lng + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  const cityLocations: CityLocation[] = cities
    .map(({ city, timezone }) => {
      const coords = cityCoordinates[city];
      if (!coords) return null;
      return {
        city,
        timezone,
        lat: coords.lat,
        lng: coords.lng,
      };
    })
    .filter((loc): loc is CityLocation => loc !== null);

  const getTimeForCity = (timezone: string) => {
    return currentTime.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800 hover:text-amber-300"
        >
          <MapPin className="mr-2 h-4 w-4" />
          World Map
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-amber-400">World Time Zone Map</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Visual representation of all your tracked locations
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative flex-1 overflow-hidden">
          {/* Map Container */}
          <div className="relative w-full h-full bg-gradient-to-br from-zinc-900 to-black rounded-lg border border-zinc-800 overflow-auto">
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-full"
              style={{ minWidth: '800px', minHeight: '400px' }}
            >
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path
                    d="M 50 0 L 0 0 0 50"
                    fill="none"
                    stroke="rgba(161, 98, 7, 0.1)"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="1000" height="500" fill="url(#grid)" />
              
              {/* Equator and Prime Meridian */}
              <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(161, 98, 7, 0.2)" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(161, 98, 7, 0.2)" strokeWidth="1" strokeDasharray="5,5" />
              
              {/* Continents outline (simplified) */}
              <g fill="rgba(113, 113, 130, 0.1)" stroke="rgba(161, 98, 7, 0.3)" strokeWidth="1">
                {/* North America */}
                <path d="M 150,150 Q 100,120 120,100 L 200,80 L 250,120 L 280,100 L 300,150 L 250,200 L 200,220 L 150,200 Z" />
                {/* South America */}
                <path d="M 250,280 L 280,320 L 270,380 L 240,400 L 220,380 L 230,320 Z" />
                {/* Europe */}
                <path d="M 480,120 L 520,110 L 540,130 L 530,150 L 500,160 L 470,140 Z" />
                {/* Africa */}
                <path d="M 500,200 L 540,220 L 550,280 L 530,340 L 500,350 L 480,320 L 490,260 Z" />
                {/* Asia */}
                <path d="M 600,100 L 750,80 L 850,120 L 900,140 L 880,180 L 820,200 L 750,180 L 700,200 L 650,180 L 600,150 Z" />
                {/* Australia */}
                <path d="M 780,340 L 840,330 L 860,360 L 850,390 L 800,400 L 770,380 Z" />
              </g>
              
              {/* Connection lines between cities */}
              {cityLocations.map((location, i) => {
                const { x, y } = latLngToXY(location.lat, location.lng);
                return cityLocations.slice(i + 1).map((otherLocation, j) => {
                  const other = latLngToXY(otherLocation.lat, otherLocation.lng);
                  return (
                    <line
                      key={`${i}-${j}`}
                      x1={x}
                      y1={y}
                      x2={other.x}
                      y2={other.y}
                      stroke="rgba(251, 191, 36, 0.1)"
                      strokeWidth="1"
                      strokeDasharray="3,3"
                    />
                  );
                });
              })}
              
              {/* City markers */}
              {cityLocations.map((location, index) => {
                const { x, y } = latLngToXY(location.lat, location.lng);
                const isHovered = hoveredCity === location.city;
                
                return (
                  <g key={location.city}>
                    {/* Pulsing circle animation */}
                    <motion.circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 20 : 15}
                      fill="rgba(251, 191, 36, 0.1)"
                      stroke="rgba(251, 191, 36, 0.5)"
                      strokeWidth="2"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    />
                    
                    {/* Main marker */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 10 : 6}
                      fill="#fbbf24"
                      stroke="#000"
                      strokeWidth="2"
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredCity(location.city)}
                      onMouseLeave={() => setHoveredCity(null)}
                      onClick={() => onCityClick?.(location.city)}
                    />
                    
                    {/* City label */}
                    {isHovered && (
                      <g>
                        <rect
                          x={x - 50}
                          y={y - 40}
                          width="100"
                          height="30"
                          rx="4"
                          fill="#18181b"
                          stroke="#fbbf24"
                          strokeWidth="1"
                        />
                        <text
                          x={x}
                          y={y - 28}
                          textAnchor="middle"
                          fill="#fbbf24"
                          fontSize="10"
                          fontWeight="500"
                        >
                          {location.city}
                        </text>
                        <text
                          x={x}
                          y={y - 16}
                          textAnchor="middle"
                          fill="#a1a1aa"
                          fontSize="8"
                        >
                          {getTimeForCity(location.timezone)}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-zinc-950/90 border border-zinc-800 rounded-lg p-4 backdrop-blur-sm">
            <h4 className="text-sm text-zinc-400 mb-3">Active Locations</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {cityLocations.map(({ city, timezone }) => (
                <div
                  key={city}
                  className="flex items-center justify-between gap-4 text-xs hover:bg-zinc-900/50 p-2 rounded cursor-pointer transition-colors"
                  onMouseEnter={() => setHoveredCity(city)}
                  onMouseLeave={() => setHoveredCity(null)}
                  onClick={() => onCityClick?.(city)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      hoveredCity === city ? 'bg-amber-400' : 'bg-amber-500/50'
                    }`} />
                    <span className="text-white">{city}</span>
                  </div>
                  <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400 tabular-nums">
                    {getTimeForCity(timezone)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Info card */}
          <div className="absolute top-4 right-4 bg-zinc-950/90 border border-zinc-800 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-amber-400 mt-0.5" />
              <div>
                <h4 className="text-sm text-white mb-1">Map Guide</h4>
                <p className="text-xs text-zinc-500 max-w-xs">
                  Hover over markers to see city details. Lines connect your tracked locations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
