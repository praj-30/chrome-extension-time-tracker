let activeTab = null;
let activeStartTime = Date.now();

// Listen when the active tab changes
chrome.tabs.onActivated.addListener(activeInfo => {
  trackTime();
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (tab.url) {
      activeTab = new URL(tab.url).hostname;
      activeStartTime = Date.now();
    }
  });
});

// Track how long a site was active
function trackTime() {
  if (activeTab) {
    const duration = (Date.now() - activeStartTime) / 1000;

    // Save to Chrome's local storage
    chrome.storage.local.get([activeTab], result => {
      const previous = result[activeTab] || 0;
      const total = previous + duration;
      chrome.storage.local.set({ [activeTab]: total });

      // Send to backend server
      sendDataToBackend(activeTab, duration);
    });
  }
}

// Send data to backend using fetch()
function sendDataToBackend(domain, duration) {
  fetch('http://localhost:3000/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      site: domain,
      timeSpent: Math.round(duration)
    })
  }).then(response => {
    if (response.ok) {
      console.log(`📤 Sent to backend: ${domain} - ${Math.round(duration)}s`);
    }
  }).catch(error => {
    console.error('❌ Error sending data to backend:', error);
  });
}

