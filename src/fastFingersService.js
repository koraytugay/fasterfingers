import {pokemons} from './pokemons.js';

export default (function() {

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function newFastFingersGame() {
    return {
      pokemons: shuffleArray(pokemons),
      currentIndex: 0,
      remainingTime: 60,
      timer: undefined,
      startTimer() {
        this.timer = setInterval(() => {
          if (this.remainingTime > 0) {
            this.remainingTime = this.remainingTime - 1;
          }
        }, 1000)
      },
    };
  }

  function getCurrentId(fastFingersGame) {
    return fastFingersGame.pokemons[fastFingersGame.currentIndex].id;
  }

  function getNextId(fastFingersGame) {
    return fastFingersGame.pokemons[fastFingersGame.currentIndex + 1].id;
  }

  function getCurrentWord(fastFingersGame) {
    return fastFingersGame.pokemons[fastFingersGame.currentIndex].name;
  }

  function proceed(fastFingersGame) {
    fastFingersGame.currentIndex++;
  }

  function startTimeIfNeeded(fastFingersGame) {
    if (fastFingersGame.timer === undefined) {
      fastFingersGame.startTimer();
    }
  }

  return {
    newFastFingersGame,
    getCurrentWord,
    getCurrentId,
    getNextId,
    proceed,
    startTimeIfNeeded
  }
}());
