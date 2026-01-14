(() => {
    let isProcessing = false;
    let delay = 1500;
    let consecutiveFailures = 0;
    const MAX_FAILURES = 10;

    // The SVG path for the "Filled" bookmark icon (Bookmarked state)
    // Provided by user: M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z
    const BOOKMARK_FILLED_PATH = "M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z";

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "START") {
            if (isProcessing) return;
            isProcessing = true;
            delay = request.delay || 1500;
            consecutiveFailures = 0;
            updateStatus("Looking for bookmarked tweets...");
            processQueue();
        } else if (request.action === "STOP") {
            isProcessing = false;
            updateStatus("Stopping requested...");
        }
    });

    function updateStatus(text) {
        chrome.runtime.sendMessage({ action: "UPDATE_STATUS", text: text }).catch(() => { });
    }

    function stopProcess(reason) {
        isProcessing = false;
        chrome.runtime.sendMessage({ action: "STOPPED", reason: reason }).catch(() => { });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getUnbookmarkButton() {
        // Find all path elements
        const paths = Array.from(document.querySelectorAll('path'));

        // Find the one matching our target d attribute
        const targetPath = paths.find(p => p.getAttribute('d') === BOOKMARK_FILLED_PATH);

        if (targetPath) {
            // Find the closest button ancestor
            return targetPath.closest('button') || targetPath.closest('[role="button"]');
        }
        return null;
    }

    async function processQueue() {
        if (!isProcessing) {
            stopProcess("Stopped by user.");
            return;
        }

        const btn = getUnbookmarkButton();

        if (btn) {
            try {
                updateStatus("Unbookmarking...");

                // Highlight for visual feedback
                btn.style.outline = "2px solid #f4212e";

                // Scroll into view
                btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await sleep(500);

                btn.click();

                consecutiveFailures = 0;

                // Wait for the action to take effect. 
                // The icon should change to "outline" or the tweet might be removed from DOM eventually.
                await sleep(delay);

                updateStatus("Bookmark removed.");

                // Loop again
                processQueue();
            } catch (e) {
                console.error("Error clicking button:", e);
                consecutiveFailures++;
                if (consecutiveFailures > MAX_FAILURES) {
                    stopProcess("Too many errors.");
                    return;
                }
                processQueue();
            }
        } else {
            // No filled bookmark icon found.
            // Could be because we need to scroll.
            handleNoButtonFound();
        }
    }

    async function handleNoButtonFound() {
        updateStatus("Scrolling for more...");
        const previousScroll = window.scrollY;

        // Scroll down a significant amount to trigger hydration/loading
        window.scrollBy(0, 800);
        await sleep(2000);

        if (window.scrollY === previousScroll) {
            // Check one last time after a longer wait
            await sleep(1000);
            if (!getUnbookmarkButton()) {
                stopProcess("No more bookmarked tweets found.");
                return;
            }
        }

        processQueue();
    }
})();
