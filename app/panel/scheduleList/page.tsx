import ScheduleListView from './view/scheduleListView';
import { getAllSchedules } from './actions';
export const dynamic = 'force-dynamic';
export default async function Page() {
    const response = await getAllSchedules();
    const scheduleList = response.success ? Array.isArray(response.data) ? response.data : [] : [];
    return <ScheduleListView initialData={scheduleList} />
}