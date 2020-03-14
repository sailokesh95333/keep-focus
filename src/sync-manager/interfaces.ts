export interface ForestConfig {
  proxy: string;
  utcOffset: number;
  amountToBePaid: string;
  morningAmountToBePaid: string;
  totalAmountToBePaid: string;
  twitterHandle: string;
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
    remainingMinutes: number;
    remainingMorningMinutes: number;
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
  goal: number | string;
  morningGoal: number | string;
  focused?: number | string;
}

export interface HabitItem {
  id: string;
  name: string;
  goal: number | string;
  morningGoal: number | string;
  done?: number | string;
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