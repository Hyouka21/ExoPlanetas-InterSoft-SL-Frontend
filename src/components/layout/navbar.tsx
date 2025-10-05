'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Home, 
  Brain, 
  Upload, 
  BarChart3, 
  Info,
  Settings
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Classify', href: '/predict', icon: Brain },
  { name: 'Upload CSV', href: '/upload', icon: Upload },
  { name: 'Train', href: '/train', icon: Settings },
  { name: 'Model', href: '/model-info', icon: Info },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-galaxy-dark/95 backdrop-blur-sm border-b border-nasa-cyan/30 sticky top-0 z-50 space-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg bg-nasa-cyan/20 backdrop-blur-sm border border-nasa-cyan/50 space-glow">
                <Image 
                  src={`/interspace-img.png?v=${Date.now()}`} 
                  alt="ExoClassifier Logo" 
                  width={40} 
                  height={40}
                  className="w-full h-full object-cover"
                  style={{
                    clipPath: 'circle(50% at 50% 50%)',
                    objectPosition: 'center'
                  }}
                  priority
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-nasa-cyan to-nasa-blue bg-clip-text text-transparent text-glow">
                ExoClassifier
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 space-border',
                      isActive
                        ? 'bg-nasa-cyan/20 text-nasa-cyan space-glow'
                        : 'text-galaxy-primary hover:text-nasa-cyan hover:bg-nasa-cyan/10 hover:space-glow'
                    )}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-galaxy-primary hover:text-nasa-cyan space-border"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-galaxy-dark/95 border-t border-nasa-cyan/30 space-glow">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-300 space-border',
                    isActive
                      ? 'bg-nasa-cyan/20 text-nasa-cyan space-glow'
                      : 'text-galaxy-primary hover:text-nasa-cyan hover:bg-nasa-cyan/10 hover:space-glow'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
