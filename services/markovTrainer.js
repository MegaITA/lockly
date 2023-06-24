const db = require('../db/databaseManager');
const Markov = require('markov-strings').default;

(async () => {

  const groupsArray = await db.getGroups();

  let startDate = new Date();

  console.log(`Working on process: ${process.pid}`)
  console.log(`Starting scheduled training job at ${startDate.getHours()}:${startDate.getMinutes()}`);

  let i = 0;
  
  for(let group of groupsArray) {

    let { messages } = await db.getMessages(group.gid);

    if(messages.length <= 1000) continue;

    console.log(`Started training for ${group.gid} with ${messages.length} messages.`);

    let markov = new Markov({ 

      stateSize: process.env.STATE_SIZE

    });

    await markov.addDataAsync(messages);

    await db.updateOrCreateMarkovData(group.gid, markov.export());
    
    console.log(`Finished training for ${group.gid}.`);

    i++;

  }

  let endDate = new Date();

  console.log(`Finished training job at ${endDate.getHours()}:${endDate.getMinutes()}. Trained ${i} groups.`);

  process.exit();

})();