document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const statusText = document.getElementById('statusText');
    const statusIndicator = document.getElementById('statusIndicator');
    const delayInput = document.getElementById('delayInput');
    const delayDisplay = document.getElementById('delayDisplay');

    // Initial display update
    updateDelayDisplay(delayInput.value);

    // Update delay display
    delayInput.addEventListener('input', (e) => {
        updateDelayDisplay(e.target.value);
    });

    function updateDelayDisplay(val) {
        const seconds = (val / 1000).toFixed(1);
        delayDisplay.textContent = `${seconds}s`;
    }

    function setStatus(text, isActive) {
        statusText.textContent = text;
        if (isActive) {
            statusIndicator.classList.add('active');
        } else {
            statusIndicator.classList.remove('active');
        }
    }

    // Start Button
    startBtn.addEventListener('click', async () => {
        const delay = parseInt(delayInput.value, 10);

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) return;

        // Basic check if we are on X
        if (!tab.url.includes("x.com") && !tab.url.includes("twitter.com")) {
            setStatus("Error: Not on X.com", false);
            return;
        }

        startBtn.disabled = true;
        stopBtn.disabled = false;
        setStatus("Starting...", true);

        try {
            await chrome.tabs.sendMessage(tab.id, { action: "START", delay: delay });
        } catch (err) {
            setStatus("Please refresh the page first!", false);
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
    });

    // Stop Button
    stopBtn.addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) return;

        try {
            await chrome.tabs.sendMessage(tab.id, { action: "STOP" });
            setStatus("Stopping...", false);
        } catch (e) {
            console.error(e);
        }
    });

    // Listen for updates from Content Script
    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === "UPDATE_STATUS") {
            setStatus(message.text, true);
        }
        if (message.action === "STOPPED") {
            startBtn.disabled = false;
            stopBtn.disabled = true;
            setStatus(message.reason || "Stopped.", false);
        }
    });
});
