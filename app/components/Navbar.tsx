// app/components/Navbar.tsx

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Home, Settings, Menu, Telescope, Activity, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SubItem {
  label: string;
  path: string;
}

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path?: string;
  subItems?: SubItem[];
}

const Navbar = () => {
  const [activePage, setActivePage] = useState('');
  const pathname = usePathname();

  const menuItems: MenuItem[] = useMemo(() => [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    {
      icon: Telescope,
      label: 'Configure',
      subItems: [
        { label: 'jail.local', path: '/dashboard/config' },
        { label: 'jails', path: '/dashboard/jail' }
      ],
    },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    { icon: Activity, label: 'Logs', path: '/dashboard/logs' },
  ], []);

  useEffect(() => {
    const currentMenuItem = menuItems.find(item => 
      item.path === pathname || item.subItems?.some(subItem => subItem.path === pathname)
    );
    if (currentMenuItem) {
      setActivePage(currentMenuItem.label);
    }
  }, [pathname, menuItems]);

  const NavItem = ({ item }: { item: MenuItem }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {item.subItems ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={`w-full justify-start ${
              activePage === item.label
                ? 'bg-green-500 text-black'
                : 'text-gray-300 hover:bg-gray-800 hover:text-green-400'
            }`}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {item.subItems.map((subItem) => (
              <DropdownMenuItem key={subItem.path}>
                <Link href={subItem.path} className="w-full">
                  {subItem.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href={item.path!}>
          <Button variant="ghost" className={`w-full justify-start ${
            activePage === item.label
              ? 'bg-green-500 text-black'
              : 'text-gray-300 hover:bg-gray-800 hover:text-green-400'
          }`}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        </Link>
      )}
    </motion.div>
  );

  return (
    <nav className="bg-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <motion.div 
              className="flex-shrink-0 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/dashboard">
                <span className="text-2xl font-bold text-green-400">FailUI</span>
              </Link>
            </motion.div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-1">
            {menuItems.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </div>
          <div className="flex items-center sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-gray-300 hover:bg-gray-800">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gray-900">
                <SheetHeader>
                  <SheetTitle className="text-green-400">Menu</SheetTitle>
                  <SheetDescription className="text-gray-400">
                    Navigate through FailUI
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-1">
                  {menuItems.map((item) => (
                    <NavItem key={item.label} item={item} />
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
