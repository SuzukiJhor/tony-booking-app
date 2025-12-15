'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Calendar, Home, Settings, Users } from 'lucide-react';
import { signOut } from "next-auth/react"
import { LogoTonySVG } from '@/assets/logoTonySVG';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Calendário', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Pacientes', href: '/dashboard/clients', icon: Users },
  { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full border-r bg-background dark:bg-background-secondary p-4 w-54 fixed top-0 left-0">
      <div className="flex items-center justify-center mb-6 h-15">
        <LogoTonySVG className="text-sky-500 dark:text-sky-500" />
      </div>

      <nav className="grow space-y-2">
        {navLinks.map((link) => {
          const LinkIcon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center p-3 text-sm font-medium rounded-lg transition-colors 
                ${isActive
                  ? 'bg-indigo-100 font-semibold text-sky-500'
                  : 'text-secondary hover:bg-gray-100 hover:dark:text-sky-500 hover:text-chart-3 '
                }`}
            >
              <LinkIcon className="w-5 h-5 mr-3" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <button className="flex justify-center items-center w-full p-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" onClick={() => signOut()}>
        <LogOut className="w-5 h-5 mr-3" />
        Sair
      </button>
    </div>
  );
}