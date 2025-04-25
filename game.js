// Game variables
const gameState = {
  resources: {
    wood: 0,
    stone: 0,
    food: 0,
    gems: 0,
    energy: 100,
    maxEnergy: 100,
    energyRegenRate: 1, // Energy per 5 seconds
    knowledge: 0, // New resource for research
    metal: 0, // New advanced resource
    crystal: 0 // New premium resource
  },
  score: 0,
  level: 1,
  experience: 0,
  experienceToNextLevel: 100,
  streak: 0,
  maxStreak: 0,
  multiplier: 1,
  streakTimeout: null,
  streakTimeWindow: 2000, // ms to maintain streak
  lastPlayTime: Date.now(),
  lastSaveTime: Date.now(),
  offlineProgressEnabled: true,
  maxOfflineTime: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  buildings: {
    hut: 0,
    farm: 0,
    mine: 0,
    workshop: 0,
    temple: 0,
    market: 0,
    // New buildings
    library: 0,
    forge: 0,
    windmill: 0,
    lighthouse: 0,
    observatory: 0,
    tradingPost: 0
  },
  upgrades: {
    efficientTools: 0,
    fertileSoil: 0,
    miningDrill: 0,
    tradeRoutes: 0,
    // New upgrades
    advancedFarming: 0,
    improvedStorage: 0,
    betterHousing: 0,
    enhancedMining: 0,
    advancedConstruction: 0,
    efficientEnergy: 0
  },
  population: 0,
  happiness: 100,
  islandSize: 1,
  maxIslandBuildings: 9, // 3x3 grid initially
  dailyStreak: 0,
  lastDailyReward: null,
  // Current season (0-3: Spring, Summer, Fall, Winter)
  currentSeason: 0,
  seasonDay: 0,
  seasonLength: 28, // Days per season
  seasonEffects: {
    spring: { food: 0.2, wood: 0.1, stone: 0, happiness: 10 },
    summer: { food: 0.1, wood: -0.1, stone: 0.2, happiness: 5 },
    fall: { food: -0.1, wood: 0.2, stone: 0.1, happiness: 0 },
    winter: { food: -0.2, wood: 0, stone: -0.1, happiness: -10 }
  },
  // Random events
  lastRandomEvent: null,
  randomEventCooldown: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  activeRandomEvent: null,
  randomEventEndTime: null,
  // Social features
  friends: [],
  pendingFriendRequests: [],
  sentFriendRequests: [],
  lastFriendVisit: null,
  friendVisitCooldown: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
  tradingEnabled: false,
  pendingTrades: [],
  completedTrades: [],
  // Cloud save
  cloudSaveEnabled: false,
  userId: null,
  lastCloudSave: null,
  // Achievements with badges
  achievements: [
    { id: 'firstSteps', name: 'First Steps', description: 'Build 5 buildings', progress: 0, target: 5, completed: false, rewards: { xp: 100, gems: 1 }, badge: '🏆' },
    { id: 'resourceBaron', name: 'Resource Baron', description: 'Collect 1000 total resources', progress: 0, target: 1000, completed: false, rewards: { xp: 200, gems: 2 }, badge: '⭐' },
    { id: 'comboMaster', name: 'Combo Master', description: 'Reach a 10x streak multiplier', progress: 0, target: 10, completed: false, rewards: { xp: 150, gems: 1 }, badge: '🔥' },
    // New achievements
    { id: 'buildingMaster', name: 'Building Master', description: 'Build 20 total buildings', progress: 0, target: 20, completed: false, rewards: { xp: 300, gems: 3 }, badge: '🏗️' },
    { id: 'upgradeExpert', name: 'Upgrade Expert', description: 'Reach level 3 in any upgrade', progress: 0, target: 3, completed: false, rewards: { xp: 250, gems: 2 }, badge: '🔧' },
    { id: 'seasonalExpert', name: 'Seasonal Expert', description: 'Experience all 4 seasons', progress: 0, target: 4, completed: false, rewards: { xp: 400, gems: 4 }, badge: '🌍' },
    { id: 'socialButterfly', name: 'Social Butterfly', description: 'Make 5 friends', progress: 0, target: 5, completed: false, rewards: { xp: 350, gems: 3 }, badge: '🦋' },
    { id: 'tradeMaster', name: 'Trade Master', description: 'Complete 10 trades', progress: 0, target: 10, completed: false, rewards: { xp: 500, gems: 5 }, badge: '🤝' },
    { id: 'eventSurvivor', name: 'Event Survivor', description: 'Survive 5 random events', progress: 0, target: 5, completed: false, rewards: { xp: 450, gems: 4 }, badge: '⚡' }
  ],
  quests: [
    { id: 'islandStarter', name: 'Island Starter', description: 'Build your first hut', progress: 0, target: 1, completed: false, rewards: { wood: 20, xp: 50 } },
    { id: 'resourceGatherer', name: 'Resource Gatherer', description: 'Collect 50 resources', progress: 0, target: 50, completed: false, rewards: { gems: 1, xp: 100 } },
    // New quests
    { id: 'knowledgeSeeker', name: 'Knowledge Seeker', description: 'Build a library', progress: 0, target: 1, completed: false, rewards: { knowledge: 10, xp: 150 } },
    { id: 'metalWorker', name: 'Metal Worker', description: 'Build a forge', progress: 0, target: 1, completed: false, rewards: { metal: 5, xp: 200 } },
    { id: 'seasonalHarvest', name: 'Seasonal Harvest', description: 'Collect 100 food during summer', progress: 0, target: 100, completed: false, rewards: { food: 50, xp: 250 } },
    { id: 'friendlyIsland', name: 'Friendly Island', description: 'Add your first friend', progress: 0, target: 1, completed: false, rewards: { gems: 3, xp: 300 } }
  ],
  activeQuests: ['islandStarter', 'resourceGatherer'],
  completedQuests: [],
  unlockedBuildings: ['hut', 'farm'],
  unlockedUpgrades: ['efficientTools', 'fertileSoil'],
  statistics: {
    tilesClicked: 0,
    resourcesCollected: 0,
    buildingsConstructed: 0,
    timeSpentPlaying: 0,
    longestStreak: 0,
    randomEventsExperienced: 0,
    tradesCompleted: 0,
    friendsVisited: 0,
    offlineResourcesCollected: 0
  },
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    notificationsEnabled: true,
    autoSaveInterval: 60000, // Save every minute
    offlineProgressEnabled: true,
    cloudSaveEnabled: false,
    friendRequestsEnabled: true,
    tradeRequestsEnabled: true
  },
  eventActive: false,
  eventEndTime: null,
  eventMultiplier: 1
};

// DOM elements
const boardElement = document.getElementById('board');
const woodElement = document.getElementById('wood').querySelector('.resource-count');
const stoneElement = document.getElementById('stone').querySelector('.resource-count');
const foodElement = document.getElementById('food').querySelector('.resource-count');
const gemsElement = document.getElementById('gems').querySelector('.resource-count');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const levelDisplayElement = document.getElementById('level-display');
const experienceBarElement = document.getElementById('experience-bar');
const experienceTextElement = document.getElementById('experience-text');
const energyBarElement = document.getElementById('energy-bar');
const energyTextElement = document.getElementById('energy-text');
const streakCounterElement = document.getElementById('streak-counter');
const multiplierElement = document.getElementById('multiplier');
const populationElement = document.getElementById('population-counter');
const happinessElement = document.getElementById('happiness-counter');

// Building elements
const buildHutButton = document.getElementById('build-hut');
const buildFarmButton = document.getElementById('build-farm');
const buildMineButton = document.getElementById('build-mine');
const buildWorkshopButton = document.getElementById('build-workshop');
const buildTempleButton = document.getElementById('build-temple');
const buildMarketButton = document.getElementById('build-market');

// Upgrade elements
const upgradeToolsButton = document.getElementById('upgrade-tools');
const upgradeSoilButton = document.getElementById('upgrade-soil');
const upgradeDrillButton = document.getElementById('upgrade-drill');
const upgradeTradeButton = document.getElementById('upgrade-trade');

// Tab elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');

// Island elements
const islandElement = document.getElementById('island');
const expandIslandButton = document.getElementById('expand-island');
const decorateIslandButton = document.getElementById('decorate-island');

// Quest elements
const activeQuestList = document.getElementById('active-quest-list');
const completedQuestList = document.getElementById('completed-quest-list');

// Achievement elements
const achievementList = document.getElementById('achievement-list');

// Modal elements
const instructionsModal = document.getElementById('instructions-modal');
const dailyRewardModal = document.getElementById('daily-reward-modal');
const specialEventModal = document.getElementById('special-event-modal');
const settingsModal = document.getElementById('settings-modal');
const levelUpModal = document.getElementById('level-up-modal');
const achievementModal = document.getElementById('achievement-modal');
const closeButtons = document.querySelectorAll('.close-button');

// Button elements
const resetButton = document.getElementById('reset-game');
const helpButton = document.getElementById('help-button');
const dailyRewardButton = document.getElementById('daily-reward');
const specialEventButton = document.getElementById('special-event');
const settingsButton = document.getElementById('settings-button');
const claimRewardButton = document.getElementById('claim-reward');
const startEventButton = document.getElementById('start-event');
const levelUpClaimButton = document.getElementById('level-up-claim');
const achievementClaimButton = document.getElementById('achievement-claim');

// Other elements
const notificationContainer = document.getElementById('notification-container');
const dailyStreakCount = document.getElementById('daily-streak-count');
const rewardCalendar = document.querySelectorAll('.reward-day');

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
  // Basic resources
  { type: 'W', resource: 'wood', color: 'var(--wood-color)', label: '🪵', points: 1, rarity: 0.30, minLevel: 1 },
  { type: 'S', resource: 'stone', color: 'var(--stone-color)', label: '🪨', points: 2, rarity: 0.25, minLevel: 1 },
  { type: 'F', resource: 'food', color: 'var(--food-color)', label: '🍎', points: 1, rarity: 0.30, minLevel: 1 },
  { type: 'G', resource: 'gems', color: 'var(--gem-color)', label: '💎', points: 5, rarity: 0.05, minLevel: 1 },

  // Advanced resources
  { type: 'K', resource: 'knowledge', color: '#4285F4', label: '📚', points: 3, rarity: 0.05, minLevel: 12 },
  { type: 'M', resource: 'metal', color: '#9E9E9E', label: '⚙️', points: 4, rarity: 0.04, minLevel: 16 },
  { type: 'C', resource: 'crystal', color: '#E040FB', label: '💠', points: 10, rarity: 0.01, minLevel: 28 }
];

