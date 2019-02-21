# Forest-Server

## Implementation Notes

**Warning**: In the current implementation, only the latest *200 planted trees* will be fetched. Hence, by always using the smallest (10 minute) tree, you will only be able to log **33.33 hours** of focus time per week. By assuming an average tree of *20 minutes*, you will be able to log **66.66 hours** in a week, which equals to *9.5 hours* of total focus time per day.

## Habitify Checkins

The Habitify checkins format is as follows: Every habit database entry has a key `checkins` which looks like:

```json
checkins: { '21022019': 2, '20022019: 2 }
```

The object key encodes a date in the format `DDMMYYYY` and each day, a number from `0-3` is assigned. Below will be explained what these numbers stand for:
```txt
0/NULL    the user has not completed this on the specified date
1         the user has skipped the habit on the specified date
2         the user has completed the habit on the specified date
3         the user has failed the habit on the specified date
```