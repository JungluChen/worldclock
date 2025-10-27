import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import React from 'react';

interface AddCityDialogProps {
  onAddCity: (city: string, timezone: string) => void;
}

const cities = [
  { name: 'New York', timezone: 'America/New_York' },
  { name: 'London', timezone: 'Europe/London' },
  { name: 'Paris', timezone: 'Europe/Paris' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { name: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
  { name: 'Dubai', timezone: 'Asia/Dubai' },
  { name: 'Sydney', timezone: 'Australia/Sydney' },
  { name: 'Los Angeles', timezone: 'America/Los_Angeles' },
  { name: 'Singapore', timezone: 'Asia/Singapore' },
  { name: 'Mumbai', timezone: 'Asia/Kolkata' },
  { name: 'São Paulo', timezone: 'America/Sao_Paulo' },
  { name: 'Berlin', timezone: 'Europe/Berlin' },
  { name: 'Toronto', timezone: 'America/Toronto' },
  { name: 'Shanghai', timezone: 'Asia/Shanghai' },
  { name: 'Moscow', timezone: 'Europe/Moscow' },
  { name: 'Seoul', timezone: 'Asia/Seoul' },
  { name: 'Chicago', timezone: 'America/Chicago' },
  { name: 'Mexico City', timezone: 'America/Mexico_City' },
  { name: 'Istanbul', timezone: 'Europe/Istanbul' },
  { name: 'Bangkok', timezone: 'Asia/Bangkok' },
];

export function AddCityDialog({ onAddCity }: AddCityDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedCity, setSelectedCity] = React.useState<string>('');

  const handleAdd = () => {
    if (selectedCity) {
      const city = cities.find((c) => c.name === selectedCity);
      if (city) {
        onAddCity(city.name, city.timezone);
        setSelectedCity('');
        setOpen(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black border-0">
          <Plus className="mr-2 h-4 w-4" />
          Add City
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-amber-400">Add World Clock</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Select a city to add to your world clock collection.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              {cities.map((city) => (
                <SelectItem 
                  key={city.timezone} 
                  value={city.name}
                  className="text-white focus:bg-zinc-800 focus:text-amber-400"
                >
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAdd}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black"
            disabled={!selectedCity}
          >
            Add Clock
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