// Building costs
const buildingCosts = {
  // Basic buildings
  hut: { wood: 10, stone: 0, food: 0, gems: 0 },
  farm: { wood: 0, stone: 0, food: 10, gems: 0 },
  mine: { wood: 0, stone: 15, food: 0, gems: 0 },
  workshop: { wood: 25, stone: 15, food: 0, gems: 0 },
  temple: { wood: 0, stone: 30, food: 20, gems: 0 },
  market: { wood: 20, stone: 0, food: 20, gems: 1 },

  // Advanced buildings
  library: { wood: 30, stone: 20, food: 0, knowledge: 5, gems: 0 },
  forge: { wood: 15, stone: 40, food: 0, metal: 0, gems: 1 },
  windmill: { wood: 35, stone: 15, food: 25, gems: 0 },
  lighthouse: { wood: 30, stone: 50, food: 0, metal: 5, gems: 2 },
  observatory: { wood: 20, stone: 30, food: 0, knowledge: 20, gems: 3 },
  tradingPost: { wood: 40, stone: 40, food: 40, metal: 10, gems: 2 }
};

// Building benefits
const buildingBenefits = {
  // Basic buildings
  hut: { population: 1, happiness: 0, points: 10 },
  farm: { foodProduction: 1, happiness: 1, points: 15 },
  mine: { stoneProduction: 1, happiness: -1, points: 20 },
  workshop: { woodProduction: 2, happiness: 0, points: 25 },
  temple: { gemProduction: 0.2, happiness: 3, points: 30 },
  market: { resourceMultiplier: 0.1, happiness: 2, points: 35 },

  // Advanced buildings
  library: { knowledgeProduction: 1, happiness: 2, points: 40 },
  forge: { metalProduction: 0.5, happiness: -1, points: 45 },
  windmill: { foodMultiplier: 0.2, happiness: 1, points: 50 },
  lighthouse: { tradingBonus: 0.2, happiness: 3, points: 55 },
  observatory: { crystalChance: 0.05, happiness: 2, points: 60 },
  tradingPost: { tradingLimit: 3, happiness: 4, points: 65 }
};

// Upgrade costs and benefits
const upgradeCosts = {
  // Basic upgrades
  efficientTools: { wood: 50, stone: 30, food: 0, gems: 0 },
  fertileSoil: { wood: 30, stone: 0, food: 50, gems: 0 },
  miningDrill: { wood: 30, stone: 50, food: 0, gems: 0 },
  tradeRoutes: { wood: 40, stone: 40, food: 40, gems: 0 },

  // Advanced upgrades
  advancedFarming: { wood: 60, stone: 20, food: 80, knowledge: 10, gems: 1 },
  improvedStorage: { wood: 70, stone: 70, food: 30, knowledge: 5, gems: 0 },
  betterHousing: { wood: 80, stone: 60, food: 40, metal: 5, gems: 1 },
  enhancedMining: { wood: 50, stone: 100, food: 0, metal: 10, gems: 2 },
  advancedConstruction: { wood: 100, stone: 100, food: 50, metal: 15, knowledge: 20, gems: 3 },
  efficientEnergy: { wood: 60, stone: 60, food: 60, crystal: 1, gems: 5 }
};

const upgradeBenefits = {
  // Basic upgrades
  efficientTools: { woodMultiplier: 0.2, points: 20 },
  fertileSoil: { foodMultiplier: 0.2, points: 20 },
  miningDrill: { stoneMultiplier: 0.2, points: 20 },
  tradeRoutes: { allResourceMultiplier: 0.1, points: 30 },

  // Advanced upgrades
  advancedFarming: { foodMultiplier: 0.3, happinessBonus: 5, points: 40 },
  improvedStorage: { resourceCapMultiplier: 0.5, points: 35 },
  betterHousing: { populationMultiplier: 0.2, happinessBonus: 10, points: 45 },
  enhancedMining: { stoneMultiplier: 0.3, metalMultiplier: 0.2, points: 50 },
  advancedConstruction: { buildingCostReduction: 0.15, points: 60 },
  efficientEnergy: { energyRegenMultiplier: 0.5, points: 70 }
};

// Level rewards
const levelRewards = {
  // Basic progression
  2: { unlockBuilding: 'mine', energyBoost: 20, gems: 1, message: 'Unlocked: Mine Building' },
  3: { unlockUpgrade: 'miningDrill', energyBoost: 20, gems: 1, message: 'Unlocked: Mining Drill Upgrade' },
  4: { unlockBuilding: 'workshop', energyBoost: 20, gems: 2, message: 'Unlocked: Workshop Building' },
  5: { unlockUpgrade: 'tradeRoutes', energyBoost: 30, gems: 2, message: 'Unlocked: Trade Routes Upgrade' },
  6: { unlockBuilding: 'temple', energyBoost: 30, gems: 3, message: 'Unlocked: Temple Building' },
  7: { expandIsland: true, energyBoost: 30, gems: 3, message: 'Unlocked: Island Expansion' },
  8: { unlockBuilding: 'market', energyBoost: 40, gems: 4, message: 'Unlocked: Market Building' },
  10: { specialEvent: true, energyBoost: 50, gems: 5, message: 'Unlocked: Special Events' },

  // Advanced progression
  12: { unlockBuilding: 'library', energyBoost: 50, gems: 5, message: 'Unlocked: Library Building' },
  14: { unlockUpgrade: 'advancedFarming', energyBoost: 60, gems: 6, message: 'Unlocked: Advanced Farming Upgrade' },
  16: { unlockBuilding: 'forge', energyBoost: 60, gems: 7, message: 'Unlocked: Forge Building' },
  18: { unlockUpgrade: 'improvedStorage', energyBoost: 70, gems: 7, message: 'Unlocked: Improved Storage Upgrade' },
  20: { unlockBuilding: 'windmill', energyBoost: 70, gems: 8, message: 'Unlocked: Windmill Building' },
  22: { unlockUpgrade: 'betterHousing', energyBoost: 80, gems: 8, message: 'Unlocked: Better Housing Upgrade' },
  24: { unlockBuilding: 'lighthouse', energyBoost: 80, gems: 9, message: 'Unlocked: Lighthouse Building' },
  26: { unlockUpgrade: 'enhancedMining', energyBoost: 90, gems: 9, message: 'Unlocked: Enhanced Mining Upgrade' },
  28: { unlockBuilding: 'observatory', energyBoost: 90, gems: 10, message: 'Unlocked: Observatory Building' },
  30: { unlockUpgrade: 'advancedConstruction', energyBoost: 100, gems: 10, message: 'Unlocked: Advanced Construction Upgrade' },
  32: { unlockBuilding: 'tradingPost', tradingEnabled: true, energyBoost: 100, gems: 15, message: 'Unlocked: Trading Post Building & Trading System' },
  35: { unlockUpgrade: 'efficientEnergy', energyBoost: 150, gems: 20, message: 'Unlocked: Efficient Energy Upgrade' }
};

// Random events
const randomEvents = [
  {
    id: 'storm',
    name: 'Tropical Storm',
    description: 'A powerful storm has hit your island! Resource production is reduced by 50% for 1 hour.',
    duration: 60 * 60 * 1000, // 1 hour
    effects: {
      resourceMultiplier: 0.5,
      happinessChange: -20
    },
    resolution: {
      description: 'The storm has passed. Your island is returning to normal.',
      rewards: { gems: 3, xp: 200 }
    }
  },
  {
    id: 'festival',
    name: 'Island Festival',
    description: 'Your islanders are celebrating! Happiness is increased by 30% and resource production is boosted by 25% for 2 hours.',
    duration: 2 * 60 * 60 * 1000, // 2 hours
    effects: {
      resourceMultiplier: 1.25,
      happinessChange: 30
    },
    resolution: {
      description: 'The festival has ended. Everyone returns to their normal activities.',
      rewards: { xp: 150 }
    }
  },
  {
    id: 'trader',
    name: 'Wandering Trader',
    description: 'A trader has arrived at your island! Special deals are available for the next 30 minutes.',
    duration: 30 * 60 * 1000, // 30 minutes
    effects: {
      specialDeals: true
    },
    resolution: {
      description: 'The trader has left your island.',
      rewards: { metal: 5, crystal: 1 }
    }
  },
  {
    id: 'drought',
    name: 'Drought',
    description: 'A drought has hit your island! Food production is reduced by 75% for 3 hours.',
    duration: 3 * 60 * 60 * 1000, // 3 hours
    effects: {
      foodMultiplier: 0.25,
      happinessChange: -15
    },
    resolution: {
      description: 'The drought has ended. Rain has returned to your island.',
      rewards: { food: 50, xp: 250 }
    }
  },
  {
    id: 'goldRush',
    name: 'Crystal Rush',
    description: 'A crystal vein has been discovered! Crystal chance increased by 500% for 1 hour.',
    duration: 60 * 60 * 1000, // 1 hour
    effects: {
      crystalChanceMultiplier: 5
    },
    resolution: {
      description: 'The crystal vein has been depleted.',
      rewards: { crystal: 2, xp: 300 }
    }
  }
];

// Calculate resource capacities
function calculateResourceCaps() {
  // Base caps for resources
  const baseCaps = {
    wood: 100,
    stone: 100,
    food: 100,
    gems: 50,
    knowledge: 50,
    metal: 50,
    crystal: 25
  };
  
  // Apply improved storage upgrade if available
  let multiplier = 1;
  if (gameState.upgrades.improvedStorage > 0) {
    multiplier = 1 + (gameState.upgrades.improvedStorage * upgradeBenefits.improvedStorage.resourceCapMultiplier);
  }
  
  // Calculate actual caps
  const resourceCaps = {};
  for (const [resource, baseCap] of Object.entries(baseCaps)) {
    resourceCaps[resource] = Math.round(baseCap * multiplier);
  }
  
  return resourceCaps;
}

