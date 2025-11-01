import { createComparison, defaultRules } from "../lib/compare.js";

export function initFiltering(elements, indexes) {

    Object.keys(indexes).forEach((elementName) => {
        const targetEl = elements[elementName];
        if (!targetEl) return;

        const options = Object.values(indexes[elementName]).map(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            return opt;
        });

        targetEl.append(...options);
    });

    const compare = createComparison(defaultRules);

    return (data, state, action) => {

        if (action && action.name === 'clear') {
            const fieldName = action.dataset.field;

            const filterRow = action.closest('.filter-row') || action.parentElement;
            if (filterRow && fieldName) {
                const input = filterRow.querySelector(`[name="${fieldName}"]`);
                if (input) {
                    input.value = '';
                }
            }

            if (fieldName && fieldName in state) {
                state[fieldName] = '';
            }
        }

        return data.filter(row => compare(row, state));
    };
}
