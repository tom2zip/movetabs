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
    const filterListElem = document.createElement('li');
    // const spanElem = document.createElement('span');
    const textElem = document.createElement('p');
    const buttonElem = document.createElement('button');

    filterListElem.classList.add('list-group-item');
    textElem.innerHTML = filter;
    buttonElem.innerHTML = 'remove';
    buttonElem.onclick = e => { removeFilter(e.target); }
    // spanElem.appendChild(textElem);
    // spanElem.appendChild(buttonElem);
    // filterListElem.appendChild(spanElem);
    filterListElem.appendChild(textElem);
    filterListElem.appendChild(buttonElem);
    listElem.appendChild(filterListElem);

    
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
    }

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