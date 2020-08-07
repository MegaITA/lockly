const db = require('../db/databaseManager');
const Markov = require('markov-strings').default;

module.exports = async () => {

  const groupsArray = await db.getGroups();

  console.info(`Starting scheduled training job at ${Date.now()}`);

  let i = 0;
  
  for(let group of groupsArray) {

    if(group.messages <= 1000) continue;

    console.info(`Started training for ${group.groupID} with ${group.messages.length} messages.`);

    let markov = new Markov(group.messages, { stateSize: 1 });

    await markov.buildCorpusAsync();

    await db.updateCorpus(group.groupID, markov.corpus);
    
    console.info(`Finished training for ${group.groupID}.`);

    i++;

  }

  console.info(`Finished training job at ${Date.now()}. Trained ${i} groups.`);

}