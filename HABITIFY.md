## Habitify Checkins

In the following, we will examine the *Habitify* database format. Every habit database entry has a `checkins` property which looks like the following:

```json
{
  ...
  "checkins": {
    "21022019": 2, 
    "20022019": 2
  }
}
```

The object key encodes a date of the format `DDMMYYYY`. For every day, a number spanning from zero to three is assigned. Below is a table that explain what these numbers stand for:

| Number     | Meaning           |
| ---------- |-------------------|
| 0/NULL    | the user has not completed this on the specified date |
| 1         | the user has skipped the habit on the specified date  | 
| 2         | the user has completed the habit on the specified date |
| 3         | the user has failed the habit on the specified date |
