'use client';


import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Shield, RotateCw, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Fail2BanStatus = () => {
  const [status, setStatus] = useState(null);
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:31948/fail2ban/statusplease');
      if (!response.ok) {
        throw new Error('Failed to fetch Fail2Ban status');
      }
      const data = await response.json();
      setStatus(data.status);
      setDetails(data.details);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:31948/fail2ban/restart', {
        method: 'POST',
      });
      const data = await response.json();
      setActionMessage(data.message);
      fetchStatus(); // Refresh status after restarting
    } catch (err) {
      setError('Failed to restart Fail2Ban');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:31948/fail2ban/reload', {
        method: 'POST',
      });
      const data = await response.json();
      setActionMessage(data.message);
      fetchStatus(); // Refresh status after reloading
    } catch (err) {
      setError('Failed to reload Fail2Ban');
    } finally {
      setIsLoading(false);
    }
  };

  const StatusIndicator = ({ isActive }) => (
    <motion.div
      className={`w-4 h-4 rounded-full ${isActive ? 'bg-green-400' : 'bg-red-500'}`}
      animate={{
        scale: isActive ? [1, 1.2, 1] : 1,
        opacity: isActive ? [1, 0.7, 1] : 1,
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );

  if (isLoading) {
    return (
      <Card className="mt-8 bg-black text-green-100 border border-green-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">Loading Fail2Ban status...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-8 bg-black text-green-100 border border-green-700">
        <CardContent className="pt-6">
          <Alert variant="destructive" className="bg-red-900 text-green-100 border border-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const isActive = status === "Fail2Ban is running";

  return (
    <Card className="mt-8 bg-black text-green-100 border border-green-700">
      <CardHeader>
        <CardTitle className="flex items-center text-green-400">
          <Shield className="mr-2 h-6 w-6" />
          Fail2Ban Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <StatusIndicator isActive={isActive} />
          <Alert variant={isActive ? "default" : "destructive"} className={isActive ? "bg-green-900 border-green-400" : "bg-red-900 border-red-500"}>
            {isActive ? <CheckCircle className="h-4 w-4 text-green-400" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
            <AlertTitle className={isActive ? "text-green-400" : "text-red-500"}>{status}</AlertTitle>
            <AlertDescription className='text-green-100'>
              {isActive ? "Fail2Ban is active and protecting your system." : "Fail2Ban is not running. Your system might be at risk."}
            </AlertDescription>
          </Alert>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-md border border-green-700">
          <h3 className="text-lg font-semibold mb-2 text-green-400">Service Details:</h3>
          <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-60 text-green-100">{details}</pre>
        </div>

        <div className="flex space-x-4">
          <Button onClick={handleRestart} className="bg-red-700 hover:bg-red-600 text-green-100">
            <RotateCw className="mr-2 h-4 w-4" />
            Restart Fail2Ban
          </Button>
          <Button onClick={handleReload} className="bg-green-700 hover:bg-green-600 text-green-100">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload Configuration
          </Button>
        </div>

        {actionMessage && (
          <Alert variant="default" className="bg-green-900 text-green-100 mt-4 border border-green-400">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{actionMessage}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default Fail2BanStatus;