// Update game display
function updateGameDisplay() {
  // Update resources
  woodElement.textContent = gameState.resources.wood;
  stoneElement.textContent = gameState.resources.stone;
  foodElement.textContent = gameState.resources.food;
  gemsElement.textContent = gameState.resources.gems;
  
  // Show or hide advanced resources based on level
  const advancedResourcesContainer = document.getElementById('advanced-resources');
  if (gameState.level >= 12) {
    advancedResourcesContainer.style.display = 'block';
    
    // Get advanced resource elements or create them if they don't exist
    const knowledgeElement = document.getElementById('knowledge').querySelector('.resource-count');
    const metalElement = document.getElementById('metal').querySelector('.resource-count');
    const crystalElement = document.getElementById('crystal').querySelector('.resource-count');
    
    // Update advanced resource counts
    knowledgeElement.textContent = gameState.resources.knowledge;
    metalElement.textContent = gameState.resources.metal;
    crystalElement.textContent = gameState.resources.crystal;
  } else {
    advancedResourcesContainer.style.display = 'none';
  }

  // Update score and level
  scoreElement.textContent = `Score: ${gameState.score}`;
  levelElement.textContent = `Level: ${gameState.level}`;
  levelDisplayElement.textContent = gameState.level;

  // Update experience bar
  const expPercentage = (gameState.experience / gameState.experienceToNextLevel) * 100;
  experienceBarElement.style.width = `${expPercentage}%`;
  experienceTextElement.textContent = `XP: ${gameState.experience}/${gameState.experienceToNextLevel}`;

  // Update energy bar
  const energyPercentage = (gameState.resources.energy / gameState.resources.maxEnergy) * 100;
  energyBarElement.style.width = `${energyPercentage}%`;
  energyTextElement.textContent = `Energy: ${Math.floor(gameState.resources.energy)}/${gameState.resources.maxEnergy}`;

  // Update streak and multiplier
  streakCounterElement.textContent = `Streak: ${gameState.streak}`;
  multiplierElement.textContent = `×${gameState.multiplier}`;

  // Update island stats
  populationElement.innerHTML = `<i class="stat-icon">👥</i> Population: ${gameState.population}`;
  happinessElement.innerHTML = `<i class="stat-icon">😊</i> Happiness: ${gameState.happiness}%`;

  // Update building buttons based on available resources and unlocks
  updateBuildingButtons();

  // Update upgrade buttons
  updateUpgradeButtons();

  // Update island expansion button
  expandIslandButton.disabled = gameState.resources.gems < 5 || !gameState.unlockedBuildings.includes('temple');
  decorateIslandButton.disabled = gameState.resources.gems < 2 || !gameState.unlockedBuildings.includes('workshop');

  // Update special event button
  specialEventButton.disabled = gameState.level < 10 || gameState.eventActive;

  // Create advanced buildings UI dynamically
  createAdvancedBuildingUI();
}

// Create advanced buildings UI
function createAdvancedBuildingUI() {
  // Check if advanced buildings should be shown
  if (gameState.level < 12) return;
  
  // Get the advanced buildings container
  const advancedBuildingsContainer = document.querySelector('#build-tab .build-category:nth-child(2) .build-items');
  if (!advancedBuildingsContainer) return;
  
  // Check for library (level 12+)
  if (gameState.level >= 12 && !document.getElementById('build-library') && gameState.unlockedBuildings.includes('library')) {
    const libraryItem = createBuildingItem(
      'library',
      '📚',
      'Library',
      '+1 Knowledge/cycle',
      [{ icon: '🪵', amount: 30 }, { icon: '🪨', amount: 20 }, { icon: '📚', amount: 5 }]
    );
    advancedBuildingsContainer.appendChild(libraryItem);
  }
  
  // Check for forge (level 16+)
  if (gameState.level >= 16 && !document.getElementById('build-forge') && gameState.unlockedBuildings.includes('forge')) {
    const forgeItem = createBuildingItem(
      'forge',
      '⚒️',
      'Forge',
      '+0.5 Metal/cycle',
      [{ icon: '🪵', amount: 15 }, { icon: '🪨', amount: 40 }, { icon: '💎', amount: 1 }]
    );
    advancedBuildingsContainer.appendChild(forgeItem);
  }
  
  // Check for windmill (level 20+)
  if (gameState.level >= 20 && !document.getElementById('build-windmill') && gameState.unlockedBuildings.includes('windmill')) {
    const windmillItem = createBuildingItem(
      'windmill',
      '🌀',
      'Windmill',
      '+20% Food production',
      [{ icon: '🪵', amount: 35 }, { icon: '🪨', amount: 15 }, { icon: '🍎', amount: 25 }]
    );
    advancedBuildingsContainer.appendChild(windmillItem);
  }
  
  // Check for lighthouse (level 24+)
  if (gameState.level >= 24 && !document.getElementById('build-lighthouse') && gameState.unlockedBuildings.includes('lighthouse')) {
    const lighthouseItem = createBuildingItem(
      'lighthouse',
      '🗼',
      'Lighthouse',
      '+20% Trading bonus',
      [{ icon: '🪵', amount: 30 }, { icon: '🪨', amount: 50 }, { icon: '⚙️', amount: 5 }, { icon: '💎', amount: 2 }]
    );
    advancedBuildingsContainer.appendChild(lighthouseItem);
  }
  
  // Check for observatory (level 28+)
  if (gameState.level >= 28 && !document.getElementById('build-observatory') && gameState.unlockedBuildings.includes('observatory')) {
    const observatoryItem = createBuildingItem(
      'observatory',
      '🔭',
      'Observatory',
      '5% chance for Crystal',
      [{ icon: '🪵', amount: 20 }, { icon: '🪨', amount: 30 }, { icon: '📚', amount: 20 }, { icon: '💎', amount: 3 }]
    );
    advancedBuildingsContainer.appendChild(observatoryItem);
  }
  
  // Check for trading post (level 32+)
  if (gameState.level >= 32 && !document.getElementById('build-tradingPost') && gameState.unlockedBuildings.includes('tradingPost')) {
    const tradingPostItem = createBuildingItem(
      'tradingPost',
      '🏯',
      'Trading Post',
      'Unlocks trading system',
      [{ icon: '🪵', amount: 40 }, { icon: '🪨', amount: 40 }, { icon: '🍎', amount: 40 }, { icon: '⚙️', amount: 10 }, { icon: '💎', amount: 2 }]
    );
    advancedBuildingsContainer.appendChild(tradingPostItem);
  }
  
  // Add event listeners to new building buttons
  document.querySelectorAll('.build-item:not(.has-listener)').forEach(item => {
    const buildButton = item.querySelector('.build-button');
    const buildingType = item.id.replace('build-', '');
    
    if (buildButton) {
      buildButton.addEventListener('click', () => buildStructure(buildingType));
      item.classList.add('has-listener');
    }
  });
}

// Helper function to create building item
function createBuildingItem(type, icon, name, description, costs) {
  const item = document.createElement('div');
  item.className = 'build-item';
  item.id = `build-${type}`;
  
  // Create cost HTML
  let costHTML = '';
  costs.forEach(cost => {
    costHTML += `<span class="cost-item">${cost.icon} ${cost.amount}</span>`;
  });
  
  item.innerHTML = `
    <div class="build-icon">${icon}</div>
    <div class="build-info">
      <h4>${name}</h4>
      <p>${description}</p>
      <div class="build-cost">
        ${costHTML}
      </div>
    </div>
    <div class="build-count">0</div>
    <button class="build-button">Build</button>
  `;
  
  return item;
}

// Update building buttons
function updateBuildingButtons() {
  // Basic buildings
  updateBuildingButton(buildHutButton, 'hut', 'hut');
  updateBuildingButton(buildFarmButton, 'farm', 'farm');
  updateBuildingButton(buildMineButton, 'mine', 'mine');

  // Advanced buildings
  updateBuildingButton(buildWorkshopButton, 'workshop', 'workshop');
  updateBuildingButton(buildTempleButton, 'temple', 'temple');
  updateBuildingButton(buildMarketButton, 'market', 'market');
  
  // Check for any advanced building elements (added dynamically)
  if (gameState.level >= 12) {
    // Library
    const libraryButton = document.getElementById('build-library');
    if (libraryButton) {
      updateBuildingButton(libraryButton, 'library', 'library');
    }
    
    // Forge (level 16+)
    if (gameState.level >= 16) {
      const forgeButton = document.getElementById('build-forge');
      if (forgeButton) {
        updateBuildingButton(forgeButton, 'forge', 'forge');
      }
    }
    
    // Windmill (level 20+)
    if (gameState.level >= 20) {
      const windmillButton = document.getElementById('build-windmill');
      if (windmillButton) {
        updateBuildingButton(windmillButton, 'windmill', 'windmill');
      }
    }
    
    // Lighthouse (level 24+)
    if (gameState.level >= 24) {
      const lighthouseButton = document.getElementById('build-lighthouse');
      if (lighthouseButton) {
        updateBuildingButton(lighthouseButton, 'lighthouse', 'lighthouse');
      }
    }
    
    // Observatory (level 28+)
    if (gameState.level >= 28) {
      const observatoryButton = document.getElementById('build-observatory');
      if (observatoryButton) {
        updateBuildingButton(observatoryButton, 'observatory', 'observatory');
      }
    }
    
    // Trading Post (level 32+)
    if (gameState.level >= 32) {
      const tradingPostButton = document.getElementById('build-tradingPost');
      if (tradingPostButton) {
        updateBuildingButton(tradingPostButton, 'tradingPost', 'tradingPost');
      }
    }
  }

  // Update building counts
  document.querySelectorAll('.build-item').forEach(item => {
    const buildingType = item.id.replace('build-', '');
    const countElement = item.querySelector('.build-count');
    if (countElement) {
      countElement.textContent = gameState.buildings[buildingType] || 0;
    }
  });
}

// Helper function to update a building button
function updateBuildingButton(button, type, unlockKey) {
  if (!button) return;

  const costs = buildingCosts[type];
  const isUnlocked = gameState.unlockedBuildings.includes(unlockKey);
  const hasResources = gameState.resources.wood >= costs.wood &&
                       gameState.resources.stone >= costs.stone &&
                       gameState.resources.food >= costs.food &&
                       gameState.resources.gems >= costs.gems;
  const hasSpace = gameState.buildings.hut +
                   gameState.buildings.farm +
                   gameState.buildings.mine +
                   gameState.buildings.workshop +
                   gameState.buildings.temple +
                   gameState.buildings.market < gameState.maxIslandBuildings;

  button.disabled = !isUnlocked || !hasResources || !hasSpace;

  // Update locked/unlocked visual state
  const parentItem = button.closest('.build-item');
  if (parentItem) {
    if (isUnlocked) {
      parentItem.classList.remove('locked');
    } else {
      parentItem.classList.add('locked');
    }
  }
}

// Update upgrade buttons
function updateUpgradeButtons() {
  updateUpgradeButton(upgradeToolsButton, 'efficientTools', 'efficientTools');
  updateUpgradeButton(upgradeSoilButton, 'fertileSoil', 'fertileSoil');
  updateUpgradeButton(upgradeDrillButton, 'miningDrill', 'miningDrill');
  updateUpgradeButton(upgradeTradeButton, 'tradeRoutes', 'tradeRoutes');

  // Update upgrade levels
  document.querySelectorAll('.upgrade-item').forEach(item => {
    const upgradeType = item.id.replace('upgrade-', '');
    const levelElement = item.querySelector('.upgrade-level');
    if (levelElement) {
      levelElement.textContent = `Lvl ${gameState.upgrades[upgradeType] || 0}`;
    }
  });
}

