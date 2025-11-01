import './fonts/ys-display/fonts.css';
import './style.css';

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

const { data, ...indexes } = initData(sourceData);

let sampleTable;
let applySearching;
let applyFiltering;
let applySorting;
let applyPagination;

function collectState() {
    const rawState = processFormData(new FormData(
        sampleTable.container.matches('form')
            ? sampleTable.container
            : sampleTable.container.querySelector('form')
    ));

    const rowsPerPage = parseInt(rawState.rowsPerPage ?? 10);
    const page = parseInt(rawState.page ?? 1);

    return {
        ...rawState,
        rowsPerPage,
        page
    };
}

function render(action) {
    const state = collectState();

    let result = [...data];

    result = applySearching(result, state, action);

    result = applyFiltering(result, state, action);

    result = applySorting(result, state, action);

    result = applyPagination(result, state, action);

    sampleTable.render(result);
}

sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

applySearching = initSearching('search');

applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers
});

applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');

        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;

        return el;
    }
);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();
