import NextTopLoader from 'nextjs-toploader';
import { Header } from './components/Header';
import SideNav from './components/SideNav';
import { NavigationUX } from './components/NavigationUX';
import { CalendarProvider } from '../context/CalendarContext';
import { ClientProvider } from '../context/ClientsContext';

export default async function Layout({ children }: { children: React.ReactNode }) {

  // Opcional: Obter dados da sessão para exibição ou controle de acesso mais granular

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-background">

      {/* Menu Lateral Fixo */}
      <SideNav />

      {/* Conteúdo Principal */}
      <div className="grow ml-64 overflow-y-auto">

        <Header />

        {/* Conteúdo da Página (page.tsx ou sub-rotas) */}
        <main className="p-0">
          <NextTopLoader
            height={4}
            showSpinner={false}
            easing="ease"
            speed={350}
            color="var(--color-primary)"
          />
          <NavigationUX>
            <CalendarProvider>
              <ClientProvider>
                {children}
              </ClientProvider>
            </CalendarProvider>
          </NavigationUX>
        </main>
      </div>
    </div>
  );
}