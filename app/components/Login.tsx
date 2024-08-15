// app/components/Login.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter(); // Initialize the router for navigation

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://127.0.0.1:31948/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json'
        },
        body: new URLSearchParams({ username, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.access_token);  // Store the JWT in localStorage
        setSuccessMessage('Login successful!');
        router.push('/dashboard');  // Redirect to the dashboard page
      } else {
        setError(data.detail || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <Card className="w-[350px] bg-[#1F1F1F] border-[#00BCD4]">
        <CardHeader>
          <CardTitle className="text-[#E0E0E0] text-2xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#E0E0E0]">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Enter your username" 
                  className="bg-[#121212] text-[#E0E0E0] border-[#00BCD4]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#E0E0E0]">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password" 
                    className="bg-[#121212] text-[#E0E0E0] border-[#00BCD4] pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#00BCD4]"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {error && (
                <Alert variant="destructive" className="bg-[#FF9800] text-[#121212]">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {successMessage && (
                <Alert className="bg-[#CDDC39] text-[#121212]">
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full bg-[#00BCD4] hover:bg-[#CDDC39] text-[#121212]">
                Log in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
