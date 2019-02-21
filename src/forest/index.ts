// import dependencies
import * as request from 'request-promise';
import { AuthResponse, UpdatedPlantsResponse, Plant, UpdatedTagsResponse, Tag } from './interfaces';
import { Logger, DebugLevel } from '../logger';

export class Forest {
  private static readonly API_AUTH_BASE = 'https://c88fef96.forestapp.cc/api/v1';

  private username: string;
  private password: string;
  private userId: number;
  private rememberToken: string;
  private proxy: string;
  private logger: Logger;
  
  constructor(username?: string, password?: string, userId?: number, rememberToken?: string, proxy?: string) {
    this.username = username;
    this.password = password;
    this.userId = userId;
    this.rememberToken = rememberToken;
    this.proxy = proxy;

    this.logger = new Logger('forest');
  }

  public async login() : Promise<void> {
    // check if refresh token was providen
    if (!this.username || !this.password) {
      throw new Error('the username or password has not been specified');
    }

    // make the login request
    this.logger.normal(`trying to log in user ${this.username}`);
    let response : AuthResponse = await this.makeRequest({
      uri: this.buildUrl('/sessions'),
      method: 'POST',
      body: {
        session: {
          email: this.username,
          password: this.password
        },
        seekruid: ''
      }
    }).catch(err => {
      this.logger.red(JSON.stringify(err));
      throw new Error('the user could not be logged in');
    });

    // check if password was correct
    if (!response.remember_token) {
      throw new Error('an unknown error occurred trying to log in the user');
    }

    // extract access token
    this.rememberToken = response.remember_token;
    this.userId = response.user_id;
    this.logger.green(`successfully logged in user with remember_token ${this.rememberToken}`);
  }

  public async getAllTags() : Promise<Tag[]> {
    this.requireUserLoggedIn();

    // fetch all tags from the database
    this.logger.normal(`fetching all tags for user ${this.userId}`);
    let response : UpdatedTagsResponse = await this.makeRequest({
      uri: this.buildUrl('/tags'),
      qs: {
        update_since: encodeURI('2005-01-01T00:00:00.000+00:00')
      },
      method: 'GET'
    });

    // check if valid format
    if (!response.update_since) {
      throw new Error('an unknown error occurred trying to fetch all tags');
    }

    // return tags that we found
    this.logger.green(`found ${response.tags.length} total planted tags`);
    return response.tags;
  }

  public async getAllPlantsSince(unix: number) : Promise<Plant[]> {
    return this.getAllPlantsSinceForest(this.fromUnixToForest(unix));
  }

  private async getAllPlantsSinceForest(forestTimestamp: string) : Promise<Plant[]> {
    this.requireUserLoggedIn();

    // fetch all plants from the database
    this.logger.normal(`fetching all plants for user ${this.userId} since ${forestTimestamp}`);
    let response : UpdatedPlantsResponse = await this.makeRequest({
      uri: this.buildUrl('/plants/updated_plants'),
      qs: {
        update_since: encodeURI(forestTimestamp)
      },
      method: 'GET'
    });

    // check if valid format
    if (!response.timestamp) {
      throw new Error('an unknown error occurred trying to fetch all plants');
    }

    // return plants that we found
    this.logger.green(`found ${response.plants.length} total planted plants since ${forestTimestamp}`);
    return response.plants;
  }

  private requireUserLoggedIn() : void {
    if (!this.rememberToken || !this.userId) {
      throw new Error('the user is not logged in');
    }
  }

  public fromUnixToForest(unix: number) : string {
    let iso = new Date(unix).toISOString();
    return iso.substring(0, iso.length - 1) + '+00:00';
  }

  private buildUrl(path: string) : string {
    return Forest.API_AUTH_BASE + path;
  }

  private makeRequest(options: request.OptionsWithUri) : request.RequestPromise {
     // modify and add required headers
    options.json = true;
    options.proxy = this.proxy;
    options.headers = options.headers || {};
    options.headers['User-Agent'] = 'Forest/338 (iPhone; iOS 12.0; Scale/2.00)';
    
    // check if user is logged in
    if (this.rememberToken && this.userId) {
      // add query string
      if (!options.qs) options.qs = {};
      options.qs['seekruid'] = this.userId;

      // set auth cookie
      options.headers['Cookie'] = 'remember_token=' + this.rememberToken;
    }
    
    // make request
    return request(options);
  }
}