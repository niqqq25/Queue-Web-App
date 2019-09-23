import { status } from './constants';

export function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

export function setAttributes(el, attrs) {
    for (const [attrName, attrValue] of Object.entries(attrs)) {
        el.setAttribute(attrName, attrValue);
    }
}

export function loadOptionsToSelect(selectElement, options) {
    //default option
    let selectOption = document.createElement('option');
    setAttributes(selectOption, {
        value: '',
        selected: true,
        disabled: true,
        hidden: true,
    });
    selectOption.innerText = 'Pasirinkite';
    selectElement.appendChild(selectOption);

    //options
    options.map(option => {
        selectOption = document.createElement('option');
        selectOption.setAttribute('value', option.toLowerCase());
        selectOption.innerText = option;
        selectElement.appendChild(selectOption);
    });
}

export function setDataToLocalStorage({ index, data }) {
    const stringifiedData = JSON.stringify(data ? data : {});
    localStorage.setItem(index, stringifiedData);
}

export function getDataFromLocalStorage(index) {
    const data = localStorage.getItem(index);
    return data ? JSON.parse(data) : [];
}

export function getClient(clientId) {
    const clients = getDataFromLocalStorage('clients');
    return clients.filter(client => client.id === clientId)[0];
}

export function setClients(clientsArr) {
    const oldClients = getDataFromLocalStorage('clients');

    clientsArr.forEach(client => {
        let isNewClient = true;

        oldClients.forEach((oldClient, index) => {
            if (oldClient.id === client.id) {
                oldClients[index] = client;
                isNewClient = false;
            }
        });

        if (isNewClient) {
            oldClients.push(client);
        }
    });

    setDataToLocalStorage({ index: 'clients', data: oldClients });
}

export function getClientsInQueue(specialist) {
    const clients = getDataFromLocalStorage('clients');

    const filteredClients = clients.filter(
        client =>
            client.specialist === specialist &&
            client.queue > 0 &&
            client.status === status.waiting
    );
    const sortedClients = filteredClients.sort((a, b) => a - b);

    return sortedClients;
}
