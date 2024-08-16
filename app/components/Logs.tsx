// app/components/Logs.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Search, Loader, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Fail2BanLogsViewer: React.FC = () => {
  const [logs, setLogs] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);
  const [linesToShow, setLinesToShow] = useState<number>(50);
  const [activeTab, setActiveTab] = useState<'view' | 'search'>('view');

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mt-8 bg-black text-green-100 border border-green-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-green-400">
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Fail2Ban Logs
            </motion.span>
            <motion.div
              className="flex items-center space-x-2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Select value={linesToShow.toString()} onValueChange={(value) => setLinesToShow(Number(value))}>
                <SelectTrigger className="w-[120px] bg-gray-900 text-green-100 border-green-700 focus:border-green-400">
                  <SelectValue placeholder="Lines" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-green-100">
                  <SelectItem value="50">50 Lines</SelectItem>
                  <SelectItem value="100">100 Lines</SelectItem>
                  <SelectItem value="200">200 Lines</SelectItem>
                  <SelectItem value="500">500 Lines</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => fetchLogs(linesToShow)} className="bg-green-700 hover:bg-green-600 text-green-100">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </motion.div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'view' | 'search')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900">
              <TabsTrigger value="view" className="text-green-100 data-[state=active]:bg-green-700">View Logs</TabsTrigger>
              <TabsTrigger value="search" className="text-green-100 data-[state=active]:bg-green-700">Search Logs</TabsTrigger>
            </TabsList>
            <TabsContent value="view">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-32"
                  >
                    <Loader className="animate-spin h-8 w-8 text-green-400" />
                    <div className="ml-4 text-center">Loading logs...</div>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Alert variant="destructive" className="bg-red-900 text-green-100 border border-red-700">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                ) : (
                  <motion.div
                    key="logs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ScrollArea className="h-[400px] w-full rounded-md border border-green-700 bg-gray-900 p-4">
                      <pre className="text-green-100 whitespace-pre-wrap">{logs}</pre>
                    </ScrollArea>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
            <TabsContent value="search">
              <div className="flex items-center space-x-2 mb-4">
                <Input 
                  placeholder="Search logs..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-900 text-green-100 border-green-700 focus:border-green-400"
                />
                <Button onClick={searchLogs} disabled={!searchQuery || searching} className="bg-green-700 hover:bg-green-600 text-green-100">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
              <AnimatePresence mode="wait">
                {searching ? (
                  <motion.div
                    key="searching"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-32"
                  >
                    <Loader className="animate-spin h-8 w-8 text-green-400" />
                    <div className="ml-4 text-center">Searching logs...</div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="search-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ScrollArea className="h-[400px] w-full rounded-md border border-green-700 bg-gray-900 p-4">
                      <pre className="text-green-100 whitespace-pre-wrap">{logs}</pre>
                    </ScrollArea>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Fail2BanLogsViewer;