// Helper function to update an upgrade button
function updateUpgradeButton(button, type, unlockKey) {
  if (!button) return;

  const costs = upgradeCosts[type];
  const isUnlocked = gameState.unlockedUpgrades.includes(unlockKey);
  const hasResources = gameState.resources.wood >= costs.wood &&
                       gameState.resources.stone >= costs.stone &&
                       gameState.resources.food >= costs.food &&
                       gameState.resources.gems >= costs.gems;

  button.disabled = !isUnlocked || !hasResources;

  // Update locked/unlocked visual state
  const parentItem = button.closest('.upgrade-item');
  if (parentItem) {
    if (isUnlocked) {
      parentItem.classList.remove('locked');
    } else {
      parentItem.classList.add('locked');
    }
  }
}

// Check if player can level up
function checkLevelUp() {
  if (gameState.experience >= gameState.experienceToNextLevel) {
    // Level up
    gameState.level++;
    gameState.experience -= gameState.experienceToNextLevel;
    gameState.experienceToNextLevel = Math.floor(gameState.experienceToNextLevel * 1.5);

    // Show level up modal
    showLevelUpModal();

    // Apply level rewards
    applyLevelRewards();

    // Check for more level ups (in case of large XP gain)
    checkLevelUp();
  }
}

// Show level up modal
function showLevelUpModal() {
  // Update modal content
  document.getElementById('new-level').textContent = gameState.level;
  document.getElementById('level-up-text').textContent = gameState.level;

  // Clear previous rewards
  const rewardsList = document.getElementById('level-rewards-list');
  rewardsList.innerHTML = '';

  // Add rewards based on level
  const rewards = levelRewards[gameState.level];
  if (rewards) {
    if (rewards.unlockBuilding) {
      const li = document.createElement('li');
      li.textContent = rewards.message;
      rewardsList.appendChild(li);
    }

    if (rewards.unlockUpgrade) {
      const li = document.createElement('li');
      li.textContent = rewards.message;
      rewardsList.appendChild(li);
    }

    if (rewards.energyBoost) {
      const li = document.createElement('li');
      li.textContent = `+${rewards.energyBoost} Max Energy`;
      rewardsList.appendChild(li);
    }

    if (rewards.gems) {
      const li = document.createElement('li');
      li.textContent = `+${rewards.gems} Gem${rewards.gems > 1 ? 's' : ''}`;
      rewardsList.appendChild(li);
    }

    if (rewards.expandIsland) {
      const li = document.createElement('li');
      li.textContent = 'Island Expansion Available';
      rewardsList.appendChild(li);
    }

    if (rewards.specialEvent) {
      const li = document.createElement('li');
      li.textContent = 'Special Events Unlocked';
      rewardsList.appendChild(li);
    }
  } else {
    // Generic rewards for levels without specific rewards
    const li1 = document.createElement('li');
    li1.textContent = '+10 Max Energy';
    rewardsList.appendChild(li1);

    const li2 = document.createElement('li');
    li2.textContent = '+1 Gem';
    rewardsList.appendChild(li2);
  }

  // Show the modal
  levelUpModal.style.display = 'block';
}

// Apply level rewards
function applyLevelRewards() {
  const rewards = levelRewards[gameState.level];

  if (rewards) {
    // Unlock building
    if (rewards.unlockBuilding && !gameState.unlockedBuildings.includes(rewards.unlockBuilding)) {
      gameState.unlockedBuildings.push(rewards.unlockBuilding);
    }

    // Unlock upgrade
    if (rewards.unlockUpgrade && !gameState.unlockedUpgrades.includes(rewards.unlockUpgrade)) {
      gameState.unlockedUpgrades.push(rewards.unlockUpgrade);
    }

    // Energy boost
    if (rewards.energyBoost) {
      gameState.resources.maxEnergy += rewards.energyBoost;
      gameState.resources.energy = gameState.resources.maxEnergy; // Refill energy on level up
    }

    // Gems
    if (rewards.gems) {
      gameState.resources.gems += rewards.gems;
    }

    // Enable special events
    if (rewards.specialEvent) {
      specialEventButton.disabled = false;
    }
  } else {
    // Generic rewards for levels without specific rewards
    gameState.resources.maxEnergy += 10;
    gameState.resources.energy = gameState.resources.maxEnergy;
    gameState.resources.gems += 1;
  }

  // Update display
  updateGameDisplay();
}

// Create a new tile
function createTile() {
  // Weighted random selection based on rarity
  const tileType = selectWeightedTile();

  // Create the tile element
  const tile = document.createElement('div');
  tile.className = 'tile';
  tile.style.backgroundColor = tileType.color;
  tile.textContent = tileType.label;

  // Add data attribute for resource type
  tile.dataset.resourceType = tileType.resource;

  // Add click event to collect resource
  tile.addEventListener('click', () => {
    // Check if player has energy
    if (gameState.resources.energy < 1) {
      showNotification('Not enough energy! Wait for energy to regenerate or use gems to refill.');
      return;
    }
    
    // Get resource caps
    const resourceCaps = calculateResourceCaps();
    
    // Check if resource is at cap
    if (gameState.resources[tileType.resource] >= resourceCaps[tileType.resource]) {
      showNotification(`${tileType.resource.charAt(0).toUpperCase() + tileType.resource.slice(1)} storage is full! Upgrade storage or use resources.`);
      return;
    }

    // Consume energy
    gameState.resources.energy--;

    // Calculate resource amount with multipliers
    let amount = 1 * gameState.multiplier * gameState.eventMultiplier;

    // Apply upgrade multipliers
    if (tileType.resource === 'wood' && gameState.upgrades.efficientTools > 0) {
      amount *= (1 + (gameState.upgrades.efficientTools * upgradeBenefits.efficientTools.woodMultiplier));
    } else if (tileType.resource === 'food' && gameState.upgrades.fertileSoil > 0) {
      amount *= (1 + (gameState.upgrades.fertileSoil * upgradeBenefits.fertileSoil.foodMultiplier));
    } else if (tileType.resource === 'stone' && gameState.upgrades.miningDrill > 0) {
      amount *= (1 + (gameState.upgrades.miningDrill * upgradeBenefits.miningDrill.stoneMultiplier));
    }

    // Apply trade routes upgrade to all resources
    if (gameState.upgrades.tradeRoutes > 0) {
      amount *= (1 + (gameState.upgrades.tradeRoutes * upgradeBenefits.tradeRoutes.allResourceMultiplier));
    }

    // Apply market building bonus if any
    if (gameState.buildings.market > 0) {
      amount *= (1 + (gameState.buildings.market * buildingBenefits.market.resourceMultiplier));
    }

    // Round to 1 decimal place for most resources, but keep gems as integers
    if (tileType.resource === 'gems') {
      amount = Math.floor(amount);
    } else {
      amount = Math.round(amount * 10) / 10;
    }
    
    // Cap resource amount to available storage
    const currentAmount = gameState.resources[tileType.resource];
    const cap = resourceCaps[tileType.resource];
    if (currentAmount + amount > cap) {
      amount = cap - currentAmount;
      showNotification(`${tileType.resource.charAt(0).toUpperCase() + tileType.resource.slice(1)} storage nearly full!`);
    }

    // Add resource
    gameState.resources[tileType.resource] += amount;

    // Add points to score
    gameState.score += tileType.points * gameState.multiplier;

    // Add experience
    gameState.experience += tileType.points;

    // Update statistics
    gameState.statistics.tilesClicked++;
    gameState.statistics.resourcesCollected += amount;

    // Update quest progress
    updateQuestProgress('resourceGatherer', amount);
    
    // Track seasonal harvest quest for summer
    if (tileType.resource === 'food' && getCurrentSeason() === 'summer') {
      updateQuestProgress('seasonalHarvest', amount);
    }

    // Check for level up
    checkLevelUp();

    // Update streak
    updateStreak();

    // Check achievements
    checkAchievements();

    // Show resource gain notification
    showNotification(`+${amount.toFixed(1)} ${tileType.resource.charAt(0).toUpperCase() + tileType.resource.slice(1)}`);

    // Update display
    updateGameDisplay();

    // Replace the tile with a new one
    tile.remove();
    boardElement.appendChild(createTile());
  });

  return tile;
}

// Select a tile type based on weighted rarity and player level
function selectWeightedTile() {
  // Filter tile types based on player level
  const availableTileTypes = tileTypes.filter(type => gameState.level >= type.minLevel);

  // Apply season effects to rarities
  const seasonAdjustedTileTypes = availableTileTypes.map(type => {
    let adjustedRarity = type.rarity;

    // Apply seasonal effects
    const season = getCurrentSeason();
    if (type.resource === 'wood' && season === 'fall') {
      adjustedRarity *= 1.2; // More wood in fall
    } else if (type.resource === 'food' && season === 'summer') {
      adjustedRarity *= 1.2; // More food in summer
    } else if (type.resource === 'stone' && season === 'winter') {
      adjustedRarity *= 1.1; // Slightly more stone in winter
    } else if (type.resource === 'crystal' && season === 'winter') {
      adjustedRarity *= 1.5; // More crystals in winter
    }

    // Apply random event effects
    if (gameState.activeRandomEvent) {
      const event = randomEvents.find(e => e.id === gameState.activeRandomEvent);
      if (event && event.effects) {
        if (type.resource === 'crystal' && event.effects.crystalChanceMultiplier) {
          adjustedRarity *= event.effects.crystalChanceMultiplier;
        }
      }
    }

    return { ...type, adjustedRarity };
  });

  // Calculate total adjusted rarity
  const totalRarity = seasonAdjustedTileTypes.reduce((sum, type) => sum + type.adjustedRarity, 0);

  // Generate random value
  const random = Math.random() * totalRarity;

  // Find the tile type
  let cumulativeRarity = 0;
  for (const tileType of seasonAdjustedTileTypes) {
    cumulativeRarity += tileType.adjustedRarity;
    if (random <= cumulativeRarity) {
      return tileType;
    }
  }

  // Fallback to first tile type
  return availableTileTypes[0];
}

// Get current season name
function getCurrentSeason() {
  const seasons = ['spring', 'summer', 'fall', 'winter'];
  return seasons[gameState.currentSeason];
}

