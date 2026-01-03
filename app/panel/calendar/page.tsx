import CalendarView from "./view/CalendarVIew";
import { getAllSchedules } from "./actions";

export default async function Page() {
    const response = await getAllSchedules();
    const professionals = response.success ? Array.isArray(response.data) ? response.data : [] : [];
    return <CalendarView initialData={professionals} />;
}