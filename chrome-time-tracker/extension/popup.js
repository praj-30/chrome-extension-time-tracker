chrome.storage.local.get(null, (data) => {
  const container = document.getElementById('siteList');
  for (const site in data) {
    const time = Math.round(data[site]);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    container.innerHTML += `<p><b>${site}:</b> ${minutes}m ${seconds}s</p>`;
  }
});
