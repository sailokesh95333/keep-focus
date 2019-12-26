// import dependencies
import * as moment from 'moment';
import config from '../configuration';
import { ForestConfig, SyncData } from './interfaces';
import { Forest } from '../forest';
import { Habitify } from '../habitify';
import { LaMetric } from '../lametric';
import { Plant } from '../forest/interfaces';
import { getStartOfWeek, getEndOfWeek, getStartOfDay, getEndOfDay, getWeekDatesList, getTodayDatesList } from '../utils';
import { Logger, DebugLevel } from '../logger';
import { Habit } from '../habitify/interfaces';
import Discord from '../discord';

// get global configuration from json file
const CONFIG = config.get('settings');

class SyncManager {
  public config: ForestConfig;
  public db: SyncData;
  private forest: Forest;
  private habitify: Habitify;
  private lametric: LaMetric;
  private discord: Discord;
  private interval: NodeJS.Timer;
  private logger: Logger;
  
  constructor(config: ForestConfig) {
    this.config = config;
    this.db = {
      focus: this.config.focus.map(focus => {
        focus.focused = 0;
        return focus;
      }),
      habits: this.config.habits.map(habit => {
        habit.done = 0;
        return habit;
      }),
      max: parseInt(process.env.MAX_FOCUS) || 0,
      total: 0,
      goal: 0,
      displayBoth: true,
      punishmentIsActive: true,
      lastNotified: -1,
      lastMorningNotified: -1
    };

    // set up clients
    this.forest = new Forest(this.config.accounts.forest.username, this.config.accounts.forest.password, null, null, this.config.proxy);
    this.habitify = new Habitify(this.config.accounts.habitify.username, this.config.accounts.habitify.password);
    this.lametric = new LaMetric(this.config.lametric.pushUrl, this.config.lametric.token);
    this.discord = new Discord(this.config.discord.webhookUrl);
    
    // set up logger
    this.logger = new Logger('sync-manager');
  }

  public async setup() : Promise<void> {
    // login all services
    await Promise.all([this.forest.login(), this.habitify.login()]);
    this.logger.green('manager has been initialized and is ready to go');
  }

  public start() : void {
    this.sync();  // immediately start the syncing task
    this.interval = setInterval(async () => {
      await this.sync();
    }, this.config.syncInterval);
  }

  public async pushLametric() : Promise<void> {
    // ## update LaMetric app
    await this.lametric.push(this.db);
  }

  public async pushDiscord() : Promise<void> {
    // send discord message if needed
    let isEndOfDay = (this.getRemainingMinutes() <= this.config.discord.remainingMinutes) ? true : false;
    let isEndOfMorning = (this.getRemainingMinutes() <= this.config.discord.remainingMorningMinutes) ? true : false;
    let hasReachedGoals = true;
    let hasReachedMorningGoals = true;
    
    // check focus goals
    this.db.focus.forEach((it) => {
      if (it.focused < it.goal) hasReachedGoals = false;
      if (it.focused < it.morningGoal) hasReachedMorningGoals = false;
    });

    // check habit goals
    this.db.habits.forEach((it) => {
      if (it.done < it.goal) hasReachedGoals = false;
      if (it.done < it.morningGoal) hasReachedMorningGoals = false;
    });

    // check daily habits
    const lastNotified = getEndOfDay(this.config.utcOffset);
    if (isEndOfDay && !hasReachedGoals && this.db.lastNotified !== lastNotified) {
      this.db.lastNotified = lastNotified;
      this.logger.red('user has not reached daily goals...');
      if (this.db.punishmentIsActive) {
        this.discord.sendNotification(this.config.discord.message.username, this.config.amountToBePaid, this.config.discord.message.channel, this.config.discord.message.website, this.config.discord.message.avatar, 'daily focus and habit goals');
      }
    }

    // check morning habits
    if (isEndOfMorning && !hasReachedMorningGoals && this.db.lastMorningNotified !== lastNotified) {
      this.db.lastMorningNotified = lastNotified;
      this.logger.red('user has not reached morning goals...');
      if (this.db.punishmentIsActive) {
        this.discord.sendNotification(this.config.discord.message.username, this.config.morningAmountToBePaid, this.config.discord.message.channel, this.config.discord.message.website, this.config.discord.message.avatar, 'morning focus and habit goals');
      }
    }
  }

  public stop() : void {
    // clear interval
    clearInterval(this.interval);
  }

  public getRemainingMinutes() : number {
    let end = moment().endOf('day').add(-1*this.config.utcOffset, 'hours');
    let start = moment();
    let duration = moment.duration(end.diff(start));
    return Math.ceil(duration.asMinutes());
  }

  private async sync() : Promise<void> {
    // ## sync focus entries
    this.logger.normal('syncing all focus goals');
    const TWO_WEEKS_BACK = moment().valueOf() - 1000*60*60*24*14;
    const plants = await this.forest.getAllPlantsSince(TWO_WEEKS_BACK);

    // start and end of week
    const startOfWeek = getStartOfDay(this.config.utcOffset);
    const endOfWeek = getEndOfDay(this.config.utcOffset);

    // update all focus entries
    let total = 0;
    let goal = 0;
    this.db.focus.forEach(focus => {
      focus.focused = this.calculateMinutesFromPlantsWithTag(plants, focus.id, startOfWeek, endOfWeek);
      total += focus.focused;
      goal += focus.goal as number;
    });

    // check if local max is greater than our max
    this.db.total = total;
    this.db.goal = goal;
    if (total > this.db.max) this.db.max = total;

    // ## sync habit entries
    this.logger.normal('syncing all habit goals');
    const habits = await this.habitify.getAllHabits();
    
    let dates = getTodayDatesList(this.config.utcOffset, startOfWeek, endOfWeek);
    this.db.habits.forEach(item => {
      const habit = habits[item.id];
      item.done = this.calculateNumberOfDoneHabit(habit, dates);
    });

    this.logger.green('successfully synced all focus and habit goals...');

    // ## push out discord message if needed
    this.pushDiscord();

    // ## update LaMetric app
    this.pushLametric();
  }

  private calculateNumberOfDoneHabit(habit: Habit, dates: string[]) : number {
    let done = 0;

    // check if habit is existing
    if (!habit) {
      return 0;
    }

    // check how many habits have been done
    dates.forEach(date => {
      if (habit.checkins[date] && habit.checkins[date] === 2) {
        done++;
      }
    });

    return done;
  }

  private calculateMinutesFromPlantsWithTag(plants: Plant[], tag: number, start: number, end: number) : number {
    let minutes = 0; 
    // go through each planted tree and check whether it fits the scheme
    plants.forEach(plant => {
      const startTime = this.fromISOtoUnix(plant.start_time);
      const endTime = this.fromISOtoUnix(plant.end_time);
      if (plant.tag === tag && plant.is_success && !plant.cheating && startTime >= start && endTime <= end) {
        minutes += (endTime - startTime) / (1000*60);
      }
    });
    return minutes;
  }

  private fromISOtoUnix(iso: string) : number {
    return new Date(iso).getTime();
  }
}

// export singleton manager
export let manager = new SyncManager(CONFIG);