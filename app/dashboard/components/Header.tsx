export function Header() {
    return (
        <header className="sticky top-0 z-10 bg-white shadow-sm border-b p-4 flex justify-between items-center h-20">
            <h1 className="text-xl font-semibold text-gray-800">
                Bem-vindo(a), {'userName'}!
            </h1>
            {/* Aqui poderia ir um botão de Notificações, etc. */}
        </header>
    )
}