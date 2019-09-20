import { setAttributes } from '../utils';

const specialistNames = ['traktoristas', 'klounas', 'buhalteris'];

export default function getForm(submitCallback) {
    const form = document.createElement('form');
    setAttributes(form, {
        id: 'registration-form',
        class: 'text-center',
    });
    form.addEventListener('submit', submitCallback);

    //title
    const title = document.createElement('h2');
    title.setAttribute('id', 'title');
    title.innerHTML = 'Registracijos forma';

    //fieldset
    const fieldset = document.createElement('fieldset');
    fieldset.setAttribute('class', 'form-group');

    //first name
    const fnameLabel = getLabel({
        forAttribute: 'name',
        innerText: 'Vardas',
    });
    const fnameInput = document.createElement('input');
    setAttributes(fnameInput, {
        type: 'text',
        id: 'name',
        name: 'name',
        placeholder: 'Vardas',
        class: 'form-control',
        spellcheck: 'false',
        required: '',
        pattern: '^\\p{Lu}\\p{Ll}+$',
    });
    const fnameFieldset = fieldset.cloneNode();
    fnameFieldset.appendChild(fnameLabel);
    fnameFieldset.appendChild(fnameInput);

    //specialist
    const specialistLabel = getLabel({
        forAttribute: 'specialist',
        innerText: 'Specialistas',
    });
    const specialistSelect = document.createElement('select');
    setAttributes(specialistSelect, {
        id: 'specialist',
        name: 'specialist',
        class: 'form-control',
        required: '',
    });
    addOpptions(specialistSelect, specialistNames);
    const specialistFieldset = fieldset.cloneNode();
    specialistFieldset.appendChild(specialistLabel);
    specialistFieldset.appendChild(specialistSelect);

    //submit button
    const submitButton = document.createElement('input');
    setAttributes(submitButton, {
        id: 'submit-button',
        type: 'submit',
        value: 'Registruoti',
        class: 'btn btn-primary',
    });

    form.appendChild(title);
    form.appendChild(fnameFieldset);
    form.appendChild(specialistFieldset);
    form.appendChild(submitButton);
    return form;
}

function getLabel({ forAttribute, innerText }) {
    const label = document.createElement('label');
    label.setAttribute('for', forAttribute);
    label.innerText = innerText;
    return label;
}

function addOpptions(el, optionsArr) {
    optionsArr.map(option => {
        const selectOption = document.createElement('option');
        selectOption.setAttribute('value', option.toLowerCase());
        selectOption.innerText = option;
        el.appendChild(selectOption);
    });
}
