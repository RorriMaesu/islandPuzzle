// Social features management for Island Game
class SocialManager {
  constructor() {
    // Firebase references
    this.auth = firebase.auth();
    this.db = firebase.firestore();
    
    // User data
    this.currentUser = null;
    this.userData = null;
    this.friendsList = [];
    this.pendingRequests = [];
    this.sentRequests = [];
    this.trades = [];
    
    // UI elements
    this.initUIElements();
    
    // Initialize event listeners
    this.initEventListeners();
    
    // Check authentication state
    this.checkAuthState();
  }
  
  // Initialize UI element references
  initUIElements() {
    // Login/Register elements
    this.socialLoginContainer = document.getElementById('social-login-container');
    this.socialConnectedContainer = document.getElementById('social-connected-container');
    this.loginButton = document.getElementById('login-button');
    this.registerButton = document.getElementById('register-button');
    this.logoutButton = document.getElementById('logout-button');
    
    // Login modal elements
    this.loginModal = document.getElementById('login-modal');
    this.loginEmail = document.getElementById('login-email');
    this.loginPassword = document.getElementById('login-password');
    this.loginError = document.getElementById('login-error');
    this.loginSubmit = document.getElementById('login-submit');
    this.switchToRegister = document.getElementById('switch-to-register');
    
    // Register modal elements
    this.registerModal = document.getElementById('register-modal');
    this.registerUsername = document.getElementById('register-username');
    this.registerEmail = document.getElementById('register-email');
    this.registerPassword = document.getElementById('register-password');
    this.registerConfirm = document.getElementById('register-confirm');
    this.registerError = document.getElementById('register-error');
    this.registerSubmit = document.getElementById('register-submit');
    this.switchToLogin = document.getElementById('switch-to-login');
    
    // Friend system elements
    this.friendCodeInput = document.getElementById('friend-code-input');
    this.addFriendButton = document.getElementById('add-friend-button');
    this.friendsList = document.getElementById('friends-list');
    this.friendRequestsList = document.getElementById('friend-requests-list');
    
    // Social tabs
    this.socialTabButtons = document.querySelectorAll('.social-tab-button');
    this.socialTabPanes = document.querySelectorAll('.social-tab-pane');
    
    // Trade elements
    this.createTradeModal = document.getElementById('create-trade-modal');
    this.tradeOfferModal = document.getElementById('trade-offer-modal');
    this.tradeFriendSelect = document.getElementById('trade-friend-select');
    this.submitTradeButton = document.getElementById('submit-trade');
    this.tradeError = document.getElementById('trade-error');
    
    // Profile elements
    this.profileName = document.getElementById('profile-name');
    this.profileLevel = document.getElementById('profile-level');
    this.playerFriendCode = document.getElementById('player-friend-code');

    // Visit island elements
    this.visitIslandModal = document.getElementById('visit-island-modal');
    this.friendIslandName = document.getElementById('friend-island-name');
    this.friendLevel = document.getElementById('friend-level');
    this.friendBuildings = document.getElementById('friend-buildings');
    this.friendIsland = document.getElementById('friend-island');
    this.sendGiftButton = document.getElementById('send-gift');
    this.leaveIslandButton = document.getElementById('leave-island');
  }
  
  // Set up event listeners
  initEventListeners() {
    // Authentication listeners
    if (this.loginButton) {
      this.loginButton.addEventListener('click', () => this.openModal('login-modal'));
    }
    
    if (this.registerButton) {
      this.registerButton.addEventListener('click', () => this.openModal('register-modal'));
    }
    
    if (this.logoutButton) {
      this.logoutButton.addEventListener('click', () => this.logout());
    }
    
    if (this.loginSubmit) {
      this.loginSubmit.addEventListener('click', () => this.login());
    }
    
    if (this.registerSubmit) {
      this.registerSubmit.addEventListener('click', () => this.register());
    }
    
    if (this.switchToRegister) {
      this.switchToRegister.addEventListener('click', () => {
        this.closeModal('login-modal');
        this.openModal('register-modal');
      });
    }
    
    if (this.switchToLogin) {
      this.switchToLogin.addEventListener('click', () => {
        this.closeModal('register-modal');
        this.openModal('login-modal');
      });
    }
    
    // Friend system listeners
    if (this.addFriendButton) {
      this.addFriendButton.addEventListener('click', () => this.sendFriendRequest());
    }
    
    // Social tab navigation
    if (this.socialTabButtons) {
      this.socialTabButtons.forEach(button => {
        button.addEventListener('click', () => this.switchSocialTab(button.dataset.socialTab));
      });
    }
    
    // Trading system listeners
    if (this.submitTradeButton) {
      this.submitTradeButton.addEventListener('click', () => this.createTrade());
    }
    
    // Visit island listeners
    if (this.leaveIslandButton) {
      this.leaveIslandButton.addEventListener('click', () => this.leaveIsland());
    }
    
    if (this.sendGiftButton) {
      this.sendGiftButton.addEventListener('click', () => this.sendGift());
    }
  }
  
