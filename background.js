let filters;

updateFilters();

function updateFilters() {
    chrome.storage.local.get('tab-filters', items => {
        filters = items['tab-filters'];
    });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
    updateFilters();
});

chrome.commands.onCommand.addListener(command => {
    chrome.windows.getCurrent({ populate: true }, window => {
        const tabIds = [];
        window.tabs.forEach(tab => {
          filters.forEach(filter => {
            if (tab.url.includes(filter)) {
              tabIds.push(tab.id);
            }
          })
        });

        tabIds.forEach((tab, index) => {
          chrome.tabs.move(tab, { index });
        });
    });
});