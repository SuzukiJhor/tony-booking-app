export interface CalendarEventType {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  backgroundColor?: string;
  color?: string;
}