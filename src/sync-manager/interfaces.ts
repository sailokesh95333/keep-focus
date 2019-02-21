export interface ForestConfig {
  proxy: string;
  utcOffset: number;
  amountToBePaid: string;
  twitterHandle: string;
  syncInterval: number;
  websiteDomain: string;
  accounts: Accounts;
  focus: FocusItem[];
  habits: HabitItem[];
}

export interface Accounts {
  forest: Account;
  habitify: Account;
}

export interface Account {
  username: string;
  password: string;
}

export interface FocusItem {
  id: number;
  name: string;
  goal: number | string;
  focused?: number | string;
}

export interface HabitItem {
  id: string;
  name: string;
  goal: number | string;
  done?: number | string;
}

export interface SyncData {
  focus: FocusItem[];
  habits: HabitItem[];
}