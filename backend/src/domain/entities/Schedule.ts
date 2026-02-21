export interface Schedule {
  id?: number;
  title: string;
  description?: string | null;
  startDateTime: Date;
  endDateTime: Date;
  location?: string | null;
  isAllDay?: boolean;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId: number;
}
