export interface ForestConfig {
  proxy: string;
  utcOffset: number;
  username: string;
  syncInterval: number;
  websiteDomain: string;
  passwordHash: string;
  accounts: Accounts;
  focus: FocusItem[];
  habits: HabitItem[];
  lametric: {
    pushUrl: string;
    token: string;
  },
  discord: {
    webhookUrl: string;
    message: {
      username: string;
      avatar: string;
      channel: string;
      website: string;
    }
  }
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
  goal: number;
  amount: number;
  splits: SplitItem[];
  active: string[];
  focused?: number;
}

export interface HabitItem {
  id: string;
  name: string;
  goal: number;
  amount: number;
  splits: SplitItem[];
  active: string[];
  done?: number | string;
}

export interface SplitItem {
  goal: number;
  remainingMinutes: number;
}

export interface SyncData {
  focus: FocusItem[];
  habits: HabitItem[];
  max: number;
  total: number;
  goal: number;
  displayBoth: boolean;
  punishmentIsActive: boolean;
  lastNotified: number;
  lastMorningNotified: number;
}