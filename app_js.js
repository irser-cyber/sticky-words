/**
 * Sticky Words - Main Application Logic
 * A sophisticated vocabulary-building web app for movie and TV enthusiasts
 */

// App state management
let currentWordIndex = 0;
let wordsLearned = 0;
let favorites = 0;
let streak = 0;
let favoriteWords = [];
let usedWords = [];

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('Initializing Sticky Words...');
    
    loadStats();
    getNewWord();
    
    // Set up keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Set up accessibility features
    setupAccessibility();
    
    console.log('App initialized successfully');
}

/**
 * Get a new random word (updated to use API)
 */
async function getNewWord() {
    try {
        // Show loading state
        updateWordDisplay('Loading...', '', '', '', '');
        
        // Get word with script context
        const selectedWord = await getWordFromScripts();
        currentWordIndex = WORDS_DATABASE.findIndex(word => word.word === selectedWord.word);
        
        // Mark as used
        if (!usedWords.includes(currentWordIndex)) {
            usedWords.push(currentWordIndex);
        }
        
        // Reset if all words have been used
        if (usedWords.length >= WORDS_DATABASE.length) {
            usedWords = [currentWordIndex];
        }
        
        // Update display
        displayWord(selectedWord);
        updateStats();
        
        // Save progress
        saveStats();
        
        // Announce to screen readers
        announceToScreenReader(`New word: ${selectedWord.word}`);
        
    } catch (error) {
        console.error('Error getting new word:', error);
        // Fallback to original method
        getNewWordFallback();
    }
}

/**
 * Fallback method for getting new words (original implementation)
 */
function getNewWordFallback() {
    // Find unused words
    let availableWords = WORDS_DATABASE.filter((_, index) => !usedWords.includes(index));
    
    // Reset if all words have been used
    if (availableWords.length === 0) {
        usedWords = [];
        availableWords = WORDS_DATABASE;
    }
    
    // Get random word from available words
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const selectedWord = availableWords[randomIndex];
    currentWordIndex = WORDS_DATABASE.findIndex(word => word.word === selectedWord.word);
    
    // Mark as used
    usedWords.push(currentWordIndex);
    
    // Update display
    displayWord(selectedWord);
    updateStats();
    
    // Save progress
    saveStats();
}

/**
 * Display the current word
 * @param {Object} wordData - Word object with all properties
 */
function displayWord(wordData) {
    updateWordDisplay(
        wordData.word,
        wordData.pronunciation,
        wordData.definition,
        `"${wordData.example}"`,
        wordData.source
    );
    
    updateFavoriteButton();
}

/**
 * Update word display elements
 * @param {string} word - The word
 * @param {string} pronunciation - Pronunciation guide
 * @param {string} definition - Word definition
 * @param {string} example - Example usage
 * @param {string} source - Source information
 */
function updateWordDisplay(word, pronunciation, definition, example, source) {
    const elements = {
        currentWord: document.getElementById('currentWord'),
        pronunciation: document.getElementById('pronunciation'),
        definition: document.getElementById('definition'),
        example: document.getElementById('example'),
        source: document.getElementById('source')
    };
    
    // Update text content with error handling
    if (elements.currentWord) elements.currentWord.textContent = word;
    if (elements.pronunciation) elements.pronunciation.textContent = pronunciation;
    if (elements.definition) elements.definition.textContent = definition;
    if (elements.example) elements.example.textContent = example;
    if (elements.source) elements.source.textContent = source;
    
    // Update ARIA labels for accessibility
    if (elements.currentWord) elements.currentWord.setAttribute('aria-label', `Current word: ${word}`);
}

/**
 * Toggle favorite status of current word
 */
function toggleFavorite() {
    if (currentWordIndex === -1 || currentWordIndex >= WORDS_DATABASE.length) {
        console.warn('Invalid word index for favorite toggle');
        return;
    }
    
    const wasFavorite = favoriteWords.includes(currentWordIndex);
    
    if (wasFavorite) {
        favoriteWords = favoriteWords.filter(index => index !== currentWordIndex);
        favorites = Math.max(0, favorites - 1);
        announceToScreenReader('Removed from favorites');
    } else {
        favoriteWords.push(currentWordIndex);
        favorites++;
        announceToScreenReader('Added to favorites');
    }
    
    updateStats();
    updateFavoriteButton();
    saveStats();
}

/**
 * Update favorite button appearance and state
 */
function updateFavoriteButton() {
    const favoriteBtn = document.getElementById('favoriteBtn') || document.querySelector('button[onclick="toggleFavorite()"]');
    
    if (!favoriteBtn) return;
    
    const isFavorite = favoriteWords.includes(currentWordIndex);
    
    if (isFavorite) {
        favoriteBtn.innerHTML = '<span aria-hidden="true">♥</span> Favorited';
        favoriteBtn.classList.add('favorite-active');
        favoriteBtn.setAttribute('aria-pressed', 'true');
        favoriteBtn.style.background = 'var(--accent-gradient)';
    } else {
        favoriteBtn.innerHTML = '<span aria-hidden="true">♥</span> Favorite';
        favoriteBtn.classList.remove('favorite-active');
        favoriteBtn.setAttribute('aria-pressed', 'false');
        favoriteBtn.style.background = 'var(--secondary-gradient)';
    }
}

/**
 * Speak the current word using Web Speech API
 */
function speakWord() {
    const wordElement = document.getElementById('currentWord');
    if (!wordElement) return;
    
    const word = wordElement.textContent.trim();
    
    if (!word || word === 'Loading...') {
        announceToScreenReader('No word to pronounce');
        return;
    }
    
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.lang = 'en-US';
        
        // Handle speech events
        utterance.onstart = () => {
            console.log('Started speaking:', word);
            announceToScreenReader(`Pronouncing ${word}`);
        };
        
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            announceToScreenReader('Pronunciation unavailable');
        };
        
        speechSynthesis.speak(utterance);
    } else {
        alert('Speech synthesis not supported in your browser');
        announceToScreenReader('Speech synthesis not available');
    }
}

/**
 * Show API setup information and status
 */
function showApiSetup() {
    const status = getApiStatus();
    
    let message;
    if (status.configured) {
        message = `✅ API is configured!

Your credentials are set:
- User ID: ${API_CONFIG.uid}
- Token: ${API_CONFIG.tokenid.substring(0, 8)}...

Status: ${status.enabled ? 'Enabled' : 'Disabled - set enabled: true to activate'}
Requests used: ${status.requestCount}/${status.dailyLimit}

You have ${status.remainingRequests} script searches remaining today.`;
    } else {
        message = `🔧 API Setup Required

To connect to real movie scripts:

1. Visit: https://www.scripts.com/api.php
2. Sign up for a free STANDS4 API account  
3. Get your User ID and Token ID
4. Add them to the API_CONFIG object in js/api-service.js
5. Set enabled: true
6. Enjoy 100 free script searches per day!

The app currently works with a curated database.`;
    }
    
    alert(message);
}

/**
 * Update statistics display
 */
function updateStats() {
    const elements = {
        wordsLearned: document.getElementById('wordsLearned'),
        favorites: document.getElementById('favorites'),
        streak: document.getElementById('streak')
    };
    
    if (elements.wordsLearned) elements.wordsLearned.textContent = wordsLearned;
    if (elements.favorites) elements.favorites.textContent = favorites;
    if (elements.streak) elements.streak.textContent = streak;
}

/**
 * Save statistics to memory
 * Note: Using variables instead of localStorage for Claude.ai compatibility
 */
function saveStats() {
    // In a real deployment, this would save to localStorage or a database
    wordsLearned = Math.max(wordsLearned, usedWords.length);
    
    // Calculate streak (simplified - in production, use proper date tracking)
    streak = Math.min(streak + 1, usedWords.length);
    
    console.log('Stats saved:', { wordsLearned, favorites, streak });
}

/**
 * Load statistics from memory
 * Note: Using default values for Claude.ai compatibility
 */
function loadStats() {
    // In a real deployment, this would load from localStorage or a database
    wordsLearned = 0;
    favorites = 0;
    streak = 0;
    favoriteWords = [];
    usedWords = [];
    
    console.log('Stats loaded:', { wordsLearned, favorites, streak });
}

/**
 * Set up keyboard shortcuts for accessibility
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        // Only trigger if not in an input field
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (event.key.toLowerCase()) {
            case 'n':
                event.preventDefault();
                getNewWord();
                break;
            case 'f':
                event.preventDefault();
                toggleFavorite();
                break;
            case 'p':
            case ' ':
                event.preventDefault();
                speakWord();
                break;
            case 's':
                event.preventDefault();
                showApiSetup();
                break;
        }
    });
    
    console.log('Keyboard shortcuts enabled: N (new word), F (favorite), P/Space (pronounce), S (setup)');
}

/**
 * Set up accessibility features
 */
function setupAccessibility() {
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#wordCard';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.addEventListener('focus', () => skipLink.classList.remove('sr-only'));
    skipLink.addEventListener('blur', () => skipLink.classList.add('sr-only'));
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Set up ARIA live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.id = 'announcements';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
    
    console.log('Accessibility features initialized');
}

/**
 * Announce messages to screen readers
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('announcements');
    if (liveRegion) {
        liveRegion.textContent = message;
        // Clear after a short delay to allow for re-announcements
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

/**
 * Handle app visibility change (for potential pause/resume functionality)
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('App hidden - pausing any ongoing processes');
        // Cancel any ongoing speech
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }
    } else {
        console.log('App visible - resuming normal operation');
    }
});

/**
 * Handle errors globally
 */
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    announceToScreenReader('An error occurred. Please try again.');
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault(); // Prevent the default browser behavior
});

// Initialize the app when DOM is loaded
