<p align="center"><a href="https://sady.keepfocus.xyz" title="keepfocus.xyz"><img src="https://github.com/nicohaenggi/keep-focus/tree/master/docs/keepfocus-demo.png" alt="keepfocus.xyz"></a></p>

# KeepFocus

[![Status](https://img.shields.io/github/last-commit/nicohaenggi/keep-focus.svg?style=flat-square)](https://github.com/nicohaenggi/keep-focus/commits/master)
[![GitHub Issues](https://img.shields.io/github/issues/nicohaenggi/keep-focus.svg?style=flat-square)](https://github.com/nicohaenggi/keep-focus/issues)
[![License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square)](https://github.com/nicohaenggi/keep-focus/blob/master/LICENSE)
[![Version](https://img.shields.io/github/v/release/nicohaenggi/dotfiles.svg?style=flat-square)](https://github.com/nicohaenggi/dotfiles/releases)

**KeepFocus** is a modern focus and habit tracker with one main goal: *Building habits and meeting focus goals*. Be it morning meditation, daily runs or even a daily study goal - all achievable with the help of KeepFocus. Head over to [sady.keepfocus.xyz](https://sady.keepfocus.xyz) for a live demo.

_Contributions, feature requests and bug reports are always welcome. Be sure to head over to [Contributing](#contributing) for a detailed guide on how to contribute._

## Table of Contents

- [Features](#key-features)
- [Setup](#setup)
- [API](#api)
- [Limitations](#api)
- [Contributing](#contributing)

## Features

First of all, **KeepFocus** is free to use and completely open source, so you can deploy it on your own servers and make changes as you wish. In order to provide the focus goals and habit tracking, KeepFocus relies on two well known third-party apps available for both _Android_ and _iOS_. To track the focus goals, KeepFocus uses the [Forest](https://www.forestapp.cc/) app. To enable Habit Tracking, we use [Habitify](https://www.habitify.me/). 

### General

Every habit or focus goal consists of a few important properties, as listed below.
  - ***daily focus*** or ***habit goal***: e.g. studying for 40 minutes or meditating twice daily
  - ***active weekdays***: e.g. the goal is only active on Mondays, Tuesdays and Thursdays.
  - ***punishment***: e.g. setting a punishment of $20 for a specific goal will result in a punishment of $20 at the end of the day.

### Split Goals

For every habit or focus goal, you can define so called ***split goals***. They allow you to set certain milestones that you have to reach during the day. In addition, each split goal comes with a defined punishment. For instance, you can set a study split goal of 2 hours before 2pm. Whenever you fail to reach your split goal before 2pm, you will pay the respective punishment for this specific split goal.

### Cheat Days

Everyone needs days off. Because of that, it's possible to disable KeepFocus for a certain time. But in order to make sure that you don't trick yourself into not working at all and disabling KeepFocus at all times, you can make a loved one set a password for you and make them disable KeepFocus whenever you are taking an (unexpected) day off.

### Punishment

At the end of every day, KeepFocus will add all the punishments of the failed habit or focus goal together and report it in a Discord channel. In the current setting, this amount will then be raffled among all KeepFocus Discord users, but you can change this part to your liking, e.g. donating the money to a charity.

### Additional Features

In addition, KeepFocus offers the following features:

- ***NFC habit goals***: NFC habit goals can be achieved by scanning a NFC tag. This allows you to make sure that you are in a specific location at a specific time. For instance, you can place a NFC tag in the forest and thus force yourself to take a daily run by scanning the respective NFC tag. Otherwise identicla feature wise to the *habit goals*.
- ***LaMetric Time App***: KeepFocus also has a *LaMetric Time* App that shows you the current progress of the day, along with a highscore widget displaying your most productive day focus-wise.
- Supports all timezones
- Leverages *Forest* tags in order to categorize the focus sessions into the different focus goals
- Exposes a REST API
- Provides a custom Discord integration
- Allows to be deployed on custom domain

## Setup

### Manual

You need to have [Node.js](https://nodejs.org/) installed. We recommend the **LTS release**. After having sucessfully installed Node.js, follow the steps below:

1. Clone this repository or [download the latest zip](https://github.com/nicohaenggi/keep-focus/releases).
2. Copy `config/production-example.json` to `config/production.json` and fill it properly ([see below](#configuration)).
3. Install dependencies: `npm install`.
4. To run for development, open a new Terminal window and run `npm watch-ts` to watch for file changes. Then execute `npm start` to start the application.
5. To run for production, run `npm run build` and then `NODE_ENV=production npm start`.
6. If you want to use `pm2`, run the following command: `NODE_ENV=production pm2 start dist/server.js --name "KeepFocus"`

### Configuration

For a minimal working configuration, the following settings have to be changed in the `config/production-example.json`-file:

- `settings.utcOffset`: The UTC offset of your timezone. To find your UTC time offset, please consider the following [Wikipedia list](https://en.wikipedia.org/wiki/List_of_UTC_time_offsets)
- `settings.username`: The username to be displayed on the web application
- `settings.websiteDomain`: The custom domain of where the KeepFocus instance is being deployed
- `settings.passwordHash`: The SHA256 hash of the password that can be used to disable KeepFocus (by a loved one)
- `settings.accounts.forest`: **Forest** account credentials. Required, as Forest does not offer a public API.
- `settings.accounts.habitify`: **Habitify** account credentials. Required, as Habitify does not offer a public API.
- `settings.focus[0].id`: The **Forest tag id** of this specific focus goal. Can be determined using the [KeepFocus Tags Util](https://github.com/nicohaenggi/keep-focus/blob/main/src/tools/all-tags.ts)
- `settings.habit[0].id`: The  **Habitify habit id** of this specific habit goal. Can be determined using the [KeepFocus Habit Util](https://github.com/nicohaenggi/keep-focus/blob/master/src/tools/all-habits.ts)
- `settings.nfc[0].id`: The **NFC tag id** of this specific habit goal. If your NFC tag has the following text written onto it `keepfocus-f3729182-d17212-4eec` then the NFC tag id is the SHA256 hash of the given text, in this case `f148a1995823dd4778bbf64b8d53e6ceb30f56e8863e5b6ee19b4108d64b2a98`.
- `settings.lametric`: *LaMetric Time Webhook URL* along with the *Access Token* given by the Developer portal.
- `settings.discord.webhookUrl`: *Discord Webhook URL* in order to post the daily punishment in the specified Discord channel.

## API

### Current Status

Gets the current status of the habit and focus goals.

**URL**: `/api/status`

**Method**: `GET`

**Response Code** `200 OK`

**Response Example**: 

```json
{
  "utcOffset": 1,
  "username": "johndoe",
  "websiteDomain": "johndoe.keepfocus.xyz",
  "punishmentIsActive": true,
  "remainingTime": "0h 57m",
  "totalAmount": 60,
  "currentAmount": 60,
  "focus": [
    {
      "id": 1,
      "name": "studying",
      "amount": 20,
      "goal": "5h 0m",
      "done": "3h 20m",
      "finishedBefore": "12:00 am"
    }
  ],
  "habits": [
    {
      "id": "1",
      "name": "do sports",
      "amount": 10,
      "goal": "1 time",
      "done": "0 times",
      "finishedBefore": "12:00 am"
    }
  ]
}
```

### Enable or Disable Punishment

Allows to enable or disable punishment. Disabling punishment requires the `password` query to do so.

**URL**: `/api/webhooks/togglePunishment?password=secretPassword`

**Method**: `GET`

**Response Code** `200 OK`

**Response Example**: 

```json
{
  "success": true,
  "punishmentIsActive": true
}
```

## Limitations

In the current implementation, only the last *200 planted trees* will be fetched. Hence, by always using the smallest (10 minute) tree, you will only be able to log **33.33 hours** of focus time per week. By assuming an average tree of *20 minutes*, you will be able to log *66.66 hours* in a week, which equals to *9.5 hours* of total focus time per day. This limitation is due to the internal API of *Forest*.

## Contributing

If you discover a bug in KeepFocus, please [search the issue tracker](https://github.com/nicohaenggi/keep-focus/issues?q=is%3Aissue+sort%3Aupdated-desc) first. If it hasn't been reported, please [create a new issue](https://github.com/nicohaenggi/keep-focus/issues/new).

### [Feature Requests](https://github.com/nicohaenggi/keep-focus/labels/Feature%20Request)
If you have a great idea to improve KeepFocus, please [search the feature tracker](https://github.com/nicohaenggi/keep-focus/labels/Feature%20Request) first to ensure someone else hasn't already come up with the same idea. If it hasn't been requested, please [create a new request](https://github.com/nicohaenggi/keep-focus/issues/new). While you're there vote on other feature requests to let the me know what is most important to you.

### [Pull Requests](https://github.com/nicohaenggi/keep-focus/pulls)
If you'd like to make your own changes ensure your Pull Request is made against the `dev` branch.
