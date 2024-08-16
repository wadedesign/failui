// app/components/BanList.tsx
// pagination is working for hte first page - but no other page. 


'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Ban, Trash2, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

const ITEMS_PER_PAGE = 5;

const Fail2BanManagement = () => {
  const [bannedIPs, setBannedIPs] = useState([]);
  const [newIP, setNewIP] = useState('');
  const [jail, setJail] = useState('ssh');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedIPs, setPaginatedIPs] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchBannedIPs();
  }, []);

  useEffect(() => {
    paginateIPs();
  }, [bannedIPs, currentPage]);

  const paginateIPs = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = bannedIPs.slice(startIndex, endIndex);
    setPaginatedIPs(paginatedData);
  };

  const fetchBannedIPs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:31948/fail2ban/list');
      if (!response.ok) {
        throw new Error('Failed to fetch banned IPs');
      }
      const data = await response.json();
      setBannedIPs(data.banned_ips);
      setCurrentPage(1); // Reset to first page when new data is fetched
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const banIP = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:31948/fail2ban/ban?ip=${newIP}&jail=${jail}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to ban IP');
      }
      const data = await response.json();
      toast({
        title: "Success",
        description: data.message,
        duration: 3000,
      });
      fetchBannedIPs();
      setNewIP('');
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const unbanIP = async (ip) => {
    try {
      const response = await fetch(`http://127.0.0.1:31948/fail2ban/unban?ip=${ip}&jail=${jail}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to unban IP');
      }
      const data = await response.json();
      toast({
        title: "Success",
        description: data.message,
        duration: 3000,
      });
      fetchBannedIPs();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const totalPages = Math.ceil(bannedIPs.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Card className="mt-8 bg-black text-green-100 border border-green-700">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center">
          <Shield className="mr-2" />
          Manage Fail2Ban
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter IP to ban"
            value={newIP}
            onChange={(e) => setNewIP(e.target.value)}
            className="bg-gray-900 text-green-100 border-green-700 focus:border-green-400"
          />
          <Select value={jail} onValueChange={setJail}>
            <SelectTrigger className="w-[180px] bg-gray-900 text-green-100 border-green-700">
              <SelectValue placeholder="Select jail" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ssh">SSH</SelectItem>
              <SelectItem value="http-auth">HTTP Auth</SelectItem>
              <SelectItem value="nginx-http-auth">Nginx HTTP Auth</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={banIP} className="bg-red-700 hover:bg-red-600 text-green-100">
            <Ban className="mr-2 h-4 w-4" />
            Ban IP
          </Button>
        </div>

        <Card className="bg-gray-900 border-green-700">
          <CardHeader>
            <CardTitle className="text-green-400">Currently Banned IPs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-700" />
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-green-400">IP Address</TableHead>
                      <TableHead className="text-green-400">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {paginatedIPs.map((ip) => (
                        <motion.tr
                          key={ip}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TableCell className="font-mono text-white">{ip}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => unbanIP(ip)}
                              variant="outline"
                              size="sm"
                              className="bg-green-700 hover:bg-green-600 text-green-100"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Unban
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-green-400">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="bg-gray-800 hover:bg-gray-700 text-green-100"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="bg-gray-800 hover:bg-gray-700 text-green-100"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="bg-red-900 text-green-100 border border-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default Fail2BanManagement;
