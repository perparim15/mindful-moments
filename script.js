// DOM Elements
const languageButtons = document.querySelectorAll('.language-btn');
const moodOptions = document.querySelectorAll('.mood-option');
const interestTags = document.querySelectorAll('.interest-tag');
const getRecommendationsBtn = document.getElementById('get-recommendations');
const recommendationsSection = document.getElementById('recommendations');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const startBreathingBtn = document.getElementById('start-breathing');
const breathingContainer = document.getElementById('breathing-container');
const startPauseBreathingBtn = document.getElementById('start-pause-breathing');
const resetBreathingBtn = document.getElementById('reset-breathing');
const breathingText = document.getElementById('breathing-text');
const breathingInstruction = document.getElementById('breathing-instruction');
const newQuoteBtn = document.getElementById('new-quote');
const quoteLoader = document.querySelector('#quote-container .loader');
const dailyQuote = document.getElementById('daily-quote');
const goToCheckinBtn = document.getElementById('go-to-checkin');

// App State
const state = {
    language: 'en',
    selectedMood: null,
    selectedInterests: [],
    breathingState: 'idle', // idle, inhale, hold, exhale
    breathingInterval: null,
    userData: {
        history: []
    }
};

// Translations
const translations = {
    en: {
        title: "How are you feeling today?",
        moodQuestion: "Select the option that best describes your current mood:",
        moodOptions: {
            happy: "Happy",
            calm: "Calm",
            anxious: "Anxious",
            sad: "Sad",
            angry: "Angry"
        },
        thoughtsQuestion: "What's on your mind today? (Optional)",
        interestsQuestion: "What type of support would you find helpful right now?",
        interestOptions: {
            meditation: "Meditation",
            breathing: "Breathing Exercises",
            motivation: "Motivation",
            relaxation: "Relaxation",
            sleep: "Better Sleep",
            gratitude: "Gratitude"
        },
        getRecommendationsBtn: "Get Personalized Support",
        tabs: {
            mood: "Check-In",
            resources: "Resources",
            history: "My Journey"
        },
        // Add more translations as needed
    },
    sq: {
        title: "Si po ndiheni sot?",
        moodQuestion: "Zgjidhni opsionin që përshkruan më mirë gjendjen tuaj aktuale:",
        moodOptions: {
            happy: "I/E lumtur",
            calm: "I/E qetë",
            anxious: "I/E shqetësuar",
            sad: "I/E trishtuar",
            angry: "I/E zemëruar"
        },
        thoughtsQuestion: "Çfarë po mendoni sot? (Opsionale)",
        interestsQuestion: "Çfarë lloj mbështetjeje do t'ju ndihmonte tani?",
        interestOptions: {
            meditation: "Meditim",
            breathing: "Ushtrime Frymëmarrjeje",
            motivation: "Motivim",
            relaxation: "Relaksim",
            sleep: "Gjumë më i mirë",
            gratitude: "Mirënjohje"
        },
        getRecommendationsBtn: "Merr Mbështetje të Personalizuar",
        tabs: {
            mood: "Kontroll",
            resources: "Burime",
            history: "Udhëtimi Im"
        },
        // Additional translations
        recommendationsTitle: "Rekomandime të Personalizuara",
        breathingExercise: {
            title: "Ushtrim i Frymëmarrjes 4-7-8",
            description: "Kjo teknikë e thjeshtë frymëmarrjeje mund të ndihmojë në uljen e ankthit dhe nxitjen e relaksimit. Merrni frymë për 4 sekonda, mbajeni për 7 sekonda dhe nxirreni për 8 sekonda.",
            start: "Fillo Ushtrimin",
            ready: "Gati",
            inhale: "Merr frymë",
            hold: "Mbaj",
            exhale: "Nxirr frymën",
            getReady: "Përgatituni për të filluar"
        }
    }
};

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    loadUserData();
});

function initApp() {
    // Set up event listeners
    setupLanguageButtons();
    setupMoodSelection();
    setupInterestTags();
    setupTabs();
    setupRecommendationsButton();
    setupBreathingExercise();
    setupQuoteGenerator();
    setupHistoryNavigation();
    
    // Check for parameters in URL for deep linking
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('lang')) {
        const lang = urlParams.get('lang');
        if (lang === 'sq' || lang === 'en') {
            changeLanguage(lang);
        }
    }
}

