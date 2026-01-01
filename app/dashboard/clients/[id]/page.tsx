import { redirect } from "next/navigation";
import { getClientByIdAction } from "./actions";
import ClientDetailsView from "./view/ClientDetailsVIew";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    const response = await getClientByIdAction(Number(id));
    if (!response.success || !response.data)
        return redirect('/dashboard/clients');
    return <ClientDetailsView initialPatient={response.data} />;
}