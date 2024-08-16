// app/components/View.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Save, Edit, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const Fail2BanConfigEditor = () => {
  const [config, setConfig] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:31948/fail2ban/view-jail-config?file=local');
      if (!response.ok) {
        throw new Error('Failed to fetch Fail2Ban configuration');
      }
      const data = await response.text();
      setConfig(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async () => {
    try {
      const response = await fetch('http://127.0.0.1:31948/fail2ban/edit-jail-config?file=local', {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: config,
      });
      if (!response.ok) {
        throw new Error('Failed to save Fail2Ban configuration');
      }
      setSaveStatus('Configuration saved successfully');
      setIsEditing(false);
    } catch (err) {
      if (err instanceof Error) {
        setSaveStatus(`Error saving configuration: ${err.message}`);
      } else {
        setSaveStatus('An unknown error occurred while saving');
      }
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-8 bg-black text-green-100 border border-green-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">Loading Fail2Ban configuration...</div>
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

  return (
    <Card className="mt-8 bg-black text-green-100 border border-green-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-green-400">
          <span>fail.local edit conf</span>
          {isEditing ? (
            <div>
              <Button onClick={saveConfig} className="mr-2 bg-green-700 hover:bg-green-600 text-green-100">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} className="bg-red-700 hover:bg-red-600 text-green-100">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-green-700 hover:bg-green-600 text-green-100">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {saveStatus && (
          <Alert 
            variant={saveStatus.includes('Error') ? "destructive" : "default"} 
            className={saveStatus.includes('Error') ? "bg-red-900 text-green-100 border border-red-700" : "bg-green-900 text-green-100 border border-green-400"}
          >
            <AlertTitle>{saveStatus.includes('Error') ? 'Error' : 'Success'}</AlertTitle>
            <AlertDescription>{saveStatus}</AlertDescription>
          </Alert>
        )}
        <Textarea
          value={config}
          onChange={(e) => setConfig(e.target.value)}
          disabled={!isEditing}
          className="min-h-[400px] bg-gray-900 text-green-100 border-green-700 focus:border-green-400"
        />
      </CardContent>
    </Card>
  );
};

export default Fail2BanConfigEditor;
