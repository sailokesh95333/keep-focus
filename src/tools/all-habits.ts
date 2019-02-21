// import dependencies
import { Habitify } from '../Habitify';
import config from '../configuration';

// load configuration settings
const SETTINGS = config.get('settings');

async function runTask () {
  const habitify = new Habitify(SETTINGS.accounts.habitify.username, SETTINGS.accounts.habitify.password);
  
  // login and get all habits
  await habitify.login();
  let habits = await habitify.getAllHabits();
  
  // iterate through all habits and print out 
  console.log('\nbelow are all your habit ids listed:')
  const keys = Object.keys(habits)
  for (const key of keys) {
    let habit = habits[key];
    console.log(`   - ${habit.name}: ${key}`);
  }
}

runTask();

