// import dependencies
import { Forest } from '../forest';
import config from '../configuration';

// load configuration settings
const SETTINGS = config.get('settings');

async function runTask () {
  const forest = new Forest(SETTINGS.accounts.forest.username, SETTINGS.accounts.forest.password);
  
  // login and get all tags
  await forest.login();
  let tags = await forest.getAllTags();
  
  // iterate through all habits and print out 
  console.log('\nbelow are all your tag ids listed:')
  for (const tag of tags) {
    if (!tag.deleted) {
      console.log(`   - ${tag.title}: ${tag.tag_id}`);
    }
  }
}

runTask();

