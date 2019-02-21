export interface Habits {
  [key: string]: Habit;
}

export interface Habit {
  name: string;
  priority: number;
  regularly: string;
  startDate: number;
  timeOfDay: number;
  id: string;
  dateCreated: number;
  isArchived: boolean;
  checkins: { [key: string]: number };
}