const db = require('../db/databaseManager');
const Markov = require('markov-strings').default;

module.exports = async () => {

  const groupsArray = await db.getGroups();

  console.info(`Starting scheduled training job at ${Date.now()}`);

  let i = 0;
  
  for(let group of groupsArray) {

    let { messages } = await db.getMessages(group.gid);

    if(messages.length <= 1000) continue;

    console.info(`Started training for ${group.gid} with ${messages.length} messages.`);

    let markov = new Markov(messages, { 

      stateSize: messages.length <= 1000 ? 1 : 2 

    });

    await markov.buildCorpusAsync();

    await db.updateOrCreateCorpus(group.gid, markov.corpus);
    
    console.info(`Finished training for ${group.gid}.`);

    i++;

  }

  console.info(`Finished training job at ${Date.now()}. Trained ${i} groups.`);

}