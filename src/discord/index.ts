// import dependencies
import * as request from 'request-promise';
import { Logger, DebugLevel } from '../logger';

export default class Discord {
  private webhookUrl: string;
  private logger: Logger;

  constructor(webhookUrl: string) {
    // set up user options
    this.webhookUrl = webhookUrl;

    // set up logger
    this.logger = new Logger('discord');
  }

  public async sendMessage(body: any) : Promise<any> {
    // prepare request options
    const options = {
      uri: this.webhookUrl,
      method: 'POST',
      json: true,
      body
    };

    // make request
    return await request(options);
  }

  public async sendNotification(username: string, prize: string, channel: string, url: string, thumbnail: string) : Promise<void> {
    // prepare notification body
    let body = {
      username: 'Focus Tracker',
      avatar_url: 'https://zen-cdn.s3.amazonaws.com/assets/zen_logo.png',
      embeds: [{
        type: 'rich',
        title: `${username} is slacking!`.toUpperCase(),
        description: `${username} has failed to reach the daily focus and habit goals. Thus, the amount specified below will be raffled among all participants on the given channel.`,
        url,
        color: 16739693,
        footer: {
          text: `Focus Tracker | powered by zen | ${new Date().toISOString()}`,
          icon_url: 'https://zen-cdn.s3.amazonaws.com/assets/zen_logo.png'
        },
        thumbnail: {
          url: thumbnail
        },
        fields: [
          {
            name: 'Prize',
            value: prize,
            inline: true,
          },
          {
            name: 'Channel',
            value: channel,
            inline: true,
          }
        ]
      }]
    };

    // send notification
    try {
      await this.sendMessage(body);
    } catch (err) {
      this.logger.red('an error occurred trying to send webhook message');
      this.logger.red(err);
    }
    
  }
}
