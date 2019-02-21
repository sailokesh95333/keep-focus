import { HabitItem, FocusItem } from '../sync-manager/interfaces';

export interface StatusResponse {
  utcOffset: number;
  amountToBePaid: string;
  twitterHandle: string;
  websiteDomain: string;
  remainingTime: string;
  focus: FocusItem[]
  habits: HabitItem[]
}