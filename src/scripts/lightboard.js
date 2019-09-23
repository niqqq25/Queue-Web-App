import { ready, getClientsInQueue, setAttributes } from './utils';
import { specialists } from './constants';

const VISABLE_QUEUE_COLUMNS = 3;
const VISABLE_CLIENTS_PER_SPECIALIST = 4;

ready(() => {
    showLightboard();
});

function showLightboard() {
    const lightboardElement = document.getElementById('lightboard');

    const firstVisableColumn =
        getPageFromSessionStorage() * VISABLE_QUEUE_COLUMNS;
    const lastVisableColumn =
        (getPageFromSessionStorage() + 1) * VISABLE_QUEUE_COLUMNS;
    const visableSpecialists = specialists.slice(
        firstVisableColumn,
        lastVisableColumn
    );

    visableSpecialists.forEach(specialist => {
        const queueColumn = createQueueColumn(specialist);
        lightboardElement.appendChild(queueColumn);
    });

    //whenever page reloads it should load new page
    setPageToSessionStorage();
}

function createQueueColumn(specialist) {
    const queueColumn = document.createElement('div');
    setAttributes(queueColumn, {
        style: `width: calc(${100 / VISABLE_QUEUE_COLUMNS}% - 20px)`,
        class: 'queue-column',
    });

    //title
    const title = document.createElement('p');
    title.innerText = capitalize(specialist);
    title.setAttribute('class', 'queue-column-title');
    queueColumn.appendChild(title);

    //clients id list
    const clientsIdList = document.createElement('ul');
    clientsIdList.setAttribute('class', 'clients-id-list');

    //add clients id to the list
    const visableClientsInQueue = getClientsInQueue(specialist).slice(
        0,
        VISABLE_CLIENTS_PER_SPECIALIST
    );
    visableClientsInQueue.forEach((client, index) => {
        const clientField = createClientIdField(client.id);
        if (index === 0) {
            clientField.style.background = 'lightgreen';
        }
        clientsIdList.appendChild(clientField);
    });
    queueColumn.appendChild(clientsIdList);

    return queueColumn;
}

function createClientIdField(clientId) {
    const clientIdField = document.createElement('li');
    clientIdField.setAttribute('class', 'client-id-field');
    clientIdField.innerText = clientId;

    return clientIdField;
}

function getPageFromSessionStorage() {
    return Number(sessionStorage.getItem('page'));
}

function setPageToSessionStorage() {
    let page = getPageFromSessionStorage();
    const lastVisableColumn = (page + 1) * VISABLE_QUEUE_COLUMNS;
    const totalColumns = specialists.length;

    if (lastVisableColumn < totalColumns) {
        page++;
    } else {
        page = 0;
    }
    sessionStorage.setItem('page', page);
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
