const listElem = document.getElementById('filter-list');
const input = document.getElementById('filter-text');
let tabFilters;

// empty objects are not truthy...
function isEmpty(obj) {
    for (let k in obj) {
        if (obj.hasOwnProperty(k)) {
            return false;
        }
    }
    return true;
}

// populate the dom with filter blocks
function populateList() {
    tabFilters.forEach(filter => {
        addFilterToList(filter);
    });
}

// create a filter block
function addFilterToList(filter) {

    // div that will hold the filter
    const blockDiv = document.createElement('div');
    blockDiv.className += 'filter-block';

    const filterName = document.createElement('h1');
    filterName.innerHTML = filter;
    filterName.className += 'filter-name';

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className += 'close';
    removeButton.onclick = e => { removeFilter(e.target); };

    // the x button
    const xSpan = document.createElement('span');
    xSpan.innerHTML = '&times;';

    removeButton.appendChild(xSpan);
    blockDiv.appendChild(filterName);
    blockDiv.appendChild(removeButton);
    listElem.appendChild(blockDiv);    
}

// set the new state of tab filters in storage instead of "adding"
function addFilterToStorage(filter) {
    tabFilters.push(filter);
    chrome.storage.local.set({ 'tab-filters': tabFilters });
}

// remove filter from dom and storage
function removeFilter(elem) {
    const targetedListElem = elem.parentNode.parentNode;
    const filterIndex = Array.from(listElem.children).indexOf(targetedListElem);
    listElem.removeChild(targetedListElem);
    tabFilters.splice(filterIndex, 1);
    chrome.storage.local.set({ 'tab-filters': tabFilters });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-button').onclick = () => {
        if (input.value) {
            addFilterToList(input.value);
            addFilterToStorage(input.value);
            input.value = '';
        }
    };

    // initialize tab filters variable on load
    chrome.storage.local.get('tab-filters', items => {
        if (isEmpty(items)) {
            chrome.storage.local.set({ 'tab-filters': [] }, () => {
                tabFilters = [];
            });
        } else {
            tabFilters = items['tab-filters'];
        }
        populateList(tabFilters);
    });
    
});