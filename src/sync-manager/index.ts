// import dependencies
import config from '../configuration';
import { ForestConfig, SyncData, HabitItem } from './interfaces';
import { Forest } from '../forest';
import { Habitify } from '../habitify';
import { LaMetric } from '../lametric';
import { Plant } from '../forest/interfaces';
import { getStartOfDay, getEndOfDay, getRemainingMinutesInDay, getTodaysDate, getWeekDay, arrayContains, getEndOfSplit, getNow } from '../utils';
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
        focus.done = 0;
        focus.splits.forEach(split => split.done = 0);
        return focus;
      }),
      habits: this.config.habits.map(habit => {
        habit.done = 0;
        habit.splits.forEach(split => split.done = 0);
        return habit;
      }),
      lametric: {
        max: parseInt(process.env.MAX_FOCUS) || 0,
        total: 0,
        goal: 0,
        displayBoth: true
      },
      currentAmount: 0,
      totalAmount: 0,
      punishmentIsActive: true,
      lastNotified: -1
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
    this.logger.blue('starting synchronization manager setup');
    
    // update is active
    this.updateIsActive();

    // update punishment
    this.updatePunishment();

    // login all services
    await Promise.all([this.forest.login(), this.habitify.login()]);
    this.logger.green('manager has been initialized and is ready to go');
  }

  public start() : void {
    this.logger.blue('starting synchronization manager');
    this.sync();  // immediately start the syncing task
    this.interval = setInterval(async () => {
      await this.sync();
    }, this.config.syncInterval);
  }

  public stop() : void {
    this.logger.blue('stopping synchronization manager');
    // clear interval
    clearInterval(this.interval);
  }

  private async sync() : Promise<void> {
    // ## sync focus entries
    this.logger.normal('syncing all focus goals');
    const ONE_WEEK_BACK = getNow() - 1000*60*60*24*14;
    const plants = await this.forest.getAllPlantsSince(ONE_WEEK_BACK);

    // start and end of day
    const startOfDay = getStartOfDay(this.config.utcOffset);
    const endOfDay = getEndOfDay(this.config.utcOffset);

    // initialize statistics for lametric and punishment
    const lametric = {
      total: 0,
      goal: 0
    }

    // update is active
    this.updateIsActive();
   
    // update all focus entries
    this.db.focus.forEach(focus => {
      if (focus.isActive) {
        // focus task is active today
        this.logger.normal(`${focus.name} is active today. iterating through all splits`, DebugLevel.DEV);
        
        // iterate through all splits
        focus.splits.forEach(split => {
          const endOfSplit = getEndOfSplit(this.config.utcOffset, split.remainingMinutes);
          split.done = this.calculateMinutesFromPlantsWithTag(plants, focus.id, startOfDay, endOfSplit);
        });
        
        // calculate total focus
        focus.done = this.calculateMinutesFromPlantsWithTag(plants, focus.id, startOfDay, endOfDay);
        
        // update lametric stats
        lametric.total += focus.done;
        lametric.goal += focus.goal;
      }
    });

    // ## update lametric stats
    // check if local max is greater than our max 
    this.db.lametric.total = lametric.total;
    this.db.lametric.goal = lametric.goal;
    if (lametric.total > this.db.lametric.max) this.db.lametric.max = lametric.total;

    // ## sync habit entries
    this.logger.normal('syncing all habit goals');
    const habits = await this.habitify.getAllHabits();
    
    const date = getTodaysDate(this.config.utcOffset, endOfDay);
    this.db.habits.forEach(habit => {
      if (habit.isActive) {
        // habit task is active today
        this.logger.normal(`${habit.name} is active today. iterating through all splits`, DebugLevel.DEV);

        // calculate number of done habits
        const item = habits[habit.id];
        habit.done = this.calculateNumberOfDoneHabit(item, [date]);

        // determine which habits completed in time and update done habits
        this.updateSplits(habit);
      }
    });

    // update punishment
    this.updatePunishment();

    this.logger.green('successfully synced all focus and habit goals...');

    // ## push out discord message if needed
    this.pushDiscord();

    // ## update LaMetric app
    this.pushLametric();
  }

  private updatePunishment() : void {
    const punishment = {
      total: 0,
      current: 0
    };

    // iterate through focus goals
    this.db.focus.forEach(focus => {
      if (focus.isActive) {
        punishment.total += focus.amount;
        if (focus.goal > focus.done) punishment.current += focus.amount;
        focus.splits.forEach(split => {
          punishment.total += split.amount;
          if (split.goal > split.done) punishment.current += split.amount;
        });
      }
    });

    // iterate through habit goals
    this.db.habits.forEach(habit => {
      if (habit.isActive) {
        punishment.total += habit.amount;
        if (habit.goal > habit.done) punishment.current += habit.amount;
        habit.splits.forEach(split => {
          punishment.total += split.amount;
          if (split.goal > split.done) punishment.current += split.amount;
        });
      }
    });

    // update punishment
    this.db.totalAmount = punishment.total;
    this.db.currentAmount = punishment.current;
  }

  private updateIsActive() : void {
    const weekDay = getWeekDay(this.config.utcOffset);
    
    // update focus goals
    this.db.focus.forEach(focus => {
      focus.isActive = arrayContains(focus.active, weekDay);
    });

    // update habit goals
    this.db.habits.forEach(habit => {
      habit.isActive = arrayContains(habit.active, weekDay);
    });
  }

  private updateSplits(habit: HabitItem) : void {
    // iterate through all splits and update habites completion
    const now = getNow();
    habit.splits.forEach(split => {
      const endOfSplit = getEndOfSplit(this.config.utcOffset, split.remainingMinutes);
      if (now <= endOfSplit) {
        // the deadline for this split has not passed yet
        split.done = habit.done;
      }
    });
  }

  private calculateNumberOfDoneHabit(habit: Habit, dates: string[]) : number {
    let done = 0;

    // check if habit is existing
    if (!habit || !habit.checkins) {
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

  public async pushLametric() : Promise<void> {
    // update LaMetric app
    await this.lametric.push(this.db);
  }

  public async pushDiscord() : Promise<void> {
    // send discord message if needed
    let isEndOfDay = (getRemainingMinutesInDay(this.config.utcOffset) <= 1) ? true : false;

    if (this.db.punishmentIsActive && isEndOfDay) {
      this.discord.sendNotification(this.config.discord.message.username, this.db.currentAmount, this.config.discord.message.channel, this.config.discord.message.website, this.config.discord.message.avatar, 'daily focus and habit goals');
    }
  }

}

// export singleton manager
export let manager = new SyncManager(CONFIG);