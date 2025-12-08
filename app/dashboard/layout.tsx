import { Header } from './components/Header';
import SideNav from './components/SideNav';

export default async function Layout({ children }: { children: React.ReactNode }) {
  
  // Opcional: Obter dados da sessão para exibição ou controle de acesso mais granular

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Menu Lateral Fixo */}
      <SideNav />
      
      {/* Conteúdo Principal */}
      <div className="grow ml-64 overflow-y-auto"> 
        
       <Header />
        
        {/* Conteúdo da Página (page.tsx ou sub-rotas) */}
        <main className="p-0">
          {children}
        </main>
      </div>
    </div>
  );
}