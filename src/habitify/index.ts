// import dependencies
import * as firebase from 'firebase';
import { Habits, Habit } from './interfaces';
import { Logger, DebugLevel } from '../logger';

export class Habitify {
  private static readonly API_KEY = 'AIzaSyC59I9R2HItCNkdIz5SSx6vK6y36mamHSk';
  private static readonly AUTH_DOMAIN = 'habitify.firebaseapp.com';
  private static readonly DATABASE_URL = 'https://habitify.firebaseio.com';
  private static readonly PROJECT_ID = 'habitify';
  private static readonly STORAGE_BUCKET = 'project-8491986773398252429.appspot.com';
  private static readonly GCM_SENDER = '51819855588';

  private username: string;
  private password: string;
  private userId: string;
  private app: firebase.app.App;
  private logger: Logger;
  
  constructor(username: string, password: string) {
    // set username and password
    this.username = username;
    this.password = password;
    
    // initialize habitify firebase app
    this.app = firebase.initializeApp({
      apiKey: Habitify.API_KEY,
      authDomain: Habitify.AUTH_DOMAIN,
      databaseURL: Habitify.DATABASE_URL,
      projectId: Habitify.PROJECT_ID,
      storageBucket: Habitify.STORAGE_BUCKET,
      messagingSenderId: Habitify.GCM_SENDER
    });

    this.logger = new Logger('firebase');
  }

  public async login() : Promise<void> {
    // check if refresh token was providen
    if (!this.username || !this.password) {
      throw new Error('the username or password has not been specified');
    }

    // sign in user with database
    this.logger.normal(`trying to log in user ${this.username}`);
    await firebase.auth().signInWithEmailAndPassword(this.username, this.password)
      .catch(err => {
        this.logger.red(JSON.stringify(err));
        throw new Error('the user could not be logged in');
      });
    
    this.userId = firebase.auth().currentUser.uid;
    this.logger.green(`successfully logged in user with user id ${this.userId}`);
  }

  public async disconnect() : Promise<void> {
    this.app = null;
    firebase.app().delete();
  }

  public async getAllHabits() : Promise<Habits> {
    this.requireUserLoggedIn();

    // fetch all habits from the database
    this.logger.normal(`fetching all habits for user ${this.userId}`);
    let habitRef = firebase.database().ref(`habits/${this.userId}`);
    let snapshot = await habitRef.once('value');

    // add habits to array
    let habits : Habits = {};
    snapshot.forEach(item => {
      // transform habit to specified format
      let habit = item.val();
      habit.id = item.key;
      habits[habit.id] = habit;
    });

    this.logger.green(`found ${snapshot.numChildren()} total habits`);
    return habits;
  }

  private requireUserLoggedIn() : void {
    if (!this.userId) {
      throw new Error('the user is not logged in');
    }
  }
}