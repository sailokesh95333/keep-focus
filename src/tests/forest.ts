import { Forest } from '../forest';


async function runTests () {
  const forest = new Forest('user@name.ch', 'password12', null, null, 'http://localhost:8888');
  
  await forest.login();
  await forest.getAllPlantsSince(new Date().getTime() - 1000*60*60*24*30);
}

runTests();

