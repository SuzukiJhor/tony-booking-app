'use client';
import Link from 'next/link';
import { signOut } from "next-auth/react"
import { usePathname } from 'next/navigation';
import { LogoTonySVG } from '@/assets/logoTonySVG';
import { LogOut, Calendar, Home, Settings, Users, BriefcaseMedical, CalendarCheck } from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', href: '/panel', icon: Home },
  { name: 'Calendário', href: '/panel/calendar', icon: Calendar },
  { name: 'Pacientes', href: '/panel/clients', icon: Users },
  { name: 'Dentistas', href: '/panel/professionals', icon: BriefcaseMedical },
  { name: 'Configurações', href: '/panel/settings', icon: Settings },
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
                  ? 'bg-indigo-100 font-semibold text-sky-500 dark:bg-sky-900/20'
                  : 'text-secondary hover:bg-gray-100 dark:text-gray-400 hover:dark:text-sky-500 hover:text-sky-500'
                }`}
            >
              <LinkIcon className="w-5 h-5 mr-3" />
              {link.name}
            </Link>
          );
        })}
        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
          <Link
            href="/panel/scheduleList"
            className={`flex items-center p-3 text-sm font-bold rounded-xl transition-all shadow-sm
              ${pathname === '/dashboard/scheduleList'
                ? 'bg-sky-600 text-white shadow-sky-200'
                : 'bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-900/20 dark:text-sky-400 dark:hover:bg-sky-900/30'
              }`}
          >
            <CalendarCheck className="w-5 h-5 mr-3" />
            Agendamentos
          </Link>
        </div>
      </nav>

      <button
        className="flex justify-center items-center w-full p-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer mt-4"
        onClick={() => signOut()}
      >
        <LogOut className="w-5 h-5 mr-3" />
        Sair
      </button>
    </div>
  );
}