  // Check authentication state
  checkAuthState() {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in
        this.currentUser = user;
        this.getUserData();
        this.showSocialFeatures();
      } else {
        // User is signed out
        this.currentUser = null;
        this.userData = null;
        this.hideSocialFeatures();
      }
    });
  }
  
  // Show social features UI (when logged in)
  showSocialFeatures() {
    if (this.socialLoginContainer) {
      this.socialLoginContainer.style.display = 'none';
    }
    
    if (this.socialConnectedContainer) {
      this.socialConnectedContainer.style.display = 'flex';
    }
    
    // Update UI with user data
    this.updateUserProfile();
    
    // Load friend list, requests, and trades
    this.loadFriends();
    this.loadFriendRequests();
    this.loadTrades();
    
    // Update game state
    gameState.cloudSaveEnabled = true;
    gameState.userId = this.currentUser.uid;
    
    // Perform cloud save
    this.saveToCloud();
  }
  
  // Hide social features UI (when logged out)
  hideSocialFeatures() {
    if (this.socialLoginContainer) {
      this.socialLoginContainer.style.display = 'flex';
    }
    
    if (this.socialConnectedContainer) {
      this.socialConnectedContainer.style.display = 'none';
    }
    
    // Update game state
    gameState.cloudSaveEnabled = false;
    gameState.userId = null;
  }
  
  // Get user data from Firestore
  async getUserData() {
    if (!this.currentUser) return;
    
    try {
      const userDoc = await this.db.collection('users').doc(this.currentUser.uid).get();
      
      if (userDoc.exists) {
        this.userData = userDoc.data();
      } else {
        // Create new user profile
        this.userData = {
          username: this.currentUser.displayName || `Player${Math.floor(Math.random() * 10000)}`,
          email: this.currentUser.email,
          level: gameState.level,
          friendCode: this.generateFriendCode(),
          friends: [],
          pendingRequests: [],
          sentRequests: [],
          trades: [],
          islandData: null,
          lastVisit: null,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Save new user profile
        await this.db.collection('users').doc(this.currentUser.uid).set(this.userData);
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      this.showNotification('Error loading user data. Please try again.');
    }
  }
  
  // Update user profile UI
  updateUserProfile() {
    if (!this.userData) return;
    
    if (this.profileName) {
      this.profileName.textContent = this.userData.username;
    }
    
    if (this.profileLevel) {
      this.profileLevel.textContent = `Level: ${gameState.level}`;
    }
    
    if (this.playerFriendCode) {
      this.playerFriendCode.textContent = this.userData.friendCode;
    }
  }
  
  // AUTHENTICATION METHODS
  
  // Login with email and password
  async login() {
    if (!this.loginEmail || !this.loginPassword) return;
    
    const email = this.loginEmail.value.trim();
    const password = this.loginPassword.value.trim();
    
    // Validate inputs
    if (!email || !password) {
      this.showLoginError('Please enter both email and password.');
      return;
    }
    
    try {
      // Sign in with Firebase
      await this.auth.signInWithEmailAndPassword(email, password);
      
      // Clear inputs
      this.loginEmail.value = '';
      this.loginPassword.value = '';
      
      // Close modal
      this.closeModal('login-modal');
      
      // Show success notification
      this.showNotification('Successfully signed in!');
      
      // Update quest progress for social features
      this.updateSocialQuestProgress();
    } catch (error) {
      console.error('Login error:', error);
      this.showLoginError(this.getAuthErrorMessage(error));
    }
  }
  
  // Register new account
  async register() {
    if (!this.registerUsername || !this.registerEmail || !this.registerPassword || !this.registerConfirm) return;
    
    const username = this.registerUsername.value.trim();
    const email = this.registerEmail.value.trim();
    const password = this.registerPassword.value.trim();
    const confirmPassword = this.registerConfirm.value.trim();
    
    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
      this.showRegisterError('Please fill in all fields.');
      return;
    }
    
    if (password !== confirmPassword) {
      this.showRegisterError('Passwords do not match.');
      return;
    }
    
    if (password.length < 6) {
      this.showRegisterError('Password must be at least 6 characters.');
      return;
    }
    
    try {
      // Create user with Firebase
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      
      // Update user profile
      await userCredential.user.updateProfile({
        displayName: username
      });
      
      // Clear inputs
      this.registerUsername.value = '';
      this.registerEmail.value = '';
      this.registerPassword.value = '';
      this.registerConfirm.value = '';
      
      // Close modal
      this.closeModal('register-modal');
      
      // Show success notification
      this.showNotification('Account created successfully!');
    } catch (error) {
      console.error('Registration error:', error);
      this.showRegisterError(this.getAuthErrorMessage(error));
    }
  }
  
  // Logout user
  async logout() {
    try {
      // Save game before logging out
      if (gameState.cloudSaveEnabled) {
        await this.saveToCloud();
      }
      
      // Sign out with Firebase
      await this.auth.signOut();
      
      // Show notification
      this.showNotification('Successfully signed out.');
    } catch (error) {
      console.error('Logout error:', error);
      this.showNotification('Error signing out. Please try again.');
    }
  }
  
  // FRIEND SYSTEM METHODS
  
  // Load friends list from Firestore
  async loadFriends() {
    if (!this.currentUser || !this.userData) return;
    
    try {
      // Clear friends list UI
      if (this.friendsList) {
        this.friendsList.innerHTML = '';
      }
      
      if (this.userData.friends && this.userData.friends.length > 0) {
        // Get friends data
        const friendsData = await Promise.all(
          this.userData.friends.map(async friendId => {
            const friendDoc = await this.db.collection('users').doc(friendId).get();
            return friendDoc.exists ? { id: friendId, ...friendDoc.data() } : null;
          })
        );
        
        // Filter out any null values (deleted accounts)
        this.friendsData = friendsData.filter(friend => friend !== null);
        
        // Update UI
        this.updateFriendsListUI();
        
        // Update trading friend select
        this.updateTradeFriendSelect();
      } else {
        // No friends
        if (this.friendsList) {
          this.friendsList.innerHTML = '<p class="empty-list-message">You don\'t have any friends yet. Add friends using their friend code.</p>';
        }
      }
    } catch (error) {
      console.error('Error loading friends:', error);
      this.showNotification('Error loading friends list. Please try again.');
    }
  }
  
  // Update friends list UI
  updateFriendsListUI() {
    if (!this.friendsList || !this.friendsData) return;
    
    // Clear list
    this.friendsList.innerHTML = '';
    
    if (this.friendsData.length === 0) {
      this.friendsList.innerHTML = '<p class="empty-list-message">You don\'t have any friends yet. Add friends using their friend code.</p>';
      return;
    }
    
    // Add each friend to UI
    this.friendsData.forEach(friend => {
      const friendItem = document.createElement('div');
      friendItem.className = 'friend-item';
      
      friendItem.innerHTML = `
        <div class="friend-info">
          <div class="friend-avatar">${friend.username.charAt(0)}</div>
          <div class="friend-details">
            <h4>${friend.username}</h4>
            <p>Level: ${friend.level || 1}</p>
          </div>
        </div>
        <div class="friend-actions">
          <button class="social-button small visit-friend" data-id="${friend.id}">Visit</button>
          <button class="social-button small trade-friend" data-id="${friend.id}">Trade</button>
        </div>
      `;
      
      // Add event listeners
      const visitButton = friendItem.querySelector('.visit-friend');
      if (visitButton) {
        visitButton.addEventListener('click', () => this.visitFriend(friend.id));
      }
      
      const tradeButton = friendItem.querySelector('.trade-friend');
      if (tradeButton) {
        tradeButton.addEventListener('click', () => this.openTradeModal(friend.id));
      }
      
      this.friendsList.appendChild(friendItem);
    });
  }
  
  // Load friend requests
  async loadFriendRequests() {
    if (!this.currentUser || !this.userData) return;
    
    try {
      // Clear requests list UI
      if (this.friendRequestsList) {
        this.friendRequestsList.innerHTML = '';
      }
      
      if (this.userData.pendingRequests && this.userData.pendingRequests.length > 0) {
        // Get request data
        const requestsData = await Promise.all(
          this.userData.pendingRequests.map(async requestId => {
            const requestDoc = await this.db.collection('users').doc(requestId).get();
            return requestDoc.exists ? { id: requestId, ...requestDoc.data() } : null;
          })
        );
        
        // Filter out any null values
        this.requestsData = requestsData.filter(request => request !== null);
        
        // Update UI
        this.updateFriendRequestsUI();
      } else {
        // No requests
        if (this.friendRequestsList) {
          this.friendRequestsList.innerHTML = '<p class="empty-list-message">No pending friend requests.</p>';
        }
      }
    } catch (error) {
      console.error('Error loading friend requests:', error);
      this.showNotification('Error loading friend requests. Please try again.');
    }
  }
  
  // Update friend requests UI
  updateFriendRequestsUI() {
    if (!this.friendRequestsList || !this.requestsData) return;
    
    // Clear list
    this.friendRequestsList.innerHTML = '';
    
    if (this.requestsData.length === 0) {
      this.friendRequestsList.innerHTML = '<p class="empty-list-message">No pending friend requests.</p>';
      return;
    }
    
    // Add each request to UI
    this.requestsData.forEach(request => {
      const requestItem = document.createElement('div');
      requestItem.className = 'request-item';
      
      requestItem.innerHTML = `
        <div class="request-info">
          <div class="request-avatar">${request.username.charAt(0)}</div>
          <div class="request-details">
            <h4>${request.username}</h4>
            <p>Level: ${request.level || 1}</p>
          </div>
        </div>
        <div class="request-actions">
          <button class="social-button small accept-request" data-id="${request.id}">Accept</button>
          <button class="social-button small decline-request" data-id="${request.id}">Decline</button>
        </div>
      `;
      
      // Add event listeners
      const acceptButton = requestItem.querySelector('.accept-request');
      if (acceptButton) {
        acceptButton.addEventListener('click', () => this.acceptFriendRequest(request.id));
      }
      
      const declineButton = requestItem.querySelector('.decline-request');
      if (declineButton) {
        declineButton.addEventListener('click', () => this.declineFriendRequest(request.id));
      }
      
      this.friendRequestsList.appendChild(requestItem);
    });
  }
  
  // Send friend request
  async sendFriendRequest() {
    if (!this.currentUser || !this.userData || !this.friendCodeInput) return;
    
    const friendCode = this.friendCodeInput.value.trim();
    
    if (!friendCode) {
      this.showNotification('Please enter a friend code.');
      return;
    }
    
    // Don't allow adding yourself
    if (friendCode === this.userData.friendCode) {
      this.showNotification('You cannot add yourself as a friend.');
      return;
    }
    
    try {
      // Find user with this friend code
      const usersRef = this.db.collection('users');
      const snapshot = await usersRef.where('friendCode', '==', friendCode).get();
      
      if (snapshot.empty) {
        this.showNotification('Friend code not found. Please check and try again.');
        return;
      }
      
      // Get the user document
      const friendDoc = snapshot.docs[0];
      const friendId = friendDoc.id;
      const friendData = friendDoc.data();
      
      // Check if already friends
      if (this.userData.friends && this.userData.friends.includes(friendId)) {
        this.showNotification('You are already friends with this user.');
        return;
      }
      
      // Check if request already sent
      if (this.userData.sentRequests && this.userData.sentRequests.includes(friendId)) {
        this.showNotification('Friend request already sent to this user.');
        return;
      }
      
      // Check if they already sent you a request
      if (this.userData.pendingRequests && this.userData.pendingRequests.includes(friendId)) {
        // Auto-accept their request instead
        await this.acceptFriendRequest(friendId);
        return;
      }
      
      // Add to sent requests
      await this.db.collection('users').doc(this.currentUser.uid).update({
        sentRequests: firebase.firestore.FieldValue.arrayUnion(friendId)
      });
      
      // Add to their pending requests
      await this.db.collection('users').doc(friendId).update({
        pendingRequests: firebase.firestore.FieldValue.arrayUnion(this.currentUser.uid)
      });
      
      // Update user data
      if (!this.userData.sentRequests) {
        this.userData.sentRequests = [];
      }
      this.userData.sentRequests.push(friendId);
      
      // Show notification
      this.showNotification(`Friend request sent to ${friendData.username}!`);
      
      // Clear input
      this.friendCodeInput.value = '';
    } catch (error) {
      console.error('Error sending friend request:', error);
      this.showNotification('Error sending friend request. Please try again.');
    }
  }
  
  // Accept friend request
  async acceptFriendRequest(friendId) {
    if (!this.currentUser || !this.userData) return;
    
    try {
      // Add to friends list for both users
      await this.db.collection('users').doc(this.currentUser.uid).update({
        friends: firebase.firestore.FieldValue.arrayUnion(friendId),
        pendingRequests: firebase.firestore.FieldValue.arrayRemove(friendId)
      });
      
      await this.db.collection('users').doc(friendId).update({
        friends: firebase.firestore.FieldValue.arrayUnion(this.currentUser.uid),
        sentRequests: firebase.firestore.FieldValue.arrayRemove(this.currentUser.uid)
      });
      
      // Update user data
      if (!this.userData.friends) {
        this.userData.friends = [];
      }
      this.userData.friends.push(friendId);
      
      if (this.userData.pendingRequests) {
        this.userData.pendingRequests = this.userData.pendingRequests.filter(id => id !== friendId);
      }
      
      // Reload friends and requests
      await this.loadFriends();
      await this.loadFriendRequests();
      
      // Show notification
      this.showNotification('Friend request accepted!');
      
      // Update quest progress for social features
      if (this.userData.friends.length === 1) {
        this.updateFriendQuestProgress();
      }
      
      // Update achievement progress
      if (this.userData.friends.length >= 5) {
        this.updateSocialAchievementProgress();
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      this.showNotification('Error accepting friend request. Please try again.');
    }
  }
  
  // Decline friend request
  async declineFriendRequest(friendId) {
    if (!this.currentUser || !this.userData) return;
    
    try {
      // Remove from requests
      await this.db.collection('users').doc(this.currentUser.uid).update({
        pendingRequests: firebase.firestore.FieldValue.arrayRemove(friendId)
      });
      
      await this.db.collection('users').doc(friendId).update({
        sentRequests: firebase.firestore.FieldValue.arrayRemove(this.currentUser.uid)
      });
      
      // Update user data
      if (this.userData.pendingRequests) {
        this.userData.pendingRequests = this.userData.pendingRequests.filter(id => id !== friendId);
      }
      
      // Reload requests
      await this.loadFriendRequests();
      
      // Show notification
      this.showNotification('Friend request declined.');
    } catch (error) {
      console.error('Error declining friend request:', error);
      this.showNotification('Error declining friend request. Please try again.');
    }
  }
  
  // TRADING SYSTEM METHODS
  
  // Load trades from Firestore
  async loadTrades() {
    if (!this.currentUser || !this.userData) return;
    
    try {
      // Get active trades
      const tradesRef = this.db.collection('trades');
      const snapshot = await tradesRef
        .where('participants', 'array-contains', this.currentUser.uid)
        .where('status', '==', 'pending')
        .get();
      
      this.trades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Update trades UI
      this.updateTradesUI();
    } catch (error) {
      console.error('Error loading trades:', error);
      this.showNotification('Error loading trades. Please try again.');
    }
  }
  
  // Update trades UI
  updateTradesUI() {
    const tradesListElement = document.getElementById('trades-list');
    if (!tradesListElement || !this.trades) return;
    
    // Clear list
    tradesListElement.innerHTML = '';
    
    if (this.trades.length === 0) {
      tradesListElement.innerHTML = '<p class="empty-list-message">No active trade offers.</p>';
      return;
    }
    
    // Add each trade to UI
    this.trades.forEach(trade => {
      const isFromUser = trade.fromUserId === this.currentUser.uid;
      const otherUserId = isFromUser ? trade.toUserId : trade.fromUserId;
      
      // Get other user's data
      const otherUser = this.friendsData.find(friend => friend.id === otherUserId);
      if (!otherUser) return;
      
      const tradeItem = document.createElement('div');
      tradeItem.className = 'trade-item';
      
      // Format resources
      const giveResourcesText = this.formatTradeResources(isFromUser ? trade.give : trade.receive);
      const receiveResourcesText = this.formatTradeResources(isFromUser ? trade.receive : trade.give);
      
      tradeItem.innerHTML = `
        <div class="trade-info">
          <div class="trade-details">
            <h4>${isFromUser ? 'To' : 'From'}: ${otherUser.username}</h4>
            <p>Give: ${giveResourcesText} | Receive: ${receiveResourcesText}</p>
          </div>
        </div>
        <div class="trade-actions">
          ${isFromUser ? 
            `<button class="social-button small cancel-trade" data-id="${trade.id}">Cancel</button>` :
            `<button class="social-button small accept-trade" data-id="${trade.id}">Accept</button>
             <button class="social-button small decline-trade" data-id="${trade.id}">Decline</button>`
          }
        </div>
      `;
      
      // Add event listeners
      if (isFromUser) {
        const cancelButton = tradeItem.querySelector('.cancel-trade');
        if (cancelButton) {
          cancelButton.addEventListener('click', () => this.cancelTrade(trade.id));
        }
      } else {
        const acceptButton = tradeItem.querySelector('.accept-trade');
        if (acceptButton) {
          acceptButton.addEventListener('click', () => this.acceptTrade(trade.id));
        }
        
        const declineButton = tradeItem.querySelector('.decline-trade');
        if (declineButton) {
          declineButton.addEventListener('click', () => this.declineTrade(trade.id));
        }
      }
      
      tradesListElement.appendChild(tradeItem);
    });
  }
  
  // Format trade resources for UI display
  formatTradeResources(resources) {
    if (!resources) return 'Nothing';
    
    const parts = [];
    if (resources.wood > 0) parts.push(`${resources.wood} Wood`);
    if (resources.stone > 0) parts.push(`${resources.stone} Stone`);
    if (resources.food > 0) parts.push(`${resources.food} Food`);
    if (resources.gems > 0) parts.push(`${resources.gems} Gems`);
    
    return parts.length > 0 ? parts.join(', ') : 'Nothing';
  }
  
  // Update trade friend select dropdown
  updateTradeFriendSelect() {
    if (!this.tradeFriendSelect || !this.friendsData) return;
    
    // Clear options
    this.tradeFriendSelect.innerHTML = '<option value="">-- Select a friend --</option>';
    
    // Add each friend as an option
    this.friendsData.forEach(friend => {
      const option = document.createElement('option');
      option.value = friend.id;
      option.textContent = friend.username;
      this.tradeFriendSelect.appendChild(option);
    });
  }
  
  // Open trade modal
  openTradeModal(friendId) {
    if (!this.createTradeModal) return;
    
    // Reset form
    document.getElementById('offer-wood').value = '0';
    document.getElementById('offer-stone').value = '0';
    document.getElementById('offer-food').value = '0';
    document.getElementById('offer-gems').value = '0';
    document.getElementById('request-wood').value = '0';
    document.getElementById('request-stone').value = '0';
    document.getElementById('request-food').value = '0';
    document.getElementById('request-gems').value = '0';
    
    // Select friend in dropdown
    if (this.tradeFriendSelect) {
      this.tradeFriendSelect.value = friendId;
    }
    
    // Show modal
    this.createTradeModal.style.display = 'block';
  }
  
  // Create new trade
  async createTrade() {
    if (!this.currentUser || !this.userData || !this.tradeFriendSelect) return;
    
    const friendId = this.tradeFriendSelect.value;
    
    if (!friendId) {
      this.showTradeError('Please select a friend to trade with.');
      return;
    }
    
    // Get resource values
    const giveWood = parseInt(document.getElementById('offer-wood').value) || 0;
    const giveStone = parseInt(document.getElementById('offer-stone').value) || 0;
    const giveFood = parseInt(document.getElementById('offer-food').value) || 0;
    const giveGems = parseInt(document.getElementById('offer-gems').value) || 0;
    
    const receiveWood = parseInt(document.getElementById('request-wood').value) || 0;
    const receiveStone = parseInt(document.getElementById('request-stone').value) || 0;
    const receiveFood = parseInt(document.getElementById('request-food').value) || 0;
    const receiveGems = parseInt(document.getElementById('request-gems').value) || 0;
    
    // Validate trade
    if (giveWood === 0 && giveStone === 0 && giveFood === 0 && giveGems === 0 &&
        receiveWood === 0 && receiveStone === 0 && receiveFood === 0 && receiveGems === 0) {
      this.showTradeError('Please specify at least one resource to trade.');
      return;
    }
    
    // Check if player has enough resources
    if (gameState.resources.wood < giveWood ||
        gameState.resources.stone < giveStone ||
        gameState.resources.food < giveFood ||
        gameState.resources.gems < giveGems) {
      this.showTradeError('You don\'t have enough resources for this trade.');
      return;
    }
    
    try {
      // Create trade in Firestore
      const tradeData = {
        fromUserId: this.currentUser.uid,
        toUserId: friendId,
        participants: [this.currentUser.uid, friendId],
        give: {
          wood: giveWood,
          stone: giveStone,
          food: giveFood,
          gems: giveGems
        },
        receive: {
          wood: receiveWood,
          stone: receiveStone,
          food: receiveFood,
          gems: receiveGems
        },
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      
      await this.db.collection('trades').add(tradeData);
      
      // Close modal
      this.closeModal('create-trade-modal');
      
      // Show notification
      this.showNotification('Trade offer sent!');
      
      // Reload trades
      await this.loadTrades();
    } catch (error) {
      console.error('Error creating trade:', error);
      this.showTradeError('Error creating trade. Please try again.');
    }
  }
  
  // Accept a trade offer
  async acceptTrade(tradeId) {
    if (!this.currentUser || !this.userData) return;
    
    try {
      // Get trade data
      const tradeDoc = await this.db.collection('trades').doc(tradeId).get();
      if (!tradeDoc.exists) {
        this.showNotification('Trade no longer exists.');
        return;
      }
      
      const trade = tradeDoc.data();
      
      // Verify user is the recipient
      if (trade.toUserId !== this.currentUser.uid) {
        this.showNotification('You cannot accept this trade.');
        return;
      }
      
      // Check if player has enough resources
      if (gameState.resources.wood < trade.receive.wood ||
          gameState.resources.stone < trade.receive.stone ||
          gameState.resources.food < trade.receive.food ||
          gameState.resources.gems < trade.receive.gems) {
        this.showNotification('You don\'t have enough resources to accept this trade.');
        return;
      }
      
      // Get sender's user data
      const senderDoc = await this.db.collection('users').doc(trade.fromUserId).get();
      if (!senderDoc.exists) {
        this.showNotification('The sender no longer exists.');
        return;
      }
      
      // Start transaction
      await this.db.runTransaction(async transaction => {
        // Update trade status
        transaction.update(this.db.collection('trades').doc(tradeId), {
          status: 'completed',
          completedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update game states in Firestore
        const receiverGameStateDoc = await transaction.get(this.db.collection('gameStates').doc(this.currentUser.uid));
        const senderGameStateDoc = await transaction.get(this.db.collection('gameStates').doc(trade.fromUserId));
        
        if (receiverGameStateDoc.exists && senderGameStateDoc.exists) {
          const receiverGameState = receiverGameStateDoc.data();
          const senderGameState = senderGameStateDoc.data();
          
          // Update receiver's resources
          receiverGameState.resources.wood += trade.give.wood - trade.receive.wood;
          receiverGameState.resources.stone += trade.give.stone - trade.receive.stone;
          receiverGameState.resources.food += trade.give.food - trade.receive.food;
          receiverGameState.resources.gems += trade.give.gems - trade.receive.gems;
          
          // Update sender's resources
          senderGameState.resources.wood += trade.receive.wood - trade.give.wood;
          senderGameState.resources.stone += trade.receive.stone - trade.give.stone;
          senderGameState.resources.food += trade.receive.food - trade.give.food;
          senderGameState.resources.gems += trade.receive.gems - trade.give.gems;
          
          // Save updated game states
          transaction.set(this.db.collection('gameStates').doc(this.currentUser.uid), receiverGameState);
          transaction.set(this.db.collection('gameStates').doc(trade.fromUserId), senderGameState);
        }
      });
      
      // Update local game state
      gameState.resources.wood += trade.give.wood - trade.receive.wood;
      gameState.resources.stone += trade.give.stone - trade.receive.stone;
      gameState.resources.food += trade.give.food - trade.receive.food;
      gameState.resources.gems += trade.give.gems - trade.receive.gems;
      
      // Update statistics
      gameState.statistics.tradesCompleted++;
      
      // Update quest progress
      this.updateTradeQuestProgress();
      
      // Update achievement progress
      this.updateTradeAchievementProgress();
      
      // Update display
      updateGameDisplay();
      
      // Reload trades
      await this.loadTrades();
      
      // Show notification
      this.showNotification('Trade accepted successfully!');
    } catch (error) {
      console.error('Error accepting trade:', error);
      this.showNotification('Error accepting trade. Please try again.');
    }
  }
  
  // Decline a trade offer
  async declineTrade(tradeId) {
    if (!this.currentUser) return;
    
    try {
      // Update trade status
      await this.db.collection('trades').doc(tradeId).update({
        status: 'declined',
        declinedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      // Reload trades
      await this.loadTrades();
      
      // Show notification
      this.showNotification('Trade declined.');
    } catch (error) {
      console.error('Error declining trade:', error);
      this.showNotification('Error declining trade. Please try again.');
    }
  }
  
  // Cancel a trade offer
  async cancelTrade(tradeId) {
    if (!this.currentUser) return;
    
    try {
      // Update trade status
      await this.db.collection('trades').doc(tradeId).update({
        status: 'canceled',
        canceledAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      // Reload trades
      await this.loadTrades();
      
      // Show notification
      this.showNotification('Trade canceled.');
    } catch (error) {
      console.error('Error canceling trade:', error);
      this.showNotification('Error canceling trade. Please try again.');
    }
  }
  
  // VISITING SYSTEM METHODS
  
  // Visit a friend's island
  async visitFriend(friendId) {
    if (!this.currentUser || !this.userData) return;
    
    try {
      // Check cooldown
      const now = Date.now();
      const lastVisit = gameState.lastFriendVisit;
      
      if (lastVisit && (now - lastVisit < gameState.friendVisitCooldown)) {
        const hoursLeft = Math.ceil((gameState.friendVisitCooldown - (now - lastVisit)) / (1000 * 60 * 60));
        this.showNotification(`You can visit a friend again in ${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''}.`);
        return;
      }
      
      // Get friend's data
      const friendDoc = await this.db.collection('users').doc(friendId).get();
      if (!friendDoc.exists) {
        this.showNotification('Friend not found.');
        return;
      }
      
      const friendData = friendDoc.data();
      
      // Get friend's game state
      const friendGameDoc = await this.db.collection('gameStates').doc(friendId).get();
      if (!friendGameDoc.exists) {
        this.showNotification('Friend\'s island data not available.');
        return;
      }
      
      const friendGameState = friendGameDoc.data();
      
      // Prepare visit UI
      this.friendIslandName.textContent = `${friendData.username}'s Island`;
      this.friendLevel.textContent = `Level: ${friendGameState.level || 1}`;
      
      // Count buildings
      const buildingCount = Object.values(friendGameState.buildings).reduce((sum, count) => sum + count, 0);
      this.friendBuildings.textContent = `Buildings: ${buildingCount}`;
      
      // Display friend's island
      this.displayFriendIsland(friendGameState);
      
      // Show modal
      this.visitIslandModal.style.display = 'block';
      
      // Update statistics
      gameState.statistics.friendsVisited++;
      
      // Update last visit time
      gameState.lastFriendVisit = now;
      
      // Update game state
      await this.saveToCloud();
    } catch (error) {
      console.error('Error visiting friend:', error);
      this.showNotification('Error visiting friend\'s island. Please try again.');
    }
  }
  
  // Display friend's island
  displayFriendIsland(friendGameState) {
    if (!this.friendIsland) return;
    
    // Clear the island
    this.friendIsland.innerHTML = '';
    
    // Add buildings
    for (const [type, count] of Object.entries(friendGameState.buildings)) {
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
        } else if (type === 'library') {
          buildingIcon = '📚';
        } else if (type === 'forge') {
          buildingIcon = '🔥';
        } else if (type === 'windmill') {
          buildingIcon = '💨';
        } else if (type === 'lighthouse') {
          buildingIcon = '🚨';
        } else if (type === 'observatory') {
          buildingIcon = '🔭';
        } else if (type === 'tradingPost') {
          buildingIcon = '🛒';
        }
        
        building.textContent = buildingIcon;
        
        // Add to island
        this.friendIsland.appendChild(building);
      }
    }
  }
  
  // Leave friend's island
  leaveIsland() {
    // Hide modal
    this.visitIslandModal.style.display = 'none';
  }
  
  // Send gift to friend
  async sendGift() {
    if (!this.currentUser || !this.userData) return;
    
    try {
      // Give a random gift
      const giftOptions = [
        { wood: 10 },
        { stone: 10 },
        { food: 10 },
        { gems: 1 }
      ];
      
      const randomGift = giftOptions[Math.floor(Math.random() * giftOptions.length)];
      const giftResource = Object.keys(randomGift)[0];
      const giftAmount = randomGift[giftResource];
      
      // Update your game state
      gameState.resources[giftResource] += giftAmount;
      
      // Update display
      updateGameDisplay();
      
      // Save changes
      await this.saveToCloud();
      
      // Show notification
      this.showNotification(`You received ${giftAmount} ${giftResource} as a gift for visiting!`);
      
      // Close modal
      this.leaveIsland();
    } catch (error) {
      console.error('Error sending gift:', error);
      this.showNotification('Error processing gift. Please try again.');
    }
  }
  
  // CLOUD SAVE METHODS
  
  // Save game to cloud
  async saveToCloud() {
    if (!this.currentUser || !gameState.cloudSaveEnabled) return;
    
    try {
      // Store the current timestamp
      gameState.lastCloudSave = Date.now();
      
      // Save to Firestore
      await this.db.collection('gameStates').doc(this.currentUser.uid).set(gameState);
      
      // Update user data
      await this.db.collection('users').doc(this.currentUser.uid).update({
        level: gameState.level,
        lastActivity: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      console.log('Game saved to cloud.');
    } catch (error) {
      console.error('Error saving to cloud:', error);
      // Don't show notification for background saves
    }
  }
  
  // Load game from cloud
  async loadFromCloud() {
    if (!this.currentUser) return false;
    
    try {
      // Get saved game from Firestore
      const gameDoc = await this.db.collection('gameStates').doc(this.currentUser.uid).get();
      
      if (!gameDoc.exists) {
        // No saved game found
        return false;
      }
      
      // Load saved game data
      const cloudGameState = gameDoc.data();
      
      // Confirm with user before overwriting local progress
      if (gameState.score > 0 || gameState.level > 1) {
        const localTime = new Date(gameState.lastSaveTime).toLocaleString();
        const cloudTime = new Date(cloudGameState.lastSaveTime).toLocaleString();
        
        if (!confirm(`Load cloud save from ${cloudTime}? Your local save from ${localTime} will be overwritten.`)) {
          return false;
        }
      }
      
      // Update game state with cloud data
      for (const key in cloudGameState) {
        if (gameState.hasOwnProperty(key)) {
          gameState[key] = cloudGameState[key];
        }
      }
      
      // Update UI
      updateGameDisplay();
      updateQuestDisplay();
      updateAchievementDisplay();
      
      // Show notification
      this.showNotification('Game loaded from cloud successfully!');
      
      return true;
    } catch (error) {
      console.error('Error loading from cloud:', error);
      this.showNotification('Error loading from cloud. Using local save instead.');
      return false;
    }
  }
  
  // HELPER METHODS
  
  // Generate a unique friend code
  generateFriendCode() {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Omitting similar looking characters
    let code = '';
    
    // Generate 8 character code
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Add hyphens for readability
    return `${code.substring(0, 4)}-${code.substring(4, 8)}`;
  }
  
  // Show notification
  showNotification(message) {
    // Use the game's notification system
    if (typeof showNotification === 'function') {
      showNotification(message);
    } else {
      alert(message);
    }
  }
  
  // Show login error
  showLoginError(message) {
    if (this.loginError) {
      this.loginError.textContent = message;
    }
  }
  
  // Show register error
  showRegisterError(message) {
    if (this.registerError) {
      this.registerError.textContent = message;
    }
  }
  
  // Show trade error
  showTradeError(message) {
    if (this.tradeError) {
      this.tradeError.textContent = message;
    }
  }
  
  // Get readable auth error message
  getAuthErrorMessage(error) {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'This email is already in use.';
      case 'auth/weak-password':
        return 'Password is too weak.';
      default:
        return error.message;
    }
  }
  
  // Open modal
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';
    }
  }
  
  // Close modal
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    }
  }
  
  // Switch between social tabs
  switchSocialTab(tabName) {
    // Hide all tab panes
    this.socialTabPanes.forEach(pane => {
      pane.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    this.socialTabButtons.forEach(button => {
      button.classList.remove('active');
    });
    
    // Show the selected tab pane
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to the clicked button
    document.querySelector(`[data-social-tab="${tabName}"]`).classList.add('active');
  }
  
  // Update quest progress for social features
  updateSocialQuestProgress() {
    if (typeof updateQuestProgress === 'function') {
      updateQuestProgress('friendlyIsland', 1);
    }
  }
  
  // Update friend quest progress
  updateFriendQuestProgress() {
    if (typeof updateQuestProgress === 'function') {
      updateQuestProgress('friendlyIsland', 1);
    }
  }
  
  // Update trade quest progress
  updateTradeQuestProgress() {
    if (typeof updateQuestProgress === 'function') {
      // Assuming there's a trade-related quest
      // This would need to be added to the quests array in the game state
    }
  }
  
  // Update social achievement progress
  updateSocialAchievementProgress() {
    if (typeof updateAchievementProgress === 'function') {
      updateAchievementProgress('socialButterfly', this.userData.friends.length);
    }
  }
  
  // Update trade achievement progress
  updateTradeAchievementProgress() {
    if (typeof updateAchievementProgress === 'function') {
      updateAchievementProgress('tradeMaster', gameState.statistics.tradesCompleted);
    }
  }
}

// Create global instance
const socialManager = new SocialManager();

// Export for use in other files
window.socialManager = socialManager;