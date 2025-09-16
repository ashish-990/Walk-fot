// Game State Variables
let isWalking = false;
let coins = 0;
let coinInterval;
let lastResetTime = new Date().setHours(0,0,0,0); // Midnight

// DOM Elements
const character = document.getElementById('character');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const coinsDisplay = document.getElementById('coins');
const usdtDisplay = document.getElementById('usdt');
const statusDisplay = document.getElementById('status');
const withdrawSection = document.getElementById('withdraw-section');
const withdrawBtn = document.getElementById('withdraw-btn');
const addressInput = document.getElementById('address');
const networkSelect = document.getElementById('network');
const output = document.getElementById('output');

// Check if it's a new day and reset if needed
function checkDailyReset() {
    const now = new Date();
    const todayMidnight = new Date().setHours(0,0,0,0);
    
    if (lastResetTime < todayMidnight) {
        coins = 0;
        updateDisplay();
        lastResetTime = todayMidnight;
        addToOutput('> System reset for new day.');
    }
    
    if (now.getHours() === 0) {
        startBtn.disabled = false;
        statusDisplay.textContent = 'READY';
        addToOutput('> System unlocked for new day.');
    }
}

// Start the walking animation and coin accumulation
function startWalking() {
    if (isWalking) return;
    
    if (coins >= 1000) {
        addToOutput('> Daily limit reached. Try again after 12:00 AM.');
        return;
    }
    
    isWalking = true;
    statusDisplay.textContent = 'WALKING...';
    startBtn.disabled = true;
    character.style.animation = 'walk 3s linear infinite';
    addToOutput('> Movement initialized. Earning coins...');
    
    coinInterval = setInterval(() => {
        coins++;
        updateDisplay();
        
        if (coins >= 1000) {
            stopWalking();
            withdrawSection.style.display = 'block';
            addToOutput('> Target achieved. 20 USDT unlocked for withdrawal.');
            setTimeout(checkDailyReset, getMillisUntilMidnight());
        }
    }, 1000);
}

// Stop the walking animation
function stopWalking() {
    if (!isWalking) return;
    
    isWalking = false;
    statusDisplay.textContent = 'STOPPED';
    startBtn.disabled = false;
    character.style.animation = 'none';
    clearInterval(coinInterval);
    addToOutput('> Process halted. ' + coins + ' coins accumulated.');
}

// Update the display with current values
function updateDisplay() {
    coinsDisplay.textContent = coins;
    usdtDisplay.textContent = (coins / 50).toFixed(2); // 1000 coins = 20 USDT
}

// Add message to terminal output
function addToOutput(message) {
    output.innerHTML += '> ' + message + '<br>';
    output.scrollTop = output.scrollHeight;
}

// Calculate milliseconds until midnight
function getMillisUntilMidnight() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    return midnight - now;
}

// Handle withdrawal request
function handleWithdrawal() {
    const address = addressInput.value.trim();
    const network = networkSelect.value;
    
    if (!address) {
        addToOutput('> Error: Please enter a valid wallet address.');
        return;
    }
    
    addToOutput('> Withdrawal request: 20 USDT to ' + address + ' via ' + network);
    addToOutput('> Processing... (This is a simulation)');
    
    setTimeout(() => {
        addToOutput('> Success! 20 USDT sent. Allow 24-48 hours for processing.');
        coins = 0;
        updateDisplay();
        withdrawSection.style.display = 'none';
    }, 3000);
}

// Event Listeners
startBtn.addEventListener('click', startWalking);
stopBtn.addEventListener('click', stopWalking);
withdrawBtn.addEventListener('click', handleWithdrawal);

// Initialize game
checkDailyReset();
updateDisplay();
addToOutput('> System ready. Awaiting commands...');
