import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
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
import { Input } from './ui/input';

interface TimeConverterProps {
  timezones: Array<{ city: string; timezone: string }>;
}

export function TimeConverter({ timezones }: TimeConverterProps) {
  const [open, setOpen] = React.useState(false);
  const [fromTimezone, setFromTimezone] = React.useState('');
  const [toTimezone, setToTimezone] = React.useState('');
  const [inputTime, setInputTime] = React.useState('12:00');

  React.useEffect(() => {
    if (timezones.length >= 2 && !fromTimezone && !toTimezone) {
      setFromTimezone(timezones[0].timezone);
      setToTimezone(timezones[1].timezone);
    }
  }, [timezones, fromTimezone, toTimezone]);

  const convertTime = () => {
    if (!fromTimezone || !toTimezone || !inputTime) return '--:--';

    const [hours, minutes] = inputTime.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);

    const result = now.toLocaleTimeString('en-US', {
      timeZone: toTimezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return result;
  };

  const getDateDifference = () => {
    if (!fromTimezone || !toTimezone || !inputTime) return '';

    const [hours, minutes] = inputTime.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);

    const fromDate = now.toLocaleDateString('en-US', {
      timeZone: fromTimezone,
      month: 'short',
      day: 'numeric',
    });

    const toDate = now.toLocaleDateString('en-US', {
      timeZone: toTimezone,
      month: 'short',
      day: 'numeric',
    });

    if (fromDate !== toDate) {
      return ` (${toDate})`;
    }
    return '';
  };

  if (timezones.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800 hover:text-amber-300"
        >
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          Time Converter
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-amber-400">Time Zone Converter</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Convert time between different time zones
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">From</label>
            <Select value={fromTimezone} onValueChange={setFromTimezone}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {timezones.map(({ city, timezone }) => (
                  <SelectItem 
                    key={timezone} 
                    value={timezone}
                    className="text-white focus:bg-zinc-800 focus:text-amber-400"
                  >
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Time</label>
            <Input
              type="time"
              value={inputTime}
              onChange={(e) => setInputTime(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-white text-2xl tabular-nums"
            />
          </div>

          <div className="flex justify-center">
            <div className="p-2 bg-zinc-900 rounded-full">
              <ArrowRightLeft className="h-5 w-5 text-amber-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">To</label>
            <Select value={toTimezone} onValueChange={setToTimezone}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {timezones.map(({ city, timezone }) => (
                  <SelectItem 
                    key={timezone} 
                    value={timezone}
                    className="text-white focus:bg-zinc-800 focus:text-amber-400"
                  >
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-lg">
            <p className="text-sm text-zinc-400 mb-2">Converted time</p>
            <p className="text-4xl text-amber-400 tabular-nums">
              {convertTime()}
              <span className="text-lg text-zinc-500">{getDateDifference()}</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
