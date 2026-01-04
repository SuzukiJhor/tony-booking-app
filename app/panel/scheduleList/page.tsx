'use server';

import ScheduleListView from './view/scheduleListView';
import { getAllSchedules } from './actions';

export default async function page() {
    const response = await getAllSchedules();
    const scheduleList = response.success ? Array.isArray(response.data) ? response.data : [] : [];
    return <ScheduleListView initialData={scheduleList} />
}