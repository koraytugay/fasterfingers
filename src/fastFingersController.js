import fastFingersService from './fastFingersService.js';

// Helper functions
const byId = id => document.querySelector(`#${id}`);
const baseUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/`;

const oddImageDiv = byId("pokemon-image-odd-index");
const evenImageDiv = byId("pokemon-image-even-index");
const userInput = byId("user-input");
const remainingTime = byId("remaining-time");
const currentWord = byId("current-word");
const nextWord = byId("next-word");

// Where we keep the game state
let fastFingersGame;

// New Game event listener
function newGame() {
  fastFingersGame = fastFingersService.newFastFingersGame();

  const pokemonImg = document.createElement("img");
  pokemonImg.src = `${baseUrl}${fastFingersService.getCurrentId(fastFingersGame)}.png`;
  evenImageDiv.innerHTML = '';
  evenImageDiv.appendChild(pokemonImg);

  userInput.hidden = false;
  userInput.disabled = false;
  userInput.value = '';
  userInput.focus();
  fetchNextImageShowCurrentImage();
  redraw();
}

byId("new-game-button").addEventListener('click', newGame);

setInterval(function() {
  remainingTime.innerHTML = '';
  remainingTime.textContent = fastFingersGame.remainingTime;
  if (fastFingersGame.remainingTime === 0) {
    userInput.disabled = true;
    userInput.hidden = true;
    remainingTime.textContent = `Net: ${fastFingersGame.currentIndex - fastFingersGame.skippedCount}. Total: ${fastFingersGame.currentIndex}. Skipped: ${fastFingersGame.skippedCount}.`;
  }
}, 10);

userInput.addEventListener('input', function(evt) {
  fastFingersService.startTimeIfNeeded(fastFingersGame); // timer starts when user starts inputting
  const userInput = evt.target.value;
  if (evt.data === ' ') {
    fastFingersService.proceed(fastFingersGame, true);
    evt.target.value = '';
    fetchNextImageShowCurrentImage();
  }
  if (userInput === fastFingersService.getCurrentWord(fastFingersGame)) {
    fastFingersService.proceed(fastFingersGame);
    evt.target.value = '';
    fetchNextImageShowCurrentImage();
  }
  redraw();
});

function fetchNextImageShowCurrentImage() {
  let currentIndex = fastFingersGame.currentIndex;

  // this actually fetches next pokemon image
  const pokemonImg = document.createElement("img");
  pokemonImg.src = `${baseUrl}${fastFingersService.getNextId(fastFingersGame)}.png`;

  if (currentIndex % 2 === 0) {
    oddImageDiv.innerHTML = '';
    oddImageDiv.appendChild(pokemonImg);
    oddImageDiv.hidden = true;
    evenImageDiv.hidden = false;
  } else {
    evenImageDiv.innerHTML = '';
    evenImageDiv.appendChild(pokemonImg);
    evenImageDiv.hidden = true;
    oddImageDiv.hidden = false;
  }
}

function redraw() {
  currentWord.innerHTML = '';
  const currentPokemonName = fastFingersService.getCurrentWord(fastFingersGame);
  const letters = currentPokemonName.split('');
  for (let i = 0; i < letters.length; i++) {
    let letterSpan = document.createElement("span");
    letterSpan.innerText = letters[i];
    if (userInput.value[i] && userInput.value[i] === letters[i]) {
      letterSpan.classList.add('correct');
    }
    if (userInput.value[i] && userInput.value[i] !== letters[i]) {
      letterSpan.classList.add('wrong');
    }
    currentWord.appendChild(letterSpan);
  }
  nextWord.textContent = fastFingersService.getNextWord(fastFingersGame);
}

// Start new game when page loads
newGame();
