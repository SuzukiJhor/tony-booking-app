'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Calendar, Home, Settings, Users } from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Calendário', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Pacientes', href: '/dashboard/patients', icon: Users },
  { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full border-r bg-background p-4 w-64 fixed top-0 left-0">
      <div className="flex items-center justify-center mb-6 h-20">
        <h1 className="text-2xl font-extrabold text-primary">Tony</h1>
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
                  ? 'bg-indigo-100 text-primary font-semibold'
                  : 'text-secondary hover:bg-gray-100'
                }`}
            >
              <LinkIcon className="w-5 h-5 mr-3" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <form
        action={async () =>
          console.log('botão de deslogar!')}
        className="mt-auto pt-4 border-t"
      >
        <button className="flex items-center w-full p-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </button>
      </form>
    </div>
  );
}