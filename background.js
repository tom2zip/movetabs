let filters;

function updateFilters() {
    chrome.storage.local.get('tab-filters', items => {
        filters = items['tab-filters'];
    });
}

// to fill the filters list initially
updateFilters();

// update list dom for every change in the storage
chrome.storage.onChanged.addListener(() => {
    updateFilters();
});


// move any tab with any filter in its url
chrome.commands.onCommand.addListener(() => {
    chrome.windows.getCurrent({ populate: true }, window => {
        const tabIds = [];
        window.tabs.forEach(tab => {
            filters.forEach(filter => {
                if (tab.url.includes(filter)) {
                    tabIds.push(tab.id);
                }
            });
        });

        // move to their respective positions in the tabIds array
        tabIds.forEach((tab, index) => {
            chrome.tabs.move(tab, { index });
        });
    });
});