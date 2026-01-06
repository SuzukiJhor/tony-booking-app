import ProfessionalsView from "./view/ProfessionalsView";
import { getAllProfessionalsAction } from "./actions";
export const dynamic = 'force-dynamic';
export default async function Page() {
    const response = await getAllProfessionalsAction();
    const professionals = response.success ? Array.isArray(response.data) ? response.data : [] : [];
    return <ProfessionalsView initialData={professionals} />;
}