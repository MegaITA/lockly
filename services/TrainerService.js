const { Worker } = require('worker_threads');

class TrainerService {
 
  isTraining = false

  async startThreadedTraining() {

    // Avoid training overlapping
    if(this.isTraining)
      return;

    console.time('Training_time');

    this.isTraining = true;

    const worker = new Worker(`${__dirname}/markovTrainer.js`);

    worker.on('message', (message) => {

      console.log(message);

    });

    worker.on('exit', () => {

      console.log('Training thread closed.');

      this.isTraining = false;

      console.timeEnd('Training_time');

    });

  }

}

module.exports = TrainerService;