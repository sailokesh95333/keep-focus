// import dependencies
import * as moment from 'moment';
import config from '../configuration';
import { ForestConfig, SyncData } from './interfaces';
import { Forest } from '../forest';
import { Habitify } from '../habitify';
import { Plant } from '../forest/interfaces';
import { getStartOfWeek, getEndOfWeek, getWeekDatesList } from '../utils';
import { Logger, DebugLevel } from '../logger';
import { Habit } from '../habitify/interfaces';

// get global configuration from json file
const CONFIG = config.get('settings');

class SyncManager {
  public config: ForestConfig;
  public db: SyncData;
  private forest: Forest;
  private habitify: Habitify;
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
      })
    };

    // set up clients
    this.forest = new Forest(this.config.accounts.forest.username, this.config.accounts.forest.password, null, null, this.config.proxy);
    this.habitify = new Habitify(this.config.accounts.habitify.username, this.config.accounts.habitify.password);
    
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

  public stop() : void {
    // clear interval
    clearInterval(this.interval);
  }

  public getRemainingMinutes() : number {
    let start = moment().endOf('week').add(1, 'days').utcOffset(this.config.utcOffset);
    let end = moment().utcOffset(this.config.utcOffset);
    let duration = moment.duration(start.diff(end));
    return Math.ceil(duration.asMinutes());
  }

  private async sync() : Promise<void> {
    // ## sync focus entries
    this.logger.normal('syncing all focus goals');
    const TWO_WEEKS_BACK = moment().valueOf() - 1000*60*60*24*14;
    const plants = await this.forest.getAllPlantsSince(TWO_WEEKS_BACK);

    // LMAO wtf am i doing
    

    // lol wat

    // start and end of week
    const startOfWeek = getStartOfWeek(this.config.utcOffset);
    const endOfWeek = getEndOfWeek(this.config.utcOffset);

    // update all focus entries
    this.db.focus.forEach(focus => {
      focus.focused = this.calculateMinutesFromPlantsWithTag(plants, focus.id, startOfWeek, endOfWeek);
    });

    // ## sync habit entries
    this.logger.normal('syncing all habit goals');
    const habits = await this.habitify.getAllHabits();
    
    let dates = getWeekDatesList(this.config.utcOffset, startOfWeek, endOfWeek);
    this.db.habits.forEach(item => {
      const habit = habits[item.id];
      item.done = this.calculateNumberOfDoneHabit(habit, dates);
    });

    this.logger.green('successfully synced all focus and habit goals...');
  }

  private calculateNumberOfDoneHabit(habit: Habit, dates: string[]) : number {
    let done = 0;

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