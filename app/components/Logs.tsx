// app/components/Logs.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Search, Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Fail2BanLogsViewer: React.FC = () => {
  const [logs, setLogs] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);
  const [linesToShow, setLinesToShow] = useState<number>(50);

  useEffect(() => {
    fetchLogs(linesToShow);
  }, [linesToShow]);

  const fetchLogs = async (lines: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:31948/fail2ban/viewlogs?lines=${lines}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Fail2Ban logs');
      }
      const data = await response.json();
      setLogs(data.logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const searchLogs = async () => {
    setSearching(true);
    try {
      const response = await fetch(`http://127.0.0.1:31948/fail2ban/search?query=${searchQuery}`);
      if (!response.ok) {
        throw new Error('Failed to search Fail2Ban logs');
      }
      const data = await response.json();
      setLogs(data.logs || 'No matching logs found.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSearching(false);
    }
  };

  return (
    <Card className="mt-8 bg-black text-green-100 border border-green-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-green-400">
          <span>Fail2Ban Logs</span>
          <div className="flex items-center">
            <Input 
              placeholder="Search logs..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mr-2 bg-gray-900 text-green-100 border-green-700 focus:border-green-400"
            />
            <Button onClick={searchLogs} disabled={!searchQuery || searching} className="mr-4 bg-green-700 hover:bg-green-600 text-green-100">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Select value={linesToShow.toString()} onValueChange={(value) => setLinesToShow(Number(value))}>
              <SelectTrigger className="bg-gray-900 text-green-100 border-green-700 focus:border-green-400">
                <SelectValue placeholder="Lines" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-green-100">
                <SelectItem value="50">50 Lines</SelectItem>
                <SelectItem value="100">100 Lines</SelectItem>
                <SelectItem value="200">200 Lines</SelectItem>
                <SelectItem value="500">500 Lines</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading || searching ? (
          <div className="flex items-center justify-center h-32">
            <Loader className="animate-spin h-8 w-8 text-green-400" />
            <div className="ml-4 text-center">Loading logs...</div>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="bg-red-900 text-green-100 border border-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <Textarea
            value={logs}
            readOnly
            className="min-h-[400px] bg-gray-900 text-green-100 border-green-700 focus:border-green-400"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Fail2BanLogsViewer;