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
  isActive?: boolean;
  done?: number;
}

export interface HabitItem {
  id: string;
  name: string;
  goal: number;
  amount: number;
  splits: SplitItem[];
  active: string[];
  isActive?: boolean;
  done?: number;
}

export interface SplitItem {
  goal: number;
  remainingMinutes: number;
  amount: number;
  done?: number;
}

export interface SyncData {
  focus: FocusItem[];
  habits: HabitItem[];
  lametric: {
    max: number;
    total: number;
    goal: number;
    displayBoth: boolean;
  };
  currentAmount: number;
  totalAmount: number;
  punishmentIsActive: boolean;
  lastNotified: number;
}