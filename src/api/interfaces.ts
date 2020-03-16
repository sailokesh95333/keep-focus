export interface StatusResponse {
  utcOffset: number;
  username: string;
  websiteDomain: string;
  remainingTime: string;
  punishmentIsActive: boolean;
  totalAmount: number;
  currentAmount: number;
  focus: ItemResponse[];
  habits: ItemResponse[];
}

export interface ItemResponse {
  id: number | string;
  name: string;
  amount: number;
  goal: string;
  done: string;
  finishedBefore: string;
}