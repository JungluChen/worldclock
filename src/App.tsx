import React from "react";
import { Clock, Grid3x3, ScanLine, Search } from "lucide-react";
import { WorldClockCard } from "./components/WorldClockCard";
import { AddCityDialog } from "./components/AddCityDialog";
import { MeetingPlanner } from "./components/MeetingPlanner";
import { TimeConverter } from "./components/TimeConverter";
import { WorldMap } from "./components/WorldMap";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Switch } from "./components/ui/switch";

interface CityTime {
  id: string;
  city: string;
  timezone: string;
  isPinned: boolean;
}

export default function App() {
  const [cities, setCities] = React.useState<CityTime[]>([
    {
      id: "1",
      city: "New York",
      timezone: "America/New_York",
      isPinned: false,
    },
    {
      id: "2",
      city: "London",
      timezone: "Europe/London",
      isPinned: false,
    },
    {
      id: "3",
      city: "Tokyo",
      timezone: "Asia/Tokyo",
      isPinned: false,
    },
    {
      id: "4",
      city: "Paris",
      timezone: "Europe/Paris",
      isPinned: false,
    },
  ]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showAnalog, setShowAnalog] = React.useState(false);
  const cardRefs = React.useRef<
    Record<string, HTMLDivElement | null>
  >({});

  const addCity = (city: string, timezone: string) => {
    // Check if city already exists
    if (cities.some((c) => c.timezone === timezone)) {
      return;
    }

    const newCity: CityTime = {
      id: Date.now().toString(),
      city,
      timezone,
      isPinned: false,
    };
    setCities([...cities, newCity]);
  };

  const removeCity = (id: string) => {
    setCities(cities.filter((city) => city.id !== id));
  };

  const togglePin = (id: string) => {
    setCities(
      cities.map((city) =>
        city.id === id
          ? { ...city, isPinned: !city.isPinned }
          : city,
      ),
    );
  };

  const handleCityClickFromMap = (cityName: string) => {
    // Find the city and scroll to it
    const cityData = cities.find((c) => c.city === cityName);
    if (cityData && cardRefs.current[cityData.id]) {
      cardRefs.current[cityData.id]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      // Highlight the city temporarily
      setSearchQuery("");
      setTimeout(() => {
        const element = cardRefs.current[cityData.id];
        if (element) {
          element.style.transform = "scale(1.05)";
          setTimeout(() => {
            element.style.transform = "scale(1)";
          }, 300);
        }
      }, 500);
    }
  };

  // Filter and sort cities
  const filteredCities = cities
    .filter((city) =>
      city.city
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      // Pinned cities first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  return (
    <div className="min-h-screen bg-black dark">
      {/* Background gradient effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-500/5 via-black to-zinc-900/50 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                  <Clock className="h-6 w-6 text-black" />
                </div>
                <h1 className="text-5xl tracking-tight bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  World Clock
                </h1>
              </div>
              <p className="text-zinc-500 ml-[60px]">
                Track time across the globe with elegance
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <WorldMap
                cities={cities.map((c) => ({
                  city: c.city,
                  timezone: c.timezone,
                }))}
                onCityClick={handleCityClickFromMap}
              />
              <MeetingPlanner
                timezones={cities.map((c) => ({
                  city: c.city,
                  timezone: c.timezone,
                }))}
              />
              <TimeConverter
                timezones={cities.map((c) => ({
                  city: c.city,
                  timezone: c.timezone,
                }))}
              />
              <AddCityDialog onAddCity={addCity} />
            </div>
          </div>

          {/* Search and view controls */}
          {cities.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Search cities..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
                />
              </div>
              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2">
                <Grid3x3 className="h-4 w-4 text-zinc-500" />
                <span className="text-sm text-zinc-400">
                  Digital
                </span>
                <Switch
                  checked={showAnalog}
                  onCheckedChange={setShowAnalog}
                  className="data-[state=checked]:bg-amber-500"
                />
                <span className="text-sm text-zinc-400">
                  Analog
                </span>
                <ScanLine className="h-4 w-4 text-zinc-500" />
              </div>
            </div>
          )}
        </div>

        {/* Clocks Grid */}
        {cities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="p-6 bg-zinc-900/50 rounded-full mb-6">
              <Clock className="h-12 w-12 text-zinc-700" />
            </div>
            <h3 className="text-zinc-400 mb-2">
              No clocks added yet
            </h3>
            <p className="text-zinc-600 text-sm">
              Add a city to get started
            </p>
          </div>
        ) : filteredCities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="p-6 bg-zinc-900/50 rounded-full mb-6">
              <Search className="h-12 w-12 text-zinc-700" />
            </div>
            <h3 className="text-zinc-400 mb-2">
              No cities found
            </h3>
            <p className="text-zinc-600 text-sm">
              Try a different search term
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCities.map((city, index) => (
              <div
                key={city.id}
                ref={(el) => (cardRefs.current[city.id] = el)}
                style={{ transition: "transform 0.3s ease" }}
              >
                <WorldClockCard
                  city={city.city}
                  timezone={city.timezone}
                  onRemove={() => removeCity(city.id)}
                  index={index}
                  showAnalog={showAnalog}
                  isPinned={city.isPinned}
                  onTogglePin={() => togglePin(city.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {cities.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-lg p-4">
              <p className="text-zinc-500 text-sm mb-1">
                Total Clocks
              </p>
              <p className="text-2xl text-amber-400">
                {cities.length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-lg p-4">
              <p className="text-zinc-500 text-sm mb-1">
                Pinned
              </p>
              <p className="text-2xl text-amber-400">
                {cities.filter((c) => c.isPinned).length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-lg p-4">
              <p className="text-zinc-500 text-sm mb-1">
                Time Zones
              </p>
              <p className="text-2xl text-amber-400">
                {new Set(cities.map((c) => c.timezone)).size}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-900 text-center">
          <p className="text-zinc-700 text-sm">
            Designed with precision and elegance
          </p>
        </div>
      </div>
    </div>
  );
}