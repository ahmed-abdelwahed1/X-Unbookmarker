document.addEventListener('DOMContentLoaded', async () => {
    // UI Elements
    const toggleBtn = document.getElementById('toggleBtn');
    const btnText = document.getElementById('btnText');
    const statusText = document.getElementById('statusText');
    const statusDot = document.querySelector('.status-dot');
    const activityLog = document.getElementById('activityLog');
    const delayInput = document.getElementById('delayInput');
    const delayDisplay = document.getElementById('delayDisplay');
    
    // Stats Elements
    const sessionCountEl = document.getElementById('sessionCount');
    const sessionStatEl = document.getElementById('sessionStat');
    const lifetimeStatEl = document.getElementById('lifetimeStat');
    const errorStatEl = document.getElementById('errorStat');

    // State
    let isRunning = false;
    let sessionDeleted = 0;
    
    // Initialize Stats
    await loadStats();

    // Update Delay Display
    delayInput.addEventListener('input', (e) => {
        const val = e.target.value;
        delayDisplay.textContent = `${(val / 1000).toFixed(1)}s`;
    });
    updateDelayDisplay(delayInput.value);

    // Toggle Button Handler
    toggleBtn.addEventListener('click', async () => {
        if (isRunning) {
            stopProcess();
        } else {
            startProcess();
        }
    });

    function updateDelayDisplay(val) {
        delayDisplay.textContent = `${(val / 1000).toFixed(1)}s`;
    }

    // --- Core Logic ---

    async function startProcess() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) return;

        // Check URL
        if (!tab.url.includes("x.com") && !tab.url.includes("twitter.com")) {
            log("Error: Not on X/Twitter", "error");
            return;
        }

        const delay = parseInt(delayInput.value, 10);
        
        try {
            // Optimistic UI update
            await chrome.tabs.sendMessage(tab.id, { action: "START", delay: delay });
            setRunningState(true);
            log("Process started...", "system");
        } catch (err) {
            log("Error: Please refresh the page.", "error");
            console.error(err);
        }
    }

    async function stopProcess() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) return;

        try {
            await chrome.tabs.sendMessage(tab.id, { action: "STOP" });
            // UI update handled by message listener or fallout
            log("Stopping process...", "system");
        } catch (e) {
            console.error(e);
        }
    }

    // --- UI Helpers ---

    function setRunningState(active) {
        isRunning = active;
        if (active) {
            toggleBtn.classList.add('stop'); // Change to stop style
            btnText.textContent = "Stop Cleaning";
            statusText.textContent = "ACTIVE";
            statusDot.style.animation = "pulse 1s infinite";
        } else {
            toggleBtn.classList.remove('stop');
            btnText.textContent = "Start Cleaning";
            statusText.textContent = "IDLE";
            statusDot.style.animation = "none";
            statusDot.style.opacity = "0.5";
        }
    }

    function log(msg, type = "normal") {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        
        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
        entry.textContent = `» [${time}] ${msg}`;
        
        activityLog.appendChild(entry);
        activityLog.scrollTop = activityLog.scrollHeight;
    }

    // --- Statistics ---

    async function loadStats() {
        const data = await chrome.storage.local.get(['lifetimeDeleted', 'totalErrors']);
        const lifetime = data.lifetimeDeleted || 0;
        const errors = data.totalErrors || 0;
        
        lifetimeStatEl.textContent = lifetime.toLocaleString();
        errorStatEl.textContent = errors.toLocaleString();
    }

    async function incrementStats() {
        sessionDeleted++;
        
        // Update Session UI
        sessionCountEl.textContent = sessionDeleted;
        sessionStatEl.textContent = sessionDeleted.toLocaleString();

        // Update Lifetime Storage & UI
        const data = await chrome.storage.local.get(['lifetimeDeleted']);
        let lifetime = data.lifetimeDeleted || 0;
        lifetime++;
        
        await chrome.storage.local.set({ lifetimeDeleted: lifetime });
        lifetimeStatEl.textContent = lifetime.toLocaleString();
    }

    async function incrementErrors() {
        const data = await chrome.storage.local.get(['totalErrors']);
        let errors = data.totalErrors || 0;
        errors++;
        
        await chrome.storage.local.set({ totalErrors: errors });
        errorStatEl.textContent = errors.toLocaleString();
    }

    // --- Chrome Runtime Messages ---

    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === "UPDATE_STATUS") {
            // Use status updates as log entries if suitable
            // Or if message contains specific "log" field
            if (message.text) {
                log(message.text);
                if (message.text.toLowerCase().includes("removed") || message.text.toLowerCase().includes("unbookmarked")) {
                    incrementStats();
                }
            }
        }
        
        if (message.action === "STOPPED") {
            setRunningState(false);
            log(message.reason || "Process stopped.", "system");
        }

        if (message.action === "ERROR") {
             log(message.text || "An error occurred", "error");
             incrementErrors();
        }
    });
});
