"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function ControlCard() {
  const [cluster, setCluster] = useState(false);
  const [intervalSec, setIntervalSec] = useState(15); // Default to 15s to avoid rate limiting
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCluster = () => {
    const next = !cluster;
    setCluster(next);
    window.dispatchEvent(new CustomEvent('flightscope:setCluster', { detail: next }));
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setIntervalSec(val);
    window.dispatchEvent(new CustomEvent('flightscope:setRefreshInterval', { detail: val * 1000 }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    window.dispatchEvent(new CustomEvent('flightscope:searchFlight', { detail: query }));
  };

  return (
  <Card className="w-[95vw] max-w-md rounded-2xl border-border/50 bg-surface/60 backdrop-blur-xl shadow-xl animate-in fade-in-5 slide-in-from-bottom-4 duration-500 ease-out md:w-auto">
      <CardHeader className="flex flex-row items-center justify-start p-3 pb-2 md:p-4 md:pb-2">
        <CardTitle className="text-base md:text-lg font-semibold text-foreground">
          Flight Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-2 md:p-4 md:pt-2">
        <div className="relative mb-2 md:mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-textSecondary" />
          <Input
            placeholder="Search flight ID or callsign..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-8 md:pl-9 pr-3 py-1.5 md:py-2 text-sm rounded-xl border-border/50 bg-background/30 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ease-in-out text-foreground placeholder:text-textSecondary"
          />
        </div>

        <div className="flex items-center justify-between gap-2 md:gap-4">
          <label className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-textSecondary">
            <input type="checkbox" checked={cluster} onChange={toggleCluster} className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="whitespace-nowrap">Clustering</span>
          </label>
          <div className="flex items-center gap-1.5 md:gap-2">
            <label className="text-xs md:text-sm text-textSecondary whitespace-nowrap">Refresh (s)</label>
            <input
              type="number"
              min={1}
              max={60}
              value={intervalSec}
              onChange={handleIntervalChange}
              className="w-12 md:w-16 text-sm rounded-md border-border/50 bg-background/30 text-foreground p-1"
            />
          </div>
        </div>

        <p className="text-[10px] md:text-xs text-textSecondary mt-2 md:mt-3 text-center">
          {intervalSec < 10 ? '⚠️ Fast refresh may cause rate limiting. Use 15s+ for best results.' : 'Toggle clustering to show more aircraft'}
        </p>
      </CardContent>
    </Card>
  );
}
