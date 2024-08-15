'use client';


import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from 'framer-motion';

const UserSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' });
  const [showPassword, setShowPassword] = useState(false);

  const getToken = () => localStorage.getItem('token'); // Function to get the token from localStorage

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const response = await fetch('http://127.0.0.1:31948/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Include the token in the request
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', content: 'Password changed successfully!' });
      } else {
        setMessage({ type: 'error', content: data.detail || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', content: 'An error occurred. Please try again.' });
    }
  };

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const response = await fetch('http://127.0.0.1:31948/auth/change-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Include the token in the request
        },
        body: JSON.stringify({ new_username: newUsername }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', content: 'Username changed successfully!' });
      } else {
        setMessage({ type: 'error', content: data.detail || 'Failed to change username' });
      }
    } catch (error) {
      setMessage({ type: 'error', content: 'An error occurred. Please try again.' });
    }
  };

  return (
    <div className="container mx-auto p-4 bg-[#121212] min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-4xl mx-auto bg-[#1F1F1F] text-[#E0E0E0]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#00BCD4]">User Settings</CardTitle>
            <CardDescription className="text-[#CDDC39]">Update your account information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-8">
            <form onSubmit={handlePasswordChange} className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-[#E0E0E0]">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-[#121212] border-[#00BCD4] text-[#E0E0E0] pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-[#00BCD4]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-[#E0E0E0]">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-[#121212] border-[#00BCD4] text-[#E0E0E0] pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-[#00BCD4]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#00BCD4] text-[#121212] hover:bg-[#CDDC39]">
                Change Password
              </Button>
            </form>
            <form onSubmit={handleUsernameChange} className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-username" className="text-[#E0E0E0]">New Username</Label>
                <Input
                  id="new-username"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-[#121212] border-[#00BCD4] text-[#E0E0E0]"
                />
              </div>
              <Button type="submit" className="w-full bg-[#00BCD4] text-[#121212] hover:bg-[#CDDC39]">
                Change Username
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            {message.content && (
              <Alert variant={message.type === 'error' ? "destructive" : "default"} className="w-full">
                {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                <AlertTitle>{message.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
                <AlertDescription>{message.content}</AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserSettings;
