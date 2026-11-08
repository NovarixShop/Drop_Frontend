'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Store, Package, Sparkles, Heart } from 'lucide-react';

export default function MobileBottomBar() {
  const pathname = usePathname();
  
  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Shop', icon: Store, path: '/products' },
    { label: 'Orders', icon: Package, path: '/orders' },
    { label: 'Rewards', icon: Sparkles, path: '/rewards' },
    { label: 'Wishlist', icon: Heart, path: '/wishlist' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-5 pt-2 bg-surface/90 backdrop-blur-2xl shadow-[0_-4px_25px_rgba(0,0,0,0.15)] rounded-t-2xl md:hidden border-t border-outline-variant/40">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.path ||
          (item.path !== '/' && pathname.startsWith(item.path));
        return (
          <Link 
            key={item.label}
            href={item.path}
            className={isActive 
              ? "flex flex-col items-center justify-center text-primary font-semibold py-1 px-2.5 transition-all duration-200"
              : "flex flex-col items-center justify-center text-on-surface-variant hover:text-on-surface py-1 px-2.5 transition-all duration-200"
            }
          >
            <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-primary/15 text-primary scale-105' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
