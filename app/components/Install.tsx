// app/components/Install.tsx

'use client';

import React, { useState } from 'react';
import { AlertCircle, Loader, Lock, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";

interface InstallationStatus {
  message: string;
  type: 'success' | 'error' | 'info';
}

const Fail2BanInstaller: React.FC = () => {
  const [status, setStatus] = useState<InstallationStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sudoPassword, setSudoPassword] = useState<string>('');
  const { toast } = useToast();

  const installFail2Ban = async () => {
    setIsLoading(true);
    setStatus(null);
    try {
      const response = await fetch('http://127.0.0.1:31948/fail2ban/install', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sudoPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to install Fail2Ban');
      }

      setStatus({ message: data.message, type: 'success' });
      toast({
        title: "Installation Successful",
        description: data.message,
        duration: 5000,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setStatus({ message: errorMessage, type: 'error' });
      toast({
        title: "Installation Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
      setSudoPassword('');
    }
  };

  return (
    <Card className="mb-6 bg-black text-green-100 border border-green-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-green-400">
          <span>Install Fail2Ban</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="default" className="bg-yellow-900 border-yellow-700 text-yellow-100">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Security Notice</AlertTitle>
          <AlertDescription>
            The sudo password is required to install Fail2Ban on your local system. 
            This password is used locally and is never stored or transmitted to any external servers.
            Always ensure you&apos;re using this on your own system in a secure environment.
          </AlertDescription>
        </Alert>

        <div className="flex items-center space-x-2">
          <Lock className="text-green-400" />
          <Input
            type="password"
            placeholder="Enter sudo password"
            value={sudoPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSudoPassword(e.target.value)}
            className="flex-grow bg-gray-900 text-green-100 border-green-700 focus:border-green-400"
          />
        </div>
        <Button 
          onClick={installFail2Ban} 
          disabled={isLoading || !sudoPassword} 
          className="w-full bg-green-700 hover:bg-green-600 text-green-100 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Installing...
            </>
          ) : (
            'Install Fail2Ban'
          )}
        </Button>

        {status && (
          <Alert 
            variant={status.type === 'error' ? "destructive" : "default"} 
            className={`${status.type === 'error' ? 'bg-red-900 border-red-700' : 'bg-green-900 border-green-400'} text-green-100`}
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{status.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default Fail2BanInstaller;
