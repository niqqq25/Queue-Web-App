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

export function getFirstInLineClients({ specialist, clientsAmount }) {
    const clients = getDataFromLocalStorage('clients');

    const filteredClients = clients.filter(
        client =>
            client.specialist === specialist &&
            client.queue <= clientsAmount &&
            client.status === status.waiting
    );
    const sortedClients = filteredClients.sort((a, b) => a - b);

    return sortedClients;
}

export function setDataToLocalStorage({ index, data }) {
    const stringifiedData = JSON.stringify(data ? data : {});
    localStorage.setItem(index, stringifiedData);
}

export function getDataFromLocalStorage(index) {
    const data = localStorage.getItem(index);
    return data ? JSON.parse(data) : null;
}

export function getClient(clientId) {
    const clients = getDataFromLocalStorage('clients');
    return clients.filter(client => client.id === Number(clientId))[0];
}

export function setClient(client) {
    const oldClients = getDataFromLocalStorage('clients');
    let isNewClient = true;

    oldClients.map((oldClient, index) => {
        if (oldClient.id === client.id) {
            oldClients[index] = client;
            isNewClient = false;
        }
    });

    if (isNewClient) {
        oldClients.push(client);
    }

    setDataToLocalStorage({ index: 'clients', data: oldClients });
}

export function getLastInQueue(specialist) {
    const clients = getDataFromLocalStorage('clients');
    let lastQueue = 0;
    clients.map(client => {
        if (
            client.specialist === specialist &&
            client.queue > lastQueue &&
            client.status === client.waiting
        ) {
            lastQueue = client.queue;
        }
    });

    return lastQueue;
}
