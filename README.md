# X-Unbookmarker

**X-Unbookmarker** is a Chrome Extension designed to help you manage your digital footprint on X (formerly Twitter) by automating the process of removing bookmarks.

Whether you want to declutter your saved tweets or just start fresh, this tool allows you to bulk-remove bookmarks with a customizable delay and real-time progress tracking.

---

## 🚀 Features

- **Automated Cleaning**: Automatically finds and unbookmarks tweets on your Bookmarks page.
- **Smart Scrolling**: Automatically scrolls down to load more tweets when the current batch is cleared.
- **Customizable Delay**: Adjustable delay between actions to avoid hitting X/Twitter rate limits.
- **Robust Error Handling**: Automatically retries on failure and stops if too many errors occur.
- **Real-time Statistics**: Tracks session-based and lifetime stats for removed bookmarks.
- **Optimized UI**: Simple popup interface with a modern, dark-mode compatible design.

## 🛠️ Installation

Since this extension is not yet in the Chrome Web Store, you can install it in **Developer Mode**.

1. **Clone or Download** this repository to your local machine.
   ```bash
   git clone https://github.com/yourusername/X-Unbookmarker.git
   ```
   *(Or download the ZIP and extract it)*

2. Open Google Chrome and navigate to:
   `chrome://extensions/`

3. Toggle **Developer mode** in the top right corner.

4. Click **Load unpacked** (top left).

5. Select the folder where you saved this project (the folder containing `manifest.json`).

6. The **X Unbookmarker** extension should now appear in your list!

## 📖 Usage

1. Log in to your X (Twitter) account.
2. Navigate to your Bookmarks page: https://x.com/i/bookmarks
3. Click the **X-Unbookmarker** icon in your browser toolbar.
4. (Optional) Adjust the **Delay** slider if you want to go faster or slower (default is around 1.5s).
5. Click **Start Cleaning**.
6. The extension will highlight each unbookmark button in red, click it, and move to the next.
7. To stop, simply click **Stop Cleaning** in the popup or close the tab.

> **Note**: If the process stops or gets stuck, try refreshing the page and starting again.

## 🔒 Privacy

This extension runs entirely **locally** in your browser.
- No data is sent to any external server.
- Your credentials remain secure within your browser session.
- Statistics are stored using Chrome's local storage API purely for your own tracking.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
