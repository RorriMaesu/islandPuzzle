// Game variables
const gameState = {
  resources: {
    wood: 0,
    stone: 0,
    food: 0
  },
  score: 0,
  level: 1,
  buildings: {
    hut: 0,
    farm: 0,
    mine: 0
  }
};

// DOM elements
const boardElement = document.getElementById('board');
const woodElement = document.getElementById('wood');
const stoneElement = document.getElementById('stone');
const foodElement = document.getElementById('food');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const buildHutButton = document.getElementById('build-hut');
const buildFarmButton = document.getElementById('build-farm');
const buildMineButton = document.getElementById('build-mine');
const islandElement = document.getElementById('island');
const resetButton = document.getElementById('reset-game');
const helpButton = document.getElementById('help-button');
const notificationContainer = document.getElementById('notification-container');
const instructionsModal = document.getElementById('instructions-modal');
const closeButton = document.querySelector('.close-button');

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;

  notificationContainer.appendChild(notification);

  // Remove notification after animation completes
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Tile types and their properties
const tileTypes = [
  { type: 'W', resource: 'wood', color: '#8bc34a', label: 'W', points: 1 },
  { type: 'S', resource: 'stone', color: '#bbb', label: 'S', points: 2 },
  { type: 'F', resource: 'food', color: '#e96', label: 'F', points: 1 }
];

// Building costs
const buildingCosts = {
  hut: { wood: 10, stone: 0, food: 0 },
  farm: { wood: 0, stone: 0, food: 10 },
  mine: { wood: 0, stone: 15, food: 0 }
};

// Building benefits
const buildingBenefits = {
  hut: { population: 1, points: 10 },
  farm: { foodProduction: 1, points: 15 },
  mine: { stoneProduction: 1, points: 20 }
};

// Update game display
function updateGameDisplay() {
  // Update resources
  woodElement.textContent = `Wood: ${gameState.resources.wood}`;
  stoneElement.textContent = `Stone: ${gameState.resources.stone}`;
  foodElement.textContent = `Food: ${gameState.resources.food}`;

  // Update score and level
  scoreElement.textContent = `Score: ${gameState.score}`;
  levelElement.textContent = `Level: ${gameState.level}`;

  // Update button states based on available resources
  buildHutButton.disabled = gameState.resources.wood < buildingCosts.hut.wood;
  buildFarmButton.disabled = gameState.resources.food < buildingCosts.farm.food;
  buildMineButton.disabled = gameState.level < 2 || gameState.resources.stone < buildingCosts.mine.stone;
}

// Check if player can level up
function checkLevelUp() {
  const totalBuildings = gameState.buildings.hut + gameState.buildings.farm + gameState.buildings.mine;
  const newLevel = Math.floor(totalBuildings / 3) + 1;

  if (newLevel > gameState.level) {
    gameState.level = newLevel;
    alert(`Congratulations! You've reached level ${gameState.level}!`);

    // Unlock mine at level 2
    if (gameState.level === 2) {
      buildMineButton.disabled = false;
    }
  }
}

// Create a new tile
function createTile() {
  // Randomly select a tile type
  const tileTypeIndex = Math.floor(Math.random() * tileTypes.length);
  const tileType = tileTypes[tileTypeIndex];

  // Create the tile element
  const tile = document.createElement('div');
  tile.className = 'tile';
  tile.style.backgroundColor = tileType.color;
  tile.textContent = tileType.label;

  // Add click event to collect resource
  tile.addEventListener('click', () => {
    // Add resource
    gameState.resources[tileType.resource]++;

    // Add points to score
    gameState.score += tileType.points;

    // Update display
    updateGameDisplay();

    // Replace the tile with a new one
    tile.remove();
    boardElement.appendChild(createTile());
  });

  return tile;
}

// Initialize the game board
function initializeBoard() {
  // Clear the board
  boardElement.innerHTML = '';

  // Create 18 tiles (6x3 grid)
  for (let i = 0; i < 18; i++) {
    boardElement.appendChild(createTile());
  }
}

