import { Habitify } from '../habitify';


async function runTests () {
  const habitify = new Habitify('user@name.ch', 'password12');
  
  await habitify.login();
  await habitify.getAllHabits();
}

runTests();

