// Sound effects manager
class SoundManager {
  constructor() {
    this.sounds = {};
    this.musicTracks = {};
    this.currentMusic = null;
    this.soundEnabled = true;
    this.musicEnabled = true;
    this.initialized = false;
  }

  // Initialize sound manager
  async init() {
    if (this.initialized) return;
    
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Define sounds to load
      const soundsToLoad = {
        click: 'sounds/click.mp3',
        resource: 'sounds/resource.mp3',
        build: 'sounds/build.mp3',
        upgrade: 'sounds/upgrade.mp3',
        levelUp: 'sounds/level_up.mp3',
        achievement: 'sounds/achievement.mp3',
        quest: 'sounds/quest.mp3',
        error: 'sounds/error.mp3',
        notification: 'sounds/notification.mp3',
        dailyReward: 'sounds/daily_reward.mp3',
        specialEvent: 'sounds/special_event.mp3'
      };
      
      // Define music tracks
      const musicToLoad = {
        main: 'sounds/music_main.mp3',
        event: 'sounds/music_event.mp3'
      };
      
      // Create sound directory if it doesn't exist
      await this.createSoundFiles();
      
      // Load all sounds
      for (const [name, path] of Object.entries(soundsToLoad)) {
        await this.loadSound(name, path);
      }
      
      // Load all music tracks
      for (const [name, path] of Object.entries(musicToLoad)) {
        await this.loadMusic(name, path);
      }
      
      this.initialized = true;
      console.log('Sound manager initialized');
      
      // Start main music
      if (this.musicEnabled) {
        this.playMusic('main');
      }
    } catch (error) {
      console.error('Error initializing sound manager:', error);
    }
  }
  
  // Create sound files if they don't exist
  async createSoundFiles() {
    // This is a placeholder for actual sound file creation
    // In a real implementation, you would include the sound files in your project
    console.log('Sound files would be created here in a real implementation');
  }
  
  // Load a sound file
  async loadSound(name, path) {
    try {
      // In a real implementation, this would load the actual sound file
      // For now, we'll create placeholder AudioBuffers
      const buffer = this.audioContext.createBuffer(2, 44100, 44100);
      this.sounds[name] = buffer;
      console.log(`Loaded sound: ${name}`);
    } catch (error) {
      console.error(`Error loading sound ${name}:`, error);
    }
  }
  
  // Load a music track
  async loadMusic(name, path) {
    try {
      // In a real implementation, this would load the actual music file
      // For now, we'll create placeholder AudioBuffers
      const buffer = this.audioContext.createBuffer(2, 44100 * 30, 44100); // 30 seconds
      this.musicTracks[name] = buffer;
      console.log(`Loaded music: ${name}`);
    } catch (error) {
      console.error(`Error loading music ${name}:`, error);
    }
  }
  
  // Play a sound
  playSound(name) {
    if (!this.soundEnabled || !this.initialized) return;
    
    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.sounds[name];
      source.connect(this.audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error(`Error playing sound ${name}:`, error);
    }
  }
  
  // Play music
  playMusic(name) {
    if (!this.musicEnabled || !this.initialized) return;
    
    // Stop current music if playing
    this.stopMusic();
    
    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.musicTracks[name];
      source.loop = true;
      source.connect(this.audioContext.destination);
      source.start(0);
      this.currentMusic = source;
    } catch (error) {
      console.error(`Error playing music ${name}:`, error);
    }
  }
  
  // Stop current music
  stopMusic() {
    if (this.currentMusic) {
      try {
        this.currentMusic.stop();
        this.currentMusic = null;
      } catch (error) {
        console.error('Error stopping music:', error);
      }
    }
  }
  
  // Toggle sound on/off
  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }
  
  // Toggle music on/off
  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    
    if (this.musicEnabled) {
      this.playMusic('main');
    } else {
      this.stopMusic();
    }
    
    return this.musicEnabled;
  }
  
  // Set sound enabled state
  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
  }
  
  // Set music enabled state
  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    
    if (this.musicEnabled) {
      this.playMusic('main');
    } else {
      this.stopMusic();
    }
  }
}

// Create global sound manager instance
const soundManager = new SoundManager();
