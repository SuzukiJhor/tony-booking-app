import NextTopLoader from 'nextjs-toploader';
import { Header } from './components/Header';
import SideNav from './components/SideNav';
import { NavigationUX } from './components/NavigationUX';
import { ClientProvider } from '../context/ClientsContext';

export default async function Layout({ children }: { children: React.ReactNode }) {


  return (
    <div className="flex h-screen bg-gray-50 dark:bg-background overflow-hidden">
      <SideNav />

      <div className="flex flex-col flex-1 lg:ml-54 min-w-0">
        <ClientProvider>

          <Header />

          <main className="flex-1 overflow-y-auto p-0">
            <NextTopLoader
              height={4}
              showSpinner={false}
              easing="ease"
              speed={350}
              color="#0EA5E9"
            />
            <NavigationUX>
              {children}
            </NavigationUX>
          </main>
        </ClientProvider>
      </div>
    </div>
  );
}