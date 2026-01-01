import { redirect } from "next/navigation";
import { getProfessionalByIdAction } from "./actions";
import ProfessionalDetailsView from "./view/ProfessionalDetailsView";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    const response = await getProfessionalByIdAction(Number(id));
    if (!response.success || !response.data)
        return redirect('/dashboard/professionals');
    return <ProfessionalDetailsView initialProfessional={response.data} />;
}