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

function populateList() {
    tabFilters.forEach(filter => {
        addFilterToList(filter);
    });
}

function addFilterToList(filter) {
    const blockDiv = document.createElement('div');
    blockDiv.className += 'filter-block';

    const filterName = document.createElement('h1');
    filterName.innerHTML = filter;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className += 'close';
    removeButton.onclick = e => { removeFilter(e.target); };

    const xSpan = document.createElement('span');
    xSpan.innerHTML = '&times;';

    removeButton.appendChild(xSpan);
    blockDiv.appendChild(filterName);
    blockDiv.appendChild(removeButton);
    listElem.appendChild(blockDiv);    
}

function addFilterToStorage(filter) {
    tabFilters.push(filter);
    chrome.storage.local.set({ 'tab-filters': tabFilters });
}

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

    // initialize tab filters variable
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