function setupLanguageButtons() {
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
}

function changeLanguage(lang) {
    // Update state
    state.language = lang;
    
    // Update UI for active language button
    languageButtons.forEach(button => {
        if (button.getAttribute('data-lang') === lang) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update UI text based on selected language
    updateUILanguage();
    
    // Save language preference
    saveUserData();
}

function updateUILanguage() {
    const lang = state.language;
    const t = translations[lang];
    
    // Update headings
    document.querySelector('h1').textContent = t.title;
    
    // Update questions
    document.querySelectorAll('.question')[0].textContent = t.moodQuestion;
    document.querySelectorAll('.question')[1].textContent = t.thoughtsQuestion;
    document.querySelectorAll('.question')[2].textContent = t.interestsQuestion;
    
    // Update mood options
    moodOptions.forEach(option => {
        const mood = option.getAttribute('data-mood');
        option.querySelector('.mood-label').textContent = t.moodOptions[mood];
    });
    
    // Update interest tags
    interestTags.forEach(tag => {
        const interest = tag.getAttribute('data-interest');
        tag.textContent = t.interestOptions[interest];
    });
    
    // Update button
    getRecommendationsBtn.textContent = t.getRecommendationsBtn;
    
    // Update tabs
    tabs.forEach(tab => {
        const tabId = tab.getAttribute('data-tab');
        tab.textContent = t.tabs[tabId];
    });
    
    // Update breathing exercise content if language includes it
    if (t.breathingExercise) {
        document.querySelector('.breathing-recommendation h3').textContent = t.breathingExercise.title;
        document.querySelector('.breathing-recommendation p').textContent = t.breathingExercise.description;
        startBreathingBtn.textContent = t.breathingExercise.start;
        startPauseBreathingBtn.textContent = t.breathingExercise.start;
        
        // Only update these if they're in their default state
        if (breathingText.textContent === "Ready") {
            breathingText.textContent = t.breathingExercise.ready;
        }
        if (breathingInstruction.textContent === "Get ready to begin") {
            breathingInstruction.textContent = t.breathingExercise.getReady;
        }
    }
    
    // Update more UI elements as needed
}

function setupMoodSelection() {
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            moodOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Update state
            state.selectedMood = this.getAttribute('data-mood');
        });
    });
}

function setupInterestTags() {
    interestTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const interest = this.getAttribute('data-interest');
            
            // Toggle selected class
            this.classList.toggle('selected');
            
            // Update state
            if (this.classList.contains('selected')) {
                if (!state.selectedInterests.includes(interest)) {
                    state.selectedInterests.push(interest);
                }
            } else {
                state.selectedInterests = state.selectedInterests.filter(i => i !== interest);
            }
        });
    });
}

function setupTabs() {
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

function setupRecommendationsButton() {
    getRecommendationsBtn.addEventListener('click', function() {
        if (!state.selectedMood) {
            alert('Please select your current mood');
            return;
        }
        
        // Show recommendations with a slight delay for UI feedback
        setTimeout(() => {
            recommendationsSection.style.display = 'block';
            
            // Scroll to recommendations
            recommendationsSection.scrollIntoView({ behavior: 'smooth' });
            
            // Customize recommendations based on selections
            customizeRecommendations();
            
            // Load quote
            setTimeout(() => {
                quoteLoader.classList.add('hidden');
                dailyQuote.classList.remove('hidden');
            }, 1500);
            
            // Save check-in data
            saveCheckInData();
        }, 300);
    });
}

function customizeRecommendations() {
    // Hide all recommendations initially
    document.querySelectorAll('.recommendation-card').forEach(card => {
        card.style.display = 'none';
    });
    
    // Show relevant recommendations based on mood and interests
    const mood = state.selectedMood;
    const interests = state.selectedInterests;
    
    // Always show breathing recommendation for anxious or angry
    if (mood === 'anxious' || mood === 'angry' || interests.includes('breathing')) {
        document.querySelector('.breathing-recommendation').style.display = 'flex';
    }
    
    // Show meditation for calm, sad, or if selected
    if (mood === 'calm' || mood === 'sad' || interests.includes('meditation')) {
        document.querySelector('.meditation-recommendation').style.display = 'flex';
    }
    
    // Show gratitude for happy or if selected
    if (mood === 'happy' || interests.includes('gratitude')) {
        document.querySelector('.gratitude-recommendation').style.display = 'flex';
    }
    
    // Show motivation for sad or if selected
    if (mood === 'sad' || interests.includes('motivation')) {
        document.querySelector('.motivation-recommendation').style.display = 'flex';
    }
    
    // Ensure at least one recommendation is shown
    let anyVisible = false;
    document.querySelectorAll('.recommendation-card').forEach(card => {
        if (card.style.display === 'flex') {
            anyVisible = true;
        }
    });
    
    if (!anyVisible) {
        // Show breathing as default
        document.querySelector('.breathing-recommendation').style.display = 'flex';
        // Show motivation as default
        document.querySelector('.motivation-recommendation').style.display = 'flex';
    }
}

function setupBreathingExercise() {
    startBreathingBtn.addEventListener('click', function() {
        breathingContainer.classList.remove('hidden');
        this.classList.add('hidden');
    });
    
    startPauseBreathingBtn.addEventListener('click', function() {
        if (state.breathingState === 'idle') {
            // Start breathing exercise
            startBreathingExercise();
            this.textContent = 'Pause';
        } else {
            // Pause breathing exercise
            pauseBreathingExercise();
            this.textContent = 'Resume';
        }
    });
    
    resetBreathingBtn.addEventListener('click', function() {
        resetBreathingExercise();
    });
}

function startBreathingExercise() {
    const circle = document.querySelector('.progress-ring__circle');
    const circumference = 2 * Math.PI * 26; // 26 is the radius of the circle
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    
    // Initialize breathing state
    state.breathingState = 'inhale';
    updateBreathingUI('inhale');
    
    // Set up animation interval
    let timeElapsed = 0;
    state.breathingInterval = setInterval(() => {
        timeElapsed += 0.1;
        
        if (state.breathingState === 'inhale' && timeElapsed >= 4) {
            // Transition to hold
            state.breathingState = 'hold';
            timeElapsed = 0;
            updateBreathingUI('hold');
        } else if (state.breathingState === 'hold' && timeElapsed >= 7) {
            // Transition to exhale
            state.breathingState = 'exhale';
            timeElapsed = 0;
            updateBreathingUI('exhale');
        } else if (state.breathingState === 'exhale' && timeElapsed >= 8) {
            // Transition back to inhale
            state.breathingState = 'inhale';
            timeElapsed = 0;
            updateBreathingUI('inhale');
        }
        
        // Update progress visualization
        updateBreathingProgress(timeElapsed, state.breathingState);
    }, 100);
}

function updateBreathingUI(phase) {
    const t = translations[state.language].breathingExercise || {
        inhale: "Inhale",
        hold: "Hold",
        exhale: "Exhale"
    };
    
    if (phase === 'inhale') {
        breathingText.textContent = '4s';
        breathingInstruction.textContent = t.inhale;
    } else if (phase === 'hold') {
        breathingText.textContent = '7s';
        breathingInstruction.textContent = t.hold;
    } else if (phase === 'exhale') {
        breathingText.textContent = '8s';
        breathingInstruction.textContent = t.exhale;
    }
}

function updateBreathingProgress(timeElapsed, phase) {
    const circle = document.querySelector('.progress-ring__circle');
    const circumference = 2 * Math.PI * 26;
    let maxTime;
    
    if (phase === 'inhale') maxTime = 4;
    else if (phase === 'hold') maxTime = 7;
    else if (phase === 'exhale') maxTime = 8;
    
    const progress = timeElapsed / maxTime;
    const dashoffset = circumference * (1 - progress);
    circle.style.strokeDashoffset = dashoffset;
}

function pauseBreathingExercise() {
    clearInterval(state.breathingInterval);
    state.breathingInterval = null;
}

function resetBreathingExercise() {
    // Clear interval if running
    if (state.breathingInterval) {
        clearInterval(state.breathingInterval);
        state.breathingInterval = null;
    }
    
    // Reset state
    state.breathingState = 'idle';
    
    // Reset UI
    const t = translations[state.language].breathingExercise || {
        ready: "Ready",
        getReady: "Get ready to begin"
    };
    
    breathingText.textContent = t.ready;
    breathingInstruction.textContent = t.getReady;
    startPauseBreathingBtn.textContent = state.language === 'en' ? 'Start' : 'Fillo';
    
    // Reset progress ring
    const circle = document.querySelector('.progress-ring__circle');
    circle.style.strokeDashoffset = 0;
}

function setupQuoteGenerator() {
    // Quotes for demonstration (would be fetched from API in production)
    const quotes = [
        { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
        { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
        { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
        { text: "If life were predictable it would cease to be life, and be without flavor.", author: "Eleanor Roosevelt" },
        { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa" },
        { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
        { text: "Always remember that you are absolutely unique. Just like everyone else.", author: "Margaret Mead" },
        { text: "Don't judge each day by the harvest you reap but by the seeds that you plant.", author: "Robert Louis Stevenson" }
    ];
    
    newQuoteBtn.addEventListener('click', function() {
        // Show loader
        quoteLoader.classList.remove('hidden');
        dailyQuote.classList.add('hidden');
        
        // Simulate API call with timeout
        setTimeout(() => {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            
            // Update quote content
            document.querySelector('#daily-quote p:first-child').textContent = `"${randomQuote.text}"`;
            document.querySelector('#daily-quote p:last-child').textContent = `— ${randomQuote.author}`;
            
            // Hide loader, show quote
            quoteLoader.classList.add('hidden');
            dailyQuote.classList.remove('hidden');
        }, 1000);
    });
}

function setupHistoryNavigation() {
    goToCheckinBtn.addEventListener('click', function() {
        // Switch to mood tab
        tabs.forEach(tab => {
            if (tab.getAttribute('data-tab') === 'mood') {
                tab.click();
            }
        });
    });
}

function saveCheckInData() {
    const now = new Date();
    const checkInData = {
        date: now.toISOString(),
        mood: state.selectedMood,
        thoughts: document.getElementById('thoughts').value,
        interests: [...state.selectedInterests]
    };
    
    // Add to history
    state.userData.history.unshift(checkInData);
    
    // Limit history to recent entries
    if (state.userData.history.length > 30) {
        state.userData.history = state.userData.history.slice(0, 30);
    }
    
    // Save to local storage
    saveUserData();
    
    // Update history UI
    updateHistoryUI();
}

function updateHistoryUI() {
    if (state.userData.history.length > 0) {
        // Hide empty state
        document.getElementById('no-history').classList.add('hidden');
        
        // Show history content
        const historyContent = document.getElementById('history-content');
        historyContent.classList.remove('hidden');
        
        // Clear existing history cards
        const historySection = historyContent.querySelector('.history-section');
        historySection.innerHTML = '';
        
        // Add history cards
        state.userData.history.forEach(entry => {
            const date = new Date(entry.date);
            const formattedDate = `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            
            // Map mood to emoji
            const moodEmojis = {
                happy: '😊',
                calm: '😌',
                anxious: '😰',
                sad: '😔',
                angry: '😠'
            };
            
            // Map mood to text based on language
            const moodText = translations[state.language].moodOptions[entry.mood];
            
            const cardHTML = `
                <div class="history-card">
                    <div class="history-date">${formattedDate}</div>
                    <div class="history-mood">
                        <span class="history-mood-emoji">${moodEmojis[entry.mood]}</span>
                        <span>${moodText}</span>
                    </div>
                    ${entry.thoughts ? `<p>"${entry.thoughts}"</p>` : ''}
                </div>
            `;
            
            historySection.innerHTML += cardHTML;
        });
    }
}

function saveUserData() {
    // Add expiration date (180 days from now)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 180);
    
    const dataToSave = {
        ...state.userData,
        preferences: {
            language: state.language
        },
        expirationDate: expirationDate.toISOString()
    };
    
    try {
        localStorage.setItem('mindwell_user_data', JSON.stringify(dataToSave));
    } catch (e) {
        console.error('Error saving user data:', e);
    }
}

function loadUserData() {
    try {
        const savedData = localStorage.getItem('mindwell_user_data');
        
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            
            // Check if data is expired
            const expirationDate = new Date(parsedData.expirationDate);
            const now = new Date();
            
            if (now < expirationDate) {
                // Data is still valid
                state.userData = parsedData;
                
                // Restore preferences
                if (parsedData.preferences) {
                    if (parsedData.preferences.language) {
                        changeLanguage(parsedData.preferences.language);
                    }
                }
                
                // Update UI
                updateHistoryUI();
            } else {
                // Data is expired, remove it
                localStorage.removeItem('mindwell_user_data');
            }
        }
    } catch (e) {
        console.error('Error loading user data:', e);
    }
}
