import ClientsView from "./view/ClientsView";
import { getAllClientsAction } from "./actions";

export default async function ClientsPage() {
    const response = await getAllClientsAction();
    const clients = response.success ? Array.isArray(response.data) ? response.data : [] : [];
    return <ClientsView initialData={clients} />;
}