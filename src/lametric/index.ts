// import dependencies
import * as request from 'request-promise';
import { Logger, DebugLevel } from '../logger';
import { SyncData } from '../sync-manager/interfaces';

export class LaMetric {
  private pushUrl: string;
  private token: string;
  private proxy: string;
  private logger: Logger;
  
  constructor(pushUrl: string, token: string, proxy?: string) {
    // set username and password
    this.pushUrl = pushUrl;
    this.token = token;
    this.proxy = proxy;

    this.logger = new Logger('lametric');
  }

  public async push(data: SyncData) : Promise<void> {
    // check if refresh token was providen
    if (!this.pushUrl || !this.token) {
      this.logger.red('the pushUrl or token has not been specified. omitting pushing to device!');
      return;
    }

    // create the payload
    let payload : any = {
      uri: this.pushUrl,
      method: 'POST',
      body: {
        frames: [
          {
            goalData: {
              start: 0,
              current: data.lametric.total,
              end: data.lametric.goal,
              unit: ' MIN'
            },
            icon: 'a23334',
            index: 0
          }
        ]
      }
    };

    // check if we should display both
    if (data.lametric.displayBoth) {
      payload.body.frames.push({
        text: data.lametric.max + ' MIN',
        icon: 'a2867',
        index: 1
      });
    }

    // make the push request
    this.logger.normal(`pushing out new data to LaMetric (total: ${data.lametric.total}; highscore: ${data.lametric.max})`);
    await this.makeRequest(payload).catch(err => {
      this.logger.red(JSON.stringify(err));
      throw new Error('there was an error pushing the data to LaMetric');
    });
  }



  private makeRequest(options: request.OptionsWithUri) : request.RequestPromise {
    // modify and add required headers
    options.json = true;
    options.proxy = this.proxy;
    options.headers = options.headers || {};
    options.headers['X-Access-Token'] = this.token;
      
    // make request
    return request(options);
  }
}