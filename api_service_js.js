/**
 * API Service for Sticky Words
 * Handles integration with STANDS4 Scripts API and other external services
 */

// API Configuration - Add your credentials here
const API_CONFIG = {
    uid: '13417', // Provided STANDS4 User ID
    tokenid: 'q8KPbOrZpfu2Rfxz', // Provided STANDS4 Token ID
    baseUrl: 'https://www.stands4.com/services/v2/scripts.php',
    enabled: true, // Enable API now that credentials are present
    dailyLimit: 100,
    requestCount: 0
};

/**
 * Search for scripts using STANDS4 API
 * @param {string} term - Search term for scripts
 * @returns {Promise<Array>} Array of script results
 */
async function searchScripts(term) {
    // Check if API is enabled and configured
    if (!API_CONFIG.enabled || !API_CONFIG.uid || !API_CONFIG.tokenid) {
        console.warn('STANDS4 API not configured');
        return [];
    }

    // Check daily limit
    if (API_CONFIG.requestCount >= API_CONFIG.dailyLimit) {
        console.warn('Daily API limit reached');
        return [];
    }

    try {
        const url = `${API_CONFIG.baseUrl}?uid=${API_CONFIG.uid}&tokenid=${API_CONFIG.tokenid}&term=${encodeURIComponent(term)}&format=json`;
        
        // Show loading indicator
        showLoadingIndicator(true);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'StickyWords/1.0'
            },
            timeout: 10000 // 10 second timeout
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Increment request counter
        API_CONFIG.requestCount++;
        
        // Parse response based on STANDS4 API structure
        if (data.results && data.results.result) {
            const results = Array.isArray(data.results.result) ? data.results.result : [data.results.result];
            console.log(`Found ${results.length} scripts for term: ${term}`);
            return results;
        }
        
        return [];
        
    } catch (error) {
        console.error('Error searching scripts:', error);
        
        // Handle different types of errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.error('Network error - check internet connection');
        } else if (error.message.includes('401')) {
            console.error('API authentication failed - check credentials');
        } else if (error.message.includes('429')) {
            console.error('API rate limit exceeded');
        }
        
        return [];
    } finally {
        // Hide loading indicator
        showLoadingIndicator(false);
    }
}

/**
 * Enhanced word selection with script context
 * @returns {Promise<Object>} Word object with enhanced script context
 */
async function getWordFromScripts() {
    const randomWord = { ...WORDS_DATABASE[Math.floor(Math.random() * WORDS_DATABASE.length)] };
    
    // Only use API if credentials are provided
    if (API_CONFIG.enabled && API_CONFIG.uid && API_CONFIG.tokenid) {
        try {
            let scripts = [];
            
            // Try multiple search strategies
            const searchTerms = [
                randomWord.word.toLowerCase(),
                randomWord.category,
                'drama', // fallback
                'movie' // final fallback
            ];
            
            for (const term of searchTerms) {
                scripts = await searchScripts(term);
                if (scripts.length > 0) {
                    console.log(`Found scripts using term: ${term}`);
                    break;
                }
            }
            
            if (scripts.length > 0) {
                const randomScript = scripts[Math.floor(Math.random() * scripts.length)];
                
                // Enhance word with script context
                randomWord.scriptContext = {
                    title: randomScript.title,
                    writer: randomScript.writer,
                    link: randomScript.link,
                    subtitle: randomScript.subtitle || ''
                };
                
                randomWord.source = `Found in "${randomScript.title}" by ${randomScript.writer}`;
                randomWord.example = randomWord.example + ` This sophisticated word might appear in scripts like "${randomScript.title}".`;
                
                console.log(`Enhanced word "${randomWord.word}" with script context from "${randomScript.title}"`);
            } else {
                randomWord.source = randomWord.source + ' (No matching scripts found)';
            }
            
        } catch (error) {
            console.error('API error, using fallback:', error);
            randomWord.source = randomWord.source + ' (API temporarily unavailable)';
        }
    } else {
        randomWord.source = randomWord.source + ' (Connect API for real script data)';
    }
    
    return randomWord;
}

/**
 * Validate API credentials
 * @returns {Promise<boolean>} True if credentials are valid
 */
async function validateApiCredentials() {
    if (!API_CONFIG.uid || !API_CONFIG.tokenid) {
        return false;
    }
    
    try {
        // Test with a simple search
        const scripts = await searchScripts('test');
        return true; // If no error thrown, credentials are likely valid
    } catch (error) {
        console.error('API credential validation failed:', error);
        return false;
    }
}

/**
 * Get API status and usage information
 * @returns {Object} API status information
 */
function getApiStatus() {
    return {
        configured: !!(API_CONFIG.uid && API_CONFIG.tokenid),
        enabled: API_CONFIG.enabled,
        requestCount: API_CONFIG.requestCount,
        dailyLimit: API_CONFIG.dailyLimit,
        remainingRequests: API_CONFIG.dailyLimit - API_CONFIG.requestCount
    };
}

/**
 * Reset daily request counter (called at midnight or app restart)
 */
function resetDailyRequestCount() {
    API_CONFIG.requestCount = 0;
    console.log('Daily API request count reset');
}

/**
 * Show/hide loading indicator
 * @param {boolean} show - Whether to show the loading indicator
 */
function showLoadingIndicator(show) {
    const indicator = document.getElementById('loadingIndicator');
    if (indicator) {
        if (show) {
            indicator.classList.add('show');
            indicator.setAttribute('aria-hidden', 'false');
        } else {
            indicator.classList.remove('show');
            indicator.setAttribute('aria-hidden', 'true');
        }
    }
}

/**
 * Initialize API service
 */
function initializeApiService() {
    console.log('API Service initialized');
    
    // Reset request count daily (simplified - in production, use proper date checking)
    const lastReset = localStorage.getItem('apiLastReset');
    const today = new Date().toDateString();
    
    if (lastReset !== today) {
        resetDailyRequestCount();
        localStorage.setItem('apiLastReset', today);
    }
    
    // Log API status
    const status = getApiStatus();
    console.log('API Status:', status);
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initializeApiService);
}