// app/components/FailSettings.tsx

'use client';

import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import Install from '../components/Install'
import Password from '../components/Password'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';

const FailSettingsComp: React.FC = () => {
  const { toast } = useToast();

  const getToken = () => localStorage.getItem('token');

  return (
    <div className="container mx-auto p-4 bg-black min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-4xl mx-auto bg-[#1F1F1F] text-green-400">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-400">Fail2Ban Settings</CardTitle>
            <CardDescription className="text-[#CDDC39]">Manage your Fail2Ban installation and configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Install getToken={getToken} toast={toast} />
            <Password getToken={getToken} toast={toast} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FailSettingsComp;