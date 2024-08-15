'use client';

import React from 'react';
import Sidebar from './Sidebar';  // Adjust the import path as necessary

const Layout = ({ children }) => {
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