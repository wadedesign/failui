// app/components/Password.tsx

'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

interface PasswordProps {
  getToken: () => string | null;
}

const Password: React.FC<PasswordProps> = ({ getToken }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [message, setMessage] = useState<{ type: string, content: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { toast } = useToast();

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    try {
      const token = getToken();
      const response = await fetch('http://127.0.0.1:31948/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', content: 'Password changed successfully!' });
        toast({ title: 'Success', description: 'Password changed successfully!', duration: 5000 });
      } else {
        throw new Error(data.detail || 'Failed to change password');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setMessage({ type: 'error', content: errorMessage });
      toast({ title: 'Error', description: errorMessage, variant: 'destructive', duration: 5000 });
    }
  };

  const handleUsernameChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    try {
      const token = getToken();
      const response = await fetch('http://127.0.0.1:31948/auth/change-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  
        },
        body: JSON.stringify({ new_username: newUsername }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', content: 'Username changed successfully!' });
        toast({ title: 'Success', description: 'Username changed successfully!', duration: 5000 });
      } else {
        throw new Error(data.detail || 'Failed to change username');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setMessage({ type: 'error', content: errorMessage });
      toast({ title: 'Error', description: errorMessage, variant: 'destructive', duration: 5000 });
    }
  };

  return (
    <Card className="mb-6 bg-black text-green-100 border border-green-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-green-400">
          <span>User Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-green-100">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-gray-900 border-green-700 text-green-100 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-green-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-green-100">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-gray-900 border-green-700 text-green-100 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-green-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-green-700 hover:bg-green-600 text-green-100 disabled:opacity-50">
            Change Password
          </Button>
        </form>

        <form onSubmit={handleUsernameChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-username" className="text-green-100">New Username</Label>
            <Input
              id="new-username"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="bg-gray-900 border-green-700 text-green-100"
            />
          </div>

          <Button type="submit" className="w-full bg-green-700 hover:bg-green-600 text-green-100 disabled:opacity-50">
            Change Username
          </Button>
        </form>

        {message && (
          <Alert variant={message.type === 'error' ? "destructive" : "default"} className={`${message.type === 'error' ? 'bg-red-900 border-red-700' : 'bg-green-900 border-green-400'} text-green-100`}>
            {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <AlertTitle>{message.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
            <AlertDescription>{message.content}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default Password;
