import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';

interface MeetingPlannerProps {
  timezones: Array<{ city: string; timezone: string }>;
}

export function MeetingPlanner({ timezones }: MeetingPlannerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedHour, setSelectedHour] = React.useState([9]);

  if (timezones.length < 2) {
    return null;
  }

  const getMeetingTimes = (baseHour: number) => {
    const now = new Date();
    const baseDate = new Date(now);
    baseDate.setHours(baseHour, 0, 0, 0);
    
    return timezones.map(({ city, timezone }) => {
      const localTime = baseDate.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const localHour = parseInt(baseDate.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        hour12: false,
      }));
      
      // Determine if it's a good meeting time (9 AM - 6 PM)
      const isGoodTime = localHour >= 9 && localHour < 18;
      
      return {
        city,
        time: localTime,
        hour: localHour,
        isGoodTime,
      };
    });
  };

  const meetingTimes = getMeetingTimes(selectedHour[0]);
  const allGoodTimes = meetingTimes.every(t => t.isGoodTime);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800 hover:text-amber-300"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Meeting Planner
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-amber-400">Meeting Time Planner</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Find the perfect meeting time across all your timezones
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-zinc-300">
                Select base time (your timezone)
              </label>
              <span className="text-amber-400 tabular-nums">
                {selectedHour[0].toString().padStart(2, '0')}:00
              </span>
            </div>
            <Slider
              value={selectedHour}
              onValueChange={setSelectedHour}
              min={0}
              max={23}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-zinc-300">Times across locations</h4>
              {allGoodTimes && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Perfect match!
                </Badge>
              )}
            </div>
            <div className="grid gap-3">
              {meetingTimes.map(({ city, time, hour, isGoodTime }) => (
                <div
                  key={city}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isGoodTime
                      ? 'bg-green-500/5 border-green-500/30'
                      : 'bg-red-500/5 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className={`h-4 w-4 ${
                      isGoodTime ? 'text-green-400' : 'text-red-400'
                    }`} />
                    <span className="text-white">{city}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400 tabular-nums">{time}</span>
                    {!isGoodTime && (
                      <Badge variant="outline" className="text-xs border-red-500/30 text-red-400">
                        Off hours
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
            <p className="text-xs text-zinc-500">
              💡 Green times indicate business hours (9 AM - 6 PM). Try adjusting the time to find when all locations have green times.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
