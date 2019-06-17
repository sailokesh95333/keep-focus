import { Forest } from '../forest';


async function runTests () {
  const forest = new Forest('nico@haenggi.ch', 'lpic11lpic11', null, null, 'http://localhost:8888');
  
  await forest.login();
  const plants = await forest.getAllPlantsSince(new Date().getTime() - 1000*60*60*24*30);
  console.log(plants);
}

runTests();

