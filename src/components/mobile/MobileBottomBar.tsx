'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileBottomBar() {
  const pathname = usePathname();
  
  const navItems = [
    { label: 'Home', icon: 'home', path: '/' },
    { label: 'Shop', icon: 'storefront', path: '/products' },
    { label: 'Rewards', icon: 'redeem', path: '/rewards' },
    { label: 'About Us', icon: 'info', path: '/about' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2.5 bg-[#2C3E50] backdrop-blur-xl shadow-[0_-4px_30px_rgba(44,62,80,0.5)] rounded-t-2xl md:hidden border-t border-slate-700/40">
      {navItems.map((item) => {
        const isActive = pathname === item.path || (item.path === '/products' && pathname.startsWith('/products'));
        return (
          <Link 
            key={item.label}
            href={item.path}
            className={isActive 
              ? "flex flex-col items-center justify-center bg-[#c0e8ff] text-[#001e2b] rounded-full px-5 py-1.5 shadow-sm transition-all duration-200"
              : "flex flex-col items-center justify-center text-slate-300 hover:text-white transition-all duration-200 px-4 py-1"
            }
          >
            <span className="material-symbols-outlined text-[22px] mb-0.5" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
              {item.icon}
            </span>
            <span className="text-[11px] font-medium tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