// Update streak counter
function updateStreak() {
  // Clear previous timeout
  if (gameState.streakTimeout) {
    clearTimeout(gameState.streakTimeout);
  }

  // Increment streak
  gameState.streak++;

  // Update max streak
  if (gameState.streak > gameState.maxStreak) {
    gameState.maxStreak = gameState.streak;

    // Update statistics
    if (gameState.maxStreak > gameState.statistics.longestStreak) {
      gameState.statistics.longestStreak = gameState.maxStreak;
    }

    // Update achievement progress
    updateAchievementProgress('comboMaster', gameState.maxStreak);
  }

  // Calculate multiplier (max 10x)
  gameState.multiplier = Math.min(Math.floor(gameState.streak / 3) + 1, 10);

  // Set timeout to reset streak
  gameState.streakTimeout = setTimeout(() => {
    gameState.streak = 0;
    gameState.multiplier = 1;
    updateGameDisplay();
  }, gameState.streakTimeWindow);
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
  const benefits = buildingBenefits[type];

  if (gameState.resources.wood >= cost.wood &&
      gameState.resources.stone >= cost.stone &&
      gameState.resources.food >= cost.food &&
      gameState.resources.gems >= cost.gems) {

    // Deduct resources
    gameState.resources.wood -= cost.wood;
    gameState.resources.stone -= cost.stone;
    gameState.resources.food -= cost.food;
    gameState.resources.gems -= cost.gems;

    // Increment building count
    gameState.buildings[type]++;

    // Add points to score
    gameState.score += benefits.points;

    // Add experience
    gameState.experience += benefits.points / 2;

    // Update population and happiness
    if (benefits.population) {
      gameState.population += benefits.population;
    }

    if (benefits.happiness) {
      gameState.happiness = Math.max(0, Math.min(100, gameState.happiness + benefits.happiness));
    }

    // Create the building
    const building = document.createElement('div');
    building.className = `building ${type}`;

    // Set building icon based on type
    let buildingIcon = '';
    if (type === 'hut') {
      buildingIcon = '🏠';
    } else if (type === 'farm') {
      buildingIcon = '🌾';
    } else if (type === 'mine') {
      buildingIcon = '⛏️';
    } else if (type === 'workshop') {
      buildingIcon = '🔨';
    } else if (type === 'temple') {
      buildingIcon = '🏛️';
    } else if (type === 'market') {
      buildingIcon = '🏪';
    }

    building.textContent = buildingIcon;

    // Add to island
    islandElement.appendChild(building);

    // Show notification
    showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} built successfully!`);

    // Update statistics
    gameState.statistics.buildingsConstructed++;

    // Update quest progress
    if (type === 'hut') {
      updateQuestProgress('islandStarter', 1);
    }

    // Update achievement progress
    const totalBuildings = Object.values(gameState.buildings).reduce((sum, count) => sum + count, 0);
    updateAchievementProgress('firstSteps', totalBuildings);

    // Check for level up
    checkLevelUp();

    // Update display
    updateGameDisplay();
  }
}

// Perform an upgrade
function performUpgrade(type) {
  // Check if we have enough resources
  const cost = upgradeCosts[type];
  const benefits = upgradeBenefits[type];

  if (gameState.resources.wood >= cost.wood &&
      gameState.resources.stone >= cost.stone &&
      gameState.resources.food >= cost.food &&
      gameState.resources.gems >= cost.gems) {

    // Deduct resources
    gameState.resources.wood -= cost.wood;
    gameState.resources.stone -= cost.stone;
    gameState.resources.food -= cost.food;
    gameState.resources.gems -= cost.gems;

    // Increment upgrade level
    gameState.upgrades[type]++;

    // Add points to score
    gameState.score += benefits.points;

    // Add experience
    gameState.experience += benefits.points / 2;

    // Show notification
    const upgradeName = type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    showNotification(`${upgradeName} upgraded to level ${gameState.upgrades[type]}!`);

    // Check for level up
    checkLevelUp();

    // Update display
    updateGameDisplay();
  }
}

// Update quest progress
function updateQuestProgress(questId, amount = 1) {
  // Find the quest
  const quest = gameState.quests.find(q => q.id === questId);

  if (quest && !quest.completed && gameState.activeQuests.includes(questId)) {
    // Update progress
    quest.progress = Math.min(quest.progress + amount, quest.target);

    // Update quest display
    updateQuestDisplay();

    // Check if completed
    if (quest.progress >= quest.target) {
      completeQuest(questId);
    }
  }
}

// Complete a quest
function completeQuest(questId) {
  // Find the quest
  const quest = gameState.quests.find(q => q.id === questId);

  if (quest && !quest.completed) {
    // Mark as completed
    quest.completed = true;

    // Remove from active quests
    const index = gameState.activeQuests.indexOf(questId);
    if (index !== -1) {
      gameState.activeQuests.splice(index, 1);
    }

    // Add to completed quests
    gameState.completedQuests.push(questId);

    // Award rewards
    if (quest.rewards) {
      // Resources
      if (quest.rewards.wood) gameState.resources.wood += quest.rewards.wood;
      if (quest.rewards.stone) gameState.resources.stone += quest.rewards.stone;
      if (quest.rewards.food) gameState.resources.food += quest.rewards.food;
      if (quest.rewards.gems) gameState.resources.gems += quest.rewards.gems;

      // Experience
      if (quest.rewards.xp) gameState.experience += quest.rewards.xp;
    }

    // Show notification
    showNotification(`Quest completed: ${quest.name}! Rewards claimed.`);

    // Update quest display
    updateQuestDisplay();

    // Check for level up
    checkLevelUp();

    // Update display
    updateGameDisplay();
  }
}

// Update quest display
function updateQuestDisplay() {
  // Clear active quests
  activeQuestList.innerHTML = '';

  // Add active quests
  gameState.activeQuests.forEach(questId => {
    const quest = gameState.quests.find(q => q.id === questId);
    if (quest) {
      const questItem = document.createElement('div');
      questItem.className = 'quest-item';

      const progressPercent = Math.min(100, (quest.progress / quest.target) * 100);

      questItem.innerHTML = `
        <div class="quest-info">
          <h4>${quest.name}</h4>
          <p>${quest.description}</p>
          <div class="quest-progress">
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: ${progressPercent}%"></div>
            </div>
            <span>${quest.progress}/${quest.target}</span>
          </div>
        </div>
        <div class="quest-reward">
          ${quest.rewards.wood ? `<span class="reward-item">🪵 +${quest.rewards.wood}</span>` : ''}
          ${quest.rewards.stone ? `<span class="reward-item">🪨 +${quest.rewards.stone}</span>` : ''}
          ${quest.rewards.food ? `<span class="reward-item">🍎 +${quest.rewards.food}</span>` : ''}
          ${quest.rewards.gems ? `<span class="reward-item">💎 +${quest.rewards.gems}</span>` : ''}
          ${quest.rewards.xp ? `<span class="reward-item">XP +${quest.rewards.xp}</span>` : ''}
        </div>
      `;

      activeQuestList.appendChild(questItem);
    }
  });

  // Clear completed quests
  completedQuestList.innerHTML = '';

  // Add completed quests
  gameState.completedQuests.forEach(questId => {
    const quest = gameState.quests.find(q => q.id === questId);
    if (quest) {
      const questItem = document.createElement('div');
      questItem.className = 'quest-item completed';

      questItem.innerHTML = `
        <div class="quest-info">
          <h4>${quest.name}</h4>
          <p>${quest.description}</p>
          <div class="quest-progress">
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: 100%"></div>
            </div>
            <span>Completed</span>
          </div>
        </div>
      `;

      completedQuestList.appendChild(questItem);
    }
  });
}

// Update achievement progress
function updateAchievementProgress(achievementId, value) {
  // Find the achievement
  const achievement = gameState.achievements.find(a => a.id === achievementId);

  if (achievement && !achievement.completed) {
    // Update progress
    achievement.progress = Math.max(achievement.progress, value);

    // Update achievement display
    updateAchievementDisplay();

    // Check if completed
    if (achievement.progress >= achievement.target) {
      completeAchievement(achievementId);
    }
  }
}

// Complete an achievement
function completeAchievement(achievementId) {
  // Find the achievement
  const achievement = gameState.achievements.find(a => a.id === achievementId);

  if (achievement && !achievement.completed) {
    // Mark as completed
    achievement.completed = true;

    // Award rewards
    if (achievement.rewards) {
      // Experience
      if (achievement.rewards.xp) gameState.experience += achievement.rewards.xp;

      // Gems
      if (achievement.rewards.gems) gameState.resources.gems += achievement.rewards.gems;
    }

    // Show achievement modal
    showAchievementModal(achievement);

    // Update achievement display
    updateAchievementDisplay();

    // Check for level up
    checkLevelUp();

    // Update display
    updateGameDisplay();
  }
}

// Show achievement modal
function showAchievementModal(achievement) {
  // Update modal content
  document.getElementById('achievement-icon').textContent = getAchievementIcon(achievement.id);
  document.getElementById('achievement-title').textContent = achievement.name;
  document.getElementById('achievement-description').textContent = achievement.description;

  // Clear previous rewards
  const rewardsList = document.getElementById('achievement-rewards-list');
  rewardsList.innerHTML = '';

  // Add rewards
  if (achievement.rewards.xp) {
    const li = document.createElement('li');
    li.textContent = `+${achievement.rewards.xp} XP`;
    rewardsList.appendChild(li);
  }

  if (achievement.rewards.gems) {
    const li = document.createElement('li');
    li.textContent = `+${achievement.rewards.gems} Gem${achievement.rewards.gems > 1 ? 's' : ''}`;
    rewardsList.appendChild(li);
  }

  // Show the modal
  achievementModal.style.display = 'block';
}

// Get achievement icon
function getAchievementIcon(achievementId) {
  switch (achievementId) {
    case 'firstSteps': return '🏆';
    case 'resourceBaron': return '⭐';
    case 'comboMaster': return '🔥';
    default: return '🏅';
  }
}

// Update achievement display
function updateAchievementDisplay() {
  // Clear achievements
  achievementList.innerHTML = '';

  // Add achievements
  gameState.achievements.forEach(achievement => {
    const achievementItem = document.createElement('div');
    achievementItem.className = `achievement-item ${achievement.completed ? 'completed' : 'locked'}`;

    achievementItem.innerHTML = `
      <div class="achievement-icon">${getAchievementIcon(achievement.id)}</div>
      <div class="achievement-info">
        <h4>${achievement.name}</h4>
        <p>${achievement.description}</p>
      </div>
      <div class="achievement-progress">${achievement.completed ? 'Completed' : `${achievement.progress}/${achievement.target}`}</div>
    `;

    achievementList.appendChild(achievementItem);
  });
}

// Reset the game
function resetGame() {
  if (confirm('Are you sure you want to reset the game? All progress will be lost!')) {
    // Reset resources
    gameState.resources.wood = 0;
    gameState.resources.stone = 0;
    gameState.resources.food = 0;
    gameState.resources.gems = 0;
    gameState.resources.energy = 100;
    gameState.resources.maxEnergy = 100;

    // Reset game progress
    gameState.score = 0;
    gameState.level = 1;
    gameState.experience = 0;
    gameState.experienceToNextLevel = 100;
    gameState.streak = 0;
    gameState.maxStreak = 0;
    gameState.multiplier = 1;
    gameState.population = 0;
    gameState.happiness = 100;
    gameState.islandSize = 1;
    gameState.maxIslandBuildings = 9;

    // Reset buildings
    for (const building in gameState.buildings) {
      gameState.buildings[building] = 0;
    }

    // Reset upgrades
    for (const upgrade in gameState.upgrades) {
      gameState.upgrades[upgrade] = 0;
    }

    // Reset unlocks
    gameState.unlockedBuildings = ['hut', 'farm'];
    gameState.unlockedUpgrades = ['efficientTools', 'fertileSoil'];

    // Reset quests
    gameState.quests.forEach(quest => {
      quest.progress = 0;
      quest.completed = false;
    });
    gameState.activeQuests = ['islandStarter', 'resourceGatherer'];
    gameState.completedQuests = [];

    // Reset achievements
    gameState.achievements.forEach(achievement => {
      achievement.progress = 0;
      achievement.completed = false;
    });

    // Reset statistics
    for (const stat in gameState.statistics) {
      gameState.statistics[stat] = 0;
    }

    // Reset event state
    gameState.eventActive = false;
    gameState.eventEndTime = null;
    gameState.eventMultiplier = 1;

    // Clear the island
    islandElement.innerHTML = '';

    // Reinitialize the board
    initializeBoard();

    // Update displays
    updateGameDisplay();
    updateQuestDisplay();
    updateAchievementDisplay();

    // Show notification
    showNotification('Game reset successfully!');

    // Save the reset state
    saveGame();
  }
}

// Generate passive resources based on buildings
function generatePassiveResources() {
  let resourcesGenerated = false;
  let notificationMessage = "Resources generated: ";

  // Calculate happiness multiplier (50% to 150% based on happiness)
  const happinessMultiplier = 0.5 + (gameState.happiness / 100);

  // Farms generate food
  if (gameState.buildings.farm > 0) {
    const foodGenerated = Math.round(gameState.buildings.farm * happinessMultiplier * 10) / 10;
    gameState.resources.food += foodGenerated;
    notificationMessage += `${foodGenerated} Food `;
    resourcesGenerated = true;

    // Update resource gatherer quest
    updateQuestProgress('resourceGatherer', foodGenerated);
  }

  // Mines generate stone
  if (gameState.buildings.mine > 0) {
    const stoneGenerated = Math.round(gameState.buildings.mine * happinessMultiplier * 10) / 10;
    gameState.resources.stone += stoneGenerated;
    notificationMessage += `${stoneGenerated} Stone `;
    resourcesGenerated = true;

    // Update resource gatherer quest
    updateQuestProgress('resourceGatherer', stoneGenerated);
  }

  // Workshops generate wood
  if (gameState.buildings.workshop > 0) {
    const woodGenerated = Math.round(gameState.buildings.workshop * buildingBenefits.workshop.woodProduction * happinessMultiplier * 10) / 10;
    gameState.resources.wood += woodGenerated;
    notificationMessage += `${woodGenerated} Wood `;
    resourcesGenerated = true;

    // Update resource gatherer quest
    updateQuestProgress('resourceGatherer', woodGenerated);
  }

  // Temples generate gems
  if (gameState.buildings.temple > 0) {
    const gemsGenerated = Math.floor(gameState.buildings.temple * buildingBenefits.temple.gemProduction * happinessMultiplier);
    if (gemsGenerated > 0) {
      gameState.resources.gems += gemsGenerated;
      notificationMessage += `${gemsGenerated} Gems `;
      resourcesGenerated = true;
    }
  }

  // Regenerate energy
  const energyRegenerated = gameState.resources.energyRegenRate;
  if (gameState.resources.energy < gameState.resources.maxEnergy) {
    gameState.resources.energy = Math.min(gameState.resources.maxEnergy, gameState.resources.energy + energyRegenerated);
    resourcesGenerated = true;
  }

  // Show notification and update display if resources were generated
  if (resourcesGenerated) {
    showNotification(notificationMessage);
    updateGameDisplay();

    // Check for level up
    checkLevelUp();

    // Check achievements
    const totalResources = gameState.statistics.resourcesCollected;
    updateAchievementProgress('resourceBaron', totalResources);

    // Save game
    saveGame();
  }
}

// Check for daily rewards
function checkDailyReward() {
  const now = new Date();
  const lastReward = gameState.lastDailyReward ? new Date(gameState.lastDailyReward) : null;

  // Check if a day has passed since last reward
  if (!lastReward || now.getDate() !== lastReward.getDate() || now.getMonth() !== lastReward.getMonth() || now.getFullYear() !== lastReward.getFullYear()) {
    // Enable daily reward button
    dailyRewardButton.classList.add('pulse');
    dailyRewardButton.disabled = false;
  } else {
    // Disable daily reward button
    dailyRewardButton.classList.remove('pulse');
    dailyRewardButton.disabled = true;
  }
}

// Show daily reward modal
function showDailyRewardModal() {
  // Update streak count
  dailyStreakCount.textContent = gameState.dailyStreak + 1;

  // Highlight current day
  rewardCalendar.forEach(day => {
    const dayNum = parseInt(day.dataset.day);
    if (dayNum === ((gameState.dailyStreak % 7) + 1)) {
      day.classList.add('active');
    } else {
      day.classList.remove('active');
    }
  });

  // Show the modal
  dailyRewardModal.style.display = 'block';
}

// Claim daily reward
function claimDailyReward() {
  // Increment streak
  gameState.dailyStreak++;

  // Set last reward time
  gameState.lastDailyReward = new Date().toISOString();

  // Determine rewards based on streak day
  const day = (gameState.dailyStreak % 7) || 7; // 1-7
  let woodReward = 0;
  let stoneReward = 0;
  let foodReward = 0;
  let gemReward = 0;

  switch (day) {
    case 1:
      woodReward = 10;
      break;
    case 2:
      foodReward = 10;
      break;
    case 3:
      stoneReward = 10;
      break;
    case 4:
      gemReward = 1;
      break;
    case 5:
      woodReward = 15;
      stoneReward = 15;
      foodReward = 15;
      break;
    case 6:
      gemReward = 2;
      break;
    case 7:
      gemReward = 5;
      break;
  }

  // Apply rewards
  gameState.resources.wood += woodReward;
  gameState.resources.stone += stoneReward;
  gameState.resources.food += foodReward;
  gameState.resources.gems += gemReward;

  // Show notification
  let rewardMessage = 'Daily reward claimed: ';
  if (woodReward) rewardMessage += `${woodReward} Wood `;
  if (stoneReward) rewardMessage += `${stoneReward} Stone `;
  if (foodReward) rewardMessage += `${foodReward} Food `;
  if (gemReward) rewardMessage += `${gemReward} Gems `;

  showNotification(rewardMessage);

  // Close modal
  dailyRewardModal.style.display = 'none';

  // Update display
  updateGameDisplay();

  // Disable button
  dailyRewardButton.disabled = true;
  dailyRewardButton.classList.remove('pulse');

  // Save game
  saveGame();
}

// Start special event
function startSpecialEvent() {
  // Check if player has enough gems
  if (gameState.resources.gems < 2) {
    showNotification('Not enough gems to start the event!');
    return;
  }

  // Deduct gems
  gameState.resources.gems -= 2;

  // Set event duration (30 minutes)
  const eventDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
  gameState.eventEndTime = Date.now() + eventDuration;
  gameState.eventActive = true;
  gameState.eventMultiplier = 2;

  // Update event timer display
  updateEventTimer();

  // Enable event timer update
  const eventTimerInterval = setInterval(() => {
    if (!gameState.eventActive) {
      clearInterval(eventTimerInterval);
      return;
    }

    updateEventTimer();
  }, 1000);

  // Close modal
  specialEventModal.style.display = 'none';

  // Show notification
  showNotification('Special event started! All resource gains are doubled for 30 minutes.');

  // Update display
  updateGameDisplay();

  // Save game
  saveGame();
}

// Update event timer
function updateEventTimer() {
  if (!gameState.eventActive || !gameState.eventEndTime) return;

  const now = Date.now();
  const timeRemaining = gameState.eventEndTime - now;

  if (timeRemaining <= 0) {
    // Event ended
    gameState.eventActive = false;
    gameState.eventMultiplier = 1;
    gameState.eventEndTime = null;

    // Update display
    document.getElementById('event-timer').textContent = '00:00';
    specialEventButton.disabled = false;

    // Show notification
    showNotification('Special event ended.');

    // Update display
    updateGameDisplay();

    return;
  }

  // Format time remaining
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  document.getElementById('event-timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Disable special event button during active event
  specialEventButton.disabled = true;
}

// Expand island
function expandIsland() {
  // Check if player has enough gems
  if (gameState.resources.gems < 5) {
    showNotification('Not enough gems to expand your island!');
    return;
  }

  // Deduct gems
  gameState.resources.gems -= 5;

  // Increase island size
  gameState.islandSize++;
  gameState.maxIslandBuildings += 4; // Add 4 more building slots

  // Show notification
  showNotification(`Island expanded! You can now build up to ${gameState.maxIslandBuildings} buildings.`);

  // Update display
  updateGameDisplay();

  // Save game
  saveGame();
}

// Decorate island
function decorateIsland() {
  // Check if player has enough gems
  if (gameState.resources.gems < 2) {
    showNotification('Not enough gems to decorate your island!');
    return;
  }

  // Deduct gems
  gameState.resources.gems -= 2;

  // Increase happiness
  const happinessBoost = 10;
  gameState.happiness = Math.min(100, gameState.happiness + happinessBoost);

  // Add decoration
  const decorations = ['🌴', '🌺', '🌵', '🌲', '🌳', '🌻', '🌼', '🌸', '🍄'];
  const decoration = decorations[Math.floor(Math.random() * decorations.length)];

  const decorElement = document.createElement('div');
  decorElement.className = 'decoration';
  decorElement.textContent = decoration;
  decorElement.style.left = `${Math.random() * 80 + 10}%`;
  decorElement.style.top = `${Math.random() * 80 + 10}%`;

  islandElement.appendChild(decorElement);

  // Show notification
  showNotification(`Island decorated! Happiness increased by ${happinessBoost}%.`);

  // Update display
  updateGameDisplay();

  // Save game
  saveGame();
}

// Save game to localStorage
function saveGame() {
  try {
    // Update last save time
    gameState.lastSaveTime = Date.now();

    // Convert gameState to JSON string
    const saveData = JSON.stringify(gameState);

    // Save to localStorage
    localStorage.setItem('puzzleColonySave', saveData);

    return true;
  } catch (error) {
    console.error('Error saving game:', error);
    return false;
  }
}

// Load game from localStorage
function loadGame() {
  try {
    // Get save data from localStorage
    const saveData = localStorage.getItem('puzzleColonySave');

    if (!saveData) {
      return false;
    }

    // Parse save data
    const loadedState = JSON.parse(saveData);

    // Store the last play time before updating
    const previousPlayTime = loadedState.lastPlayTime;

    // Update gameState with loaded data
    for (const key in loadedState) {
      if (gameState.hasOwnProperty(key)) {
        gameState[key] = loadedState[key];
      }
    }

    // Calculate offline progress
    if (gameState.settings.offlineProgressEnabled) {
      calculateOfflineProgress(previousPlayTime);
    }

    // Update last play time to now
    gameState.lastPlayTime = Date.now();

    // Rebuild the island
    rebuildIsland();

    return true;
  } catch (error) {
    console.error('Error loading game:', error);
    return false;
  }
}

// Calculate resources earned while offline
function calculateOfflineProgress(previousTime) {
  if (!previousTime) return;

  const now = Date.now();
  let offlineTime = now - previousTime;

  // Cap offline time to maximum allowed
  if (offlineTime > gameState.maxOfflineTime) {
    offlineTime = gameState.maxOfflineTime;
  }

  // If less than a minute, don't calculate offline progress
  if (offlineTime < 60000) return;

  // Calculate how many resource generation cycles occurred (every 10 seconds)
  const cycles = Math.floor(offlineTime / 10000);

  if (cycles <= 0) return;

  // Calculate happiness multiplier
  const happinessMultiplier = 0.5 + (gameState.happiness / 100);

  // Calculate season effects
  const season = getCurrentSeason();
  const seasonEffects = gameState.seasonEffects[season];

  // Initialize resource gains
  let woodGained = 0;
  let stoneGained = 0;
  let foodGained = 0;
  let gemsGained = 0;
  let knowledgeGained = 0;
  let metalGained = 0;
  let crystalGained = 0;

  // Calculate passive resource generation
  // Farms generate food
  if (gameState.buildings.farm > 0) {
    const foodMultiplier = 1 + (seasonEffects.food || 0);
    foodGained = gameState.buildings.farm * happinessMultiplier * foodMultiplier * cycles * 0.8; // 80% efficiency when offline
  }

  // Mines generate stone
  if (gameState.buildings.mine > 0) {
    const stoneMultiplier = 1 + (seasonEffects.stone || 0);
    stoneGained = gameState.buildings.mine * happinessMultiplier * stoneMultiplier * cycles * 0.8;
  }

  // Workshops generate wood
  if (gameState.buildings.workshop > 0) {
    const woodMultiplier = 1 + (seasonEffects.wood || 0);
    woodGained = gameState.buildings.workshop * buildingBenefits.workshop.woodProduction * happinessMultiplier * woodMultiplier * cycles * 0.8;
  }

  // Temples generate gems
  if (gameState.buildings.temple > 0) {
    gemsGained = Math.floor(gameState.buildings.temple * buildingBenefits.temple.gemProduction * happinessMultiplier * cycles * 0.7); // 70% efficiency for gems
  }

  // Libraries generate knowledge
  if (gameState.buildings.library > 0) {
    knowledgeGained = gameState.buildings.library * buildingBenefits.library.knowledgeProduction * happinessMultiplier * cycles * 0.8;
  }

  // Forges generate metal
  if (gameState.buildings.forge > 0) {
    metalGained = gameState.buildings.forge * buildingBenefits.forge.metalProduction * happinessMultiplier * cycles * 0.8;
  }

  // Observatories have a chance to generate crystals
  if (gameState.buildings.observatory > 0) {
    const crystalChance = buildingBenefits.observatory.crystalChance * happinessMultiplier * cycles * 0.6; // 60% efficiency for crystals
    crystalGained = Math.floor(gameState.buildings.observatory * crystalChance);
  }

  // Apply windmill bonus to food if present
  if (gameState.buildings.windmill > 0) {
    foodGained *= (1 + buildingBenefits.windmill.foodMultiplier);
  }

  // Round resources to 1 decimal place
  woodGained = Math.round(woodGained * 10) / 10;
  stoneGained = Math.round(stoneGained * 10) / 10;
  foodGained = Math.round(foodGained * 10) / 10;
  knowledgeGained = Math.round(knowledgeGained * 10) / 10;
  metalGained = Math.round(metalGained * 10) / 10;

  // Add resources
  gameState.resources.wood += woodGained;
  gameState.resources.stone += stoneGained;
  gameState.resources.food += foodGained;
  gameState.resources.gems += gemsGained;
  gameState.resources.knowledge += knowledgeGained;
  gameState.resources.metal += metalGained;
  gameState.resources.crystal += crystalGained;

  // Update statistics
  gameState.statistics.offlineResourcesCollected += woodGained + stoneGained + foodGained + gemsGained + knowledgeGained + metalGained + crystalGained;

  // Calculate offline time in a readable format
  const hours = Math.floor(offlineTime / (1000 * 60 * 60));
  const minutes = Math.floor((offlineTime % (1000 * 60 * 60)) / (1000 * 60));

  // Create notification message
  let offlineMessage = `Welcome back! While you were away for ${hours}h ${minutes}m, you earned:`;
  if (woodGained > 0) offlineMessage += `\n🪵 ${woodGained.toFixed(1)} Wood`;
  if (stoneGained > 0) offlineMessage += `\n🪨 ${stoneGained.toFixed(1)} Stone`;
  if (foodGained > 0) offlineMessage += `\n🍎 ${foodGained.toFixed(1)} Food`;
  if (gemsGained > 0) offlineMessage += `\n💎 ${gemsGained} Gems`;
  if (knowledgeGained > 0) offlineMessage += `\n📚 ${knowledgeGained.toFixed(1)} Knowledge`;
  if (metalGained > 0) offlineMessage += `\n⚙️ ${metalGained.toFixed(1)} Metal`;
  if (crystalGained > 0) offlineMessage += `\n💠 ${crystalGained} Crystal`;

  // Show offline progress notification
  showOfflineProgressModal(offlineMessage);
}

// Show offline progress modal
function showOfflineProgressModal(message) {
  // Create modal if it doesn't exist
  if (!document.getElementById('offline-progress-modal')) {
    const modal = document.createElement('div');
    modal.id = 'offline-progress-modal';
    modal.className = 'modal';

    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <h2>Offline Progress</h2>
        <div class="offline-progress-container">
          <p id="offline-progress-message"></p>
        </div>
        <button id="offline-progress-claim" class="claim-button">Claim Resources</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    document.getElementById('offline-progress-claim').addEventListener('click', () => {
      document.getElementById('offline-progress-modal').style.display = 'none';
    });

    document.querySelector('#offline-progress-modal .close-button').addEventListener('click', () => {
      document.getElementById('offline-progress-modal').style.display = 'none';
    });
  }

  // Update message
  document.getElementById('offline-progress-message').innerText = message;

  // Show modal
  document.getElementById('offline-progress-modal').style.display = 'block';
}

// Rebuild island from saved state
function rebuildIsland() {
  // Clear the island
  islandElement.innerHTML = '';

  // Rebuild buildings
  for (const [type, count] of Object.entries(gameState.buildings)) {
    for (let i = 0; i < count; i++) {
      // Create the building
      const building = document.createElement('div');
      building.className = `building ${type}`;

      // Set building icon based on type
      let buildingIcon = '';
      if (type === 'hut') {
        buildingIcon = '🏠';
      } else if (type === 'farm') {
        buildingIcon = '🌾';
      } else if (type === 'mine') {
        buildingIcon = '⛏️';
      } else if (type === 'workshop') {
        buildingIcon = '🔨';
      } else if (type === 'temple') {
        buildingIcon = '🏛️';
      } else if (type === 'market') {
        buildingIcon = '🏪';
      }

      building.textContent = buildingIcon;

      // Add to island
      islandElement.appendChild(building);
    }
  }
}

// Check achievements
function checkAchievements() {
  // First Steps achievement
  const totalBuildings = Object.values(gameState.buildings).reduce((sum, count) => sum + count, 0);
  updateAchievementProgress('firstSteps', totalBuildings);

  // Resource Baron achievement
  const totalResources = gameState.statistics.resourcesCollected;
  updateAchievementProgress('resourceBaron', totalResources);

  // Combo Master achievement
  updateAchievementProgress('comboMaster', gameState.maxStreak);
}

// Tab navigation
function switchTab(tabName) {
  // Hide all tab panes
  tabPanes.forEach(pane => {
    pane.classList.remove('active');
  });

  // Remove active class from all tab buttons
  tabButtons.forEach(button => {
    button.classList.remove('active');
  });

  // Show the selected tab pane
  document.getElementById(`${tabName}-tab`).classList.add('active');

  // Add active class to the clicked button
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Modal functions
function openModal(modalId = 'instructions-modal') {
  // Close any open modals
  document.querySelectorAll('.modal').forEach(modal => {
    modal.style.display = 'none';
  });

  // Open the specified modal
  if (typeof modalId === 'string') {
    document.getElementById(modalId).style.display = 'block';
  } else {
    instructionsModal.style.display = 'block';
  }
}

function closeModal() {
  // Close all modals
  document.querySelectorAll('.modal').forEach(modal => {
    modal.style.display = 'none';
  });
}

// Initialize the game
function initGame() {
  // Initialize sound manager
  soundManager.init();

  // Try to load saved game
  const loaded = loadGame();

  if (!loaded) {
    // First time setup
    initializeBoard();
  } else {
    // Rebuild board for loaded game
    initializeBoard();

    // Check for daily rewards
    checkDailyReward();

    // Check for active event
    if (gameState.eventActive && gameState.eventEndTime) {
      updateEventTimer();

      // Set up event timer update
      setInterval(updateEventTimer, 1000);
    }

    // Check for active random event
    if (gameState.activeRandomEvent && gameState.randomEventEndTime) {
      updateRandomEventTimer();

      // Set up random event timer update
      setInterval(updateRandomEventTimer, 1000);
    }
  }

  // Update displays
  updateGameDisplay();
  updateQuestDisplay();
  updateAchievementDisplay();
  updateSeasonDisplay();

  // Set up passive resource generation every 10 seconds
  setInterval(generatePassiveResources, 10000);

  // Set up energy regeneration every 5 seconds
  setInterval(() => {
    if (gameState.resources.energy < gameState.resources.maxEnergy) {
      gameState.resources.energy = Math.min(gameState.resources.maxEnergy, gameState.resources.energy + gameState.resources.energyRegenRate);
      updateGameDisplay();
    }
  }, 5000);

  // Set up auto-save every minute
  setInterval(saveGame, gameState.settings.autoSaveInterval);

  // Set up daily reward check every minute
  setInterval(checkDailyReward, 60000);

  // Set up season progression (1 day = 10 minutes in real time)
  setInterval(progressSeason, 10 * 60 * 1000);

  // Set up random event check every hour
  setInterval(checkRandomEvent, 60 * 60 * 1000);

  // Hide loading screen after a short delay to ensure everything is loaded
  setTimeout(hideLoadingScreen, 1000);
}

// Progress the season
function progressSeason() {
  // Increment season day
  gameState.seasonDay++;

  // Check if we need to change season
  if (gameState.seasonDay >= gameState.seasonLength) {
    gameState.seasonDay = 0;
    gameState.currentSeason = (gameState.currentSeason + 1) % 4;

    // Update achievement progress for seasonal expert
    const seasonsExperienced = new Set(gameState.achievements.find(a => a.id === 'seasonalExpert')?.progress || []);
    seasonsExperienced.add(gameState.currentSeason);
    updateAchievementProgress('seasonalExpert', seasonsExperienced.size);

    // Show season change notification
    const seasonNames = ['Spring', 'Summer', 'Fall', 'Winter'];
    showNotification(`The season has changed to ${seasonNames[gameState.currentSeason]}!`);

    // Play season change sound
    soundManager.playSound('notification');
  }

  // Update season display
  updateSeasonDisplay();

  // Save game
  saveGame();
}

// Update season display
function updateSeasonDisplay() {
  // Create season indicator if it doesn't exist
  if (!document.getElementById('season-indicator')) {
    const seasonIndicator = document.createElement('div');
    seasonIndicator.id = 'season-indicator';
    seasonIndicator.className = 'season-indicator';

    // Add to header
    document.querySelector('header').appendChild(seasonIndicator);
  }

  // Update season indicator
  const seasonNames = ['Spring', 'Summer', 'Fall', 'Winter'];
  const seasonIcons = ['🌱', '☀️', '🍂', '❄️'];
  const seasonColors = ['#a8e6cf', '#ffd3b6', '#ff8b94', '#d8e2dc'];

  const seasonIndicator = document.getElementById('season-indicator');
  seasonIndicator.innerHTML = `
    <div class="season-icon">${seasonIcons[gameState.currentSeason]}</div>
    <div class="season-info">
      <div class="season-name">${seasonNames[gameState.currentSeason]}</div>
      <div class="season-day">Day ${gameState.seasonDay + 1}/${gameState.seasonLength}</div>
    </div>
  `;
  seasonIndicator.style.backgroundColor = seasonColors[gameState.currentSeason];

  // Update island background based on season
  const islandBackground = document.querySelector('.island-background');
  if (islandBackground) {
    const seasonBackgrounds = [
      'linear-gradient(to bottom, #87CEEB, #20B2AA)', // Spring - blue to teal
      'linear-gradient(to bottom, #00BFFF, #1E90FF)', // Summer - bright blue
      'linear-gradient(to bottom, #FF7F50, #FF6347)', // Fall - orange to red
      'linear-gradient(to bottom, #B0C4DE, #4682B4)'  // Winter - light blue to steel blue
    ];
    islandBackground.style.background = seasonBackgrounds[gameState.currentSeason];
  }
}

// Check for random events
function checkRandomEvent() {
  // Don't trigger random events if player is below level 10
  if (gameState.level < 10) return;

  // Don't trigger if there's already an active event
  if (gameState.activeRandomEvent) return;

  // Don't trigger if we're in cooldown
  const now = Date.now();
  if (gameState.lastRandomEvent && (now - gameState.lastRandomEvent) < gameState.randomEventCooldown) return;

  // 20% chance to trigger an event
  if (Math.random() < 0.2) {
    triggerRandomEvent();
  }
}

// Trigger a random event
function triggerRandomEvent() {
  // Select a random event
  const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];

  // Set active event
  gameState.activeRandomEvent = event.id;
  gameState.randomEventEndTime = Date.now() + event.duration;
  gameState.lastRandomEvent = Date.now();

  // Apply event effects
  if (event.effects) {
    // Apply happiness change
    if (event.effects.happinessChange) {
      gameState.happiness = Math.max(0, Math.min(100, gameState.happiness + event.effects.happinessChange));
    }
  }

  // Show event notification
  showRandomEventModal(event);

  // Update statistics
  gameState.statistics.randomEventsExperienced++;

  // Update achievement progress
  updateAchievementProgress('eventSurvivor', gameState.statistics.randomEventsExperienced);

  // Play event sound
  soundManager.playSound('specialEvent');

  // Save game
  saveGame();
}

// Show random event modal
function showRandomEventModal(event) {
  // Create modal if it doesn't exist
  if (!document.getElementById('random-event-modal')) {
    const modal = document.createElement('div');
    modal.id = 'random-event-modal';
    modal.className = 'modal';

    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <h2 id="random-event-title">Random Event</h2>
        <div class="random-event-container">
          <div class="event-icon" id="random-event-icon"></div>
          <p id="random-event-description"></p>
          <div class="event-timer">
            <div class="timer-label">Time Remaining:</div>
            <div class="timer-value" id="random-event-timer">00:00</div>
          </div>
        </div>
        <button id="random-event-acknowledge" class="claim-button">I Understand</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    document.getElementById('random-event-acknowledge').addEventListener('click', () => {
      document.getElementById('random-event-modal').style.display = 'none';
    });

    document.querySelector('#random-event-modal .close-button').addEventListener('click', () => {
      document.getElementById('random-event-modal').style.display = 'none';
    });
  }

  // Update modal content
  document.getElementById('random-event-title').textContent = event.name;
  document.getElementById('random-event-description').textContent = event.description;

  // Set event icon
  const eventIcons = {
    'storm': '🌪️',
    'festival': '🎉',
    'trader': '🧳',
    'drought': '☀️',
    'goldRush': '💠'
  };
  document.getElementById('random-event-icon').textContent = eventIcons[event.id] || '⚡';

  // Update timer
  updateRandomEventTimer();

  // Show modal
  document.getElementById('random-event-modal').style.display = 'block';
}

// Update random event timer
function updateRandomEventTimer() {
  if (!gameState.activeRandomEvent || !gameState.randomEventEndTime) return;

  const now = Date.now();
  const timeRemaining = gameState.randomEventEndTime - now;

  if (timeRemaining <= 0) {
    // Event ended
    resolveRandomEvent();
    return;
  }

  // Format time remaining
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  const timerElement = document.getElementById('random-event-timer');
  if (timerElement) {
    timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Resolve random event
function resolveRandomEvent() {
  // Find the event
  const event = randomEvents.find(e => e.id === gameState.activeRandomEvent);
  if (!event) return;

  // Clear event state
  gameState.activeRandomEvent = null;
  gameState.randomEventEndTime = null;

  // Apply resolution rewards
  if (event.resolution && event.resolution.rewards) {
    const rewards = event.resolution.rewards;

    // Add resources
    if (rewards.wood) gameState.resources.wood += rewards.wood;
    if (rewards.stone) gameState.resources.stone += rewards.stone;
    if (rewards.food) gameState.resources.food += rewards.food;
    if (rewards.gems) gameState.resources.gems += rewards.gems;
    if (rewards.knowledge) gameState.resources.knowledge += rewards.knowledge;
    if (rewards.metal) gameState.resources.metal += rewards.metal;
    if (rewards.crystal) gameState.resources.crystal += rewards.crystal;

    // Add experience
    if (rewards.xp) gameState.experience += rewards.xp;
  }

  // Show resolution notification
  showNotification(`${event.name} has ended. ${event.resolution.description}`);

  // Play sound
  soundManager.playSound('notification');

  // Check for level up
  checkLevelUp();

  // Update display
  updateGameDisplay();

  // Save game
  saveGame();
}

// Hide loading screen and show game
function hideLoadingScreen() {
  document.getElementById('loading-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';

  // Check if this is the first time playing
  if (!localStorage.getItem('puzzleColonyPlayed')) {
    // Show instructions modal for first-time players
    setTimeout(() => openModal('instructions-modal'), 500);
    // Set flag in localStorage
    localStorage.setItem('puzzleColonyPlayed', 'true');
  }
}

// Event listeners
// Building buttons
buildHutButton.addEventListener('click', () => buildStructure('hut'));
buildFarmButton.addEventListener('click', () => buildStructure('farm'));
buildMineButton.addEventListener('click', () => buildStructure('mine'));
buildWorkshopButton.addEventListener('click', () => buildStructure('workshop'));
buildTempleButton.addEventListener('click', () => buildStructure('temple'));
buildMarketButton.addEventListener('click', () => buildStructure('market'));

// Upgrade buttons
upgradeToolsButton.addEventListener('click', () => performUpgrade('efficientTools'));
upgradeSoilButton.addEventListener('click', () => performUpgrade('fertileSoil'));
upgradeDrillButton.addEventListener('click', () => performUpgrade('miningDrill'));
upgradeTradeButton.addEventListener('click', () => performUpgrade('tradeRoutes'));

// Tab buttons
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    switchTab(button.dataset.tab);
  });
});

// Island buttons
expandIslandButton.addEventListener('click', expandIsland);
decorateIslandButton.addEventListener('click', decorateIsland);

// Modal buttons
helpButton.addEventListener('click', () => openModal('instructions-modal'));
dailyRewardButton.addEventListener('click', showDailyRewardModal);
specialEventButton.addEventListener('click', () => openModal('special-event-modal'));
settingsButton.addEventListener('click', () => openModal('settings-modal'));
claimRewardButton.addEventListener('click', claimDailyReward);
startEventButton.addEventListener('click', startSpecialEvent);
levelUpClaimButton.addEventListener('click', closeModal);
achievementClaimButton.addEventListener('click', closeModal);
resetButton.addEventListener('click', resetGame);

// Close buttons for modals
closeButtons.forEach(button => {
  button.addEventListener('click', closeModal);
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal')) {
    closeModal();
  }
});

// Keyboard shortcuts
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
    openModal('instructions-modal');
  }

  // Press '1-4' to switch tabs
  if (event.key === '1') {
    switchTab('build');
  } else if (event.key === '2') {
    switchTab('upgrade');
  } else if (event.key === '3') {
    switchTab('quests');
  } else if (event.key === '4') {
    switchTab('achievements');
  }
});

// Start the game when the page loads
window.addEventListener('load', initGame);