// Build a structure on the island
function buildStructure(type) {
  // Check if we have enough resources
  const cost = buildingCosts[type];

  if (gameState.resources.wood >= cost.wood &&
      gameState.resources.stone >= cost.stone &&
      gameState.resources.food >= cost.food) {

    // Deduct resources
    gameState.resources.wood -= cost.wood;
    gameState.resources.stone -= cost.stone;
    gameState.resources.food -= cost.food;

    // Increment building count
    gameState.buildings[type]++;

    // Add points to score
    gameState.score += buildingBenefits[type].points;

    // Create the building
    const building = document.createElement('div');
    building.className = `building ${type}`;

    if (type === 'hut') {
      building.textContent = 'Hut';
    } else if (type === 'farm') {
      building.textContent = 'Farm';
    } else if (type === 'mine') {
      building.textContent = 'Mine';
    }

    // Add to island
    islandElement.appendChild(building);

    // Show notification
    showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} built successfully!`);

    // Check for level up
    checkLevelUp();

    // Update display
    updateGameDisplay();
  }
}

// Reset the game
function resetGame() {
  // Reset game state
  gameState.resources.wood = 0;
  gameState.resources.stone = 0;
  gameState.resources.food = 0;
  gameState.score = 0;
  gameState.level = 1;
  gameState.buildings.hut = 0;
  gameState.buildings.farm = 0;
  gameState.buildings.mine = 0;

  // Clear the island
  islandElement.innerHTML = '';

  // Reinitialize the board
  initializeBoard();

  // Update display
  updateGameDisplay();
}

// Event listeners for building buttons
buildHutButton.addEventListener('click', () => buildStructure('hut'));
buildFarmButton.addEventListener('click', () => buildStructure('farm'));
buildMineButton.addEventListener('click', () => buildStructure('mine'));
resetButton.addEventListener('click', resetGame);

// Generate passive resources based on buildings
function generatePassiveResources() {
  let resourcesGenerated = false;
  let notificationMessage = "Resources generated: ";

  // Farms generate food
  if (gameState.buildings.farm > 0) {
    const foodGenerated = gameState.buildings.farm;
    gameState.resources.food += foodGenerated;
    notificationMessage += `${foodGenerated} Food `;
    resourcesGenerated = true;
  }

  // Mines generate stone
  if (gameState.buildings.mine > 0) {
    const stoneGenerated = gameState.buildings.mine;
    gameState.resources.stone += stoneGenerated;
    notificationMessage += `${stoneGenerated} Stone`;
    resourcesGenerated = true;
  }

  // Show notification and update display if resources were generated
  if (resourcesGenerated) {
    showNotification(notificationMessage);
    updateGameDisplay();
  }
}

// Hide loading screen and show game
function hideLoadingScreen() {
  document.getElementById('loading-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';

  // Check if this is the first time playing
  if (!localStorage.getItem('puzzleColonyPlayed')) {
    // Show instructions modal for first-time players
    setTimeout(openModal, 500);
    // Set flag in localStorage
    localStorage.setItem('puzzleColonyPlayed', 'true');
  }
}

// Initialize the game
function initGame() {
  // Initially disable mine button (unlocks at level 2)
  buildMineButton.disabled = true;

  initializeBoard();
  updateGameDisplay();

  // Set up passive resource generation every 10 seconds
  setInterval(generatePassiveResources, 10000);

  // Hide loading screen after a short delay to ensure everything is loaded
  setTimeout(hideLoadingScreen, 1000);
}

// Start the game when the page loads
window.addEventListener('load', initGame);

// Modal functions
function openModal() {
  instructionsModal.style.display = 'block';
}

function closeModal() {
  instructionsModal.style.display = 'none';
}

// Event listeners for modal
helpButton.addEventListener('click', openModal);
closeButton.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
  if (event.target === instructionsModal) {
    closeModal();
  }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (event) => {
  // Press 'R' to reset game
  if (event.key === 'r' || event.key === 'R') {
    resetGame();
  }

  // Press 'Escape' to close modal
  if (event.key === 'Escape') {
    closeModal();
  }

  // Press 'H' to open help
  if (event.key === 'h' || event.key === 'H') {
    openModal();
  }
});
