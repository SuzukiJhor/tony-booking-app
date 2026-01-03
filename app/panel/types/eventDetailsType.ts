import { EventFormProps } from "@ilamy/calendar";

export interface ExtendedEventFormProps extends EventFormProps {
  eventDetails?: {
    nome?: string;
    phone?: string;
    email?: string;
  };
}