'use client';


import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Settings, Menu, X, Telescope, LogsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState('');
  const pathname = usePathname();

  const menuItems = useMemo(() => [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Telescope, label: 'Configure', path: '/dashboard/config' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    { icon: LogsIcon, label: 'Logs', path: '/dashboard/logs' },
  ], []);

  useEffect(() => {
    const currentMenuItem = menuItems.find(item => item.path === pathname);
    if (currentMenuItem) {
      setActivePage(currentMenuItem.label);
    }
  }, [pathname, menuItems]);

  const toggleNavbar = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard">
                <span className="text-xl font-bold text-green-400">FailUI</span>
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activePage === item.label
                    ? 'bg-green-500 text-black'
                    : 'text-gray-300 hover:bg-gray-900 hover:text-green-400'
                }`}
                onClick={() => setActivePage(item.label)}
              >
                <item.icon className="inline-block mr-1" size={16} />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center sm:hidden">
            <Button variant="ghost" onClick={toggleNavbar} className="text-gray-300 hover:bg-gray-900">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sm:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    activePage === item.label
                      ? 'bg-green-500 text-black'
                      : 'text-gray-300 hover:bg-black hover:text-green-400'
                  }`}
                  onClick={() => {
                    setActivePage(item.label);
                    setIsOpen(false);
                  }}
                >
                  <item.icon className="inline-block mr-1" size={16} />
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;