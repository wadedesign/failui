'use client';

import React from 'react';
import Sidebar from './Navbar';  // Adjust the import path as necessary

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default Layout;