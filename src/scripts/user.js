import 'bootstrap/dist/css/bootstrap.css';
import {
    ready,
    setAttributes,
    getClient,
    setClients,
    getClientsInQueue,
    getDataFromLocalStorage,
} from './utils';
import { createFormSubmitAlert } from './sharedElements';
import { alertStatus, status } from './constants';

ready(() => {
    const clientId = getClientIdFromSessionStorage();
    //check or client is logged in
    if (clientId) {
        const isClientWaiting =
            (getClient(clientId) || {}).status === status.waiting;
        if (isClientWaiting) {
            addAutoReload();
            showClientInfoElement(clientId);
        } else {
            handleClientLogOut();
        }
    } else {
        showClientLoginForm();
    }
});

function showClientInfoElement(clientId) {
    const root = document.getElementById('root');
    const client = getClient(clientId);
    const clientInfoElement = createClientInfoElement(client);

    root.appendChild(clientInfoElement);
    document
        .getElementById('back-button')
        .addEventListener('click', handleClientLogOut);
    document
        .getElementById('delay-visit-button')
        .addEventListener('click', () => {
            handleDelayVisit(client.id, client.specialist);
        });
    document
        .getElementById('cancel-visit-button')
        .addEventListener('click', () => {
            handleCancelVisit(client.id);
        });
}

function showClientLoginForm() {
    const root = document.getElementById('root');
    const clientLoginForm = createClientLoginForm();
    clientLoginForm.addEventListener('submit', handleClientLogin);
    root.appendChild(clientLoginForm);
}

function addAutoReload() {
    const meta = document.createElement('meta');
    setAttributes(meta, {
        'http-equiv': 'refresh',
        content: '5',
    });
    document.getElementsByTagName('head')[0].appendChild(meta);
}

function handleClientLogin(event) {
    event.preventDefault();
    const clientId = this.elements['client-id'].value;

    const client = getClient(clientId) || {};

    if (client.status === status.waiting) {
        setClientIdToSessionStorage(clientId);
        location.reload();
    } else {
        showAlert(alertStatus.fail);
        this.reset();
    }
}

function handleClientLogOut() {
    removeClientIdFromSessionStorage();
    location.reload();
}

function showAlert(status) {
    const root = document.getElementById('root');
    const alert = createFormSubmitAlert(status, {
        failMessage: {
            heading: 'Nepavyko prisijungti',
            paragraph: 'Neteisingas kodas',
        },
    });

    root.appendChild(alert);
}

function handleDelayVisit(clientId, specialist) {
    const clients = getClientsInQueue(specialist);
    const currentClient = clients.filter(client => client.id === clientId)[0];
    const currentClientQueue = currentClient.queue;

    if (currentClientQueue === 1 || currentClientQueue === clients.length) {
        return;
    }

    const clientBehindCurrentClient = clients.filter(
        client => client.queue === currentClientQueue + 1
    )[0];
    currentClient.queue++;
    clientBehindCurrentClient.queue--;
    setClients([currentClient, clientBehindCurrentClient]);

    location.reload();
}

function handleCancelVisit(clientId) {
    const client = getClient(clientId);
    if (client.queue !== 1) {
        client.status = status.canceled;
        client.queue = 0;
        setClients([client]);
        location.reload();
    }
}

function getAverageServiceTime(specialist) {
    const clients = getDataFromLocalStorage('clients');

    let totalTime = 0;
    let clientCount = 0;

    clients.forEach(client => {
        if (
            client.status === status.serviced &&
            client.specialist === specialist
        ) {
            totalTime += getServiceTime(client.serviceStart, client.serviceEnd);
            clientCount++;
        }
    });

    return Math.ceil(totalTime / clientCount) || 0;
}

function getServiceTime(serviceStart, serviceEnd) {
    const startDate = new Date(serviceStart);
    const endDate = new Date(serviceEnd);

    return (endDate - startDate) / 1000 / 60;
}

function getClientIdFromSessionStorage() {
    return sessionStorage.getItem('clientId');
}

function setClientIdToSessionStorage(clientId) {
    sessionStorage.setItem('clientId', clientId);
}

function removeClientIdFromSessionStorage() {
    sessionStorage.removeItem('clientId');
}

function createClientInfoElement(client) {
    const clientInfoElement = document.createElement('div');
    clientInfoElement.setAttribute('id', 'client-info-element');

    //titile
    const title = document.createElement('strong');
    title.setAttribute('id', 'client-info-title');
    title.innerHTML = 'Informacija apie klientą';

    //table
    const clientInfoTable = document.createElement('table');
    setAttributes(clientInfoTable, {
        id: 'client-info-table',
        class: 'table',
    });

    //back button
    const backButton = document.createElement('button');
    setAttributes(backButton, {
        id: 'back-button',
        class: 'button btn btn-secondary float-left btn-lg',
    });
    backButton.innerText = 'Grįžti atgal';

    //delay visit button
    const delayVisitButton = document.createElement('button');
    setAttributes(delayVisitButton, {
        id: 'delay-visit-button',
        class: 'button btn btn-primary float-right btn-lg',
    });
    delayVisitButton.innerText = 'Pavėlinti apsilankymą';

    //cancel visit button
    const cancelVisitButton = document.createElement('button');
    setAttributes(cancelVisitButton, {
        id: 'cancel-visit-button',
        class: 'button btn btn-danger float-right btn-lg',
    });
    cancelVisitButton.innerText = 'Atšaukti apsilankymą';

    clientInfoTable.appendChild(createClientInfoRow('Vardas', client.name));
    clientInfoTable.appendChild(createClientInfoRow('Kodas', client.id));
    clientInfoTable.appendChild(
        createClientInfoRow('Specialistas', client.specialist)
    );
    clientInfoTable.appendChild(createClientInfoRow('Eilėje', client.queue));
    const averageTimeToWait =
        getAverageServiceTime(client.specialist) * (client.queue - 1);
    clientInfoTable.appendChild(
        createClientInfoRow('Liko laukti', `${averageTimeToWait}min.`)
    );

    clientInfoElement.appendChild(title);
    clientInfoElement.appendChild(clientInfoTable);
    clientInfoElement.appendChild(backButton);
    clientInfoElement.appendChild(delayVisitButton);
    clientInfoElement.appendChild(cancelVisitButton);

    return clientInfoElement;
}

function createClientInfoRow(label, value) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');

    //label
    const strong = document.createElement('strong');
    strong.innerText = label;
    const labelTd = td.cloneNode();
    labelTd.setAttribute('class', 'client-info-text');
    labelTd.appendChild(strong);

    //value
    const valueTd = td.cloneNode();
    setAttributes(valueTd, {
        id: 'client-info-value',
        class: 'text-primary client-info-text',
    });
    valueTd.innerText = value;

    tr.appendChild(labelTd);
    tr.appendChild(valueTd);

    tr.setAttribute('style', 'width: 100%;');

    return tr;
}

function createClientLoginForm() {
    const clientLoginForm = document.createElement('form');
    setAttributes(clientLoginForm, {
        id: 'client-login-form',
        class: 'text-center',
    });

    //title
    const clientLoginTitle = document.createElement('h2');
    clientLoginTitle.innerHTML = 'Kliento prisijungimas';

    //client id fieldset
    const clientIdFieldset = document.createElement('fieldset');
    clientIdFieldset.setAttribute('for', 'client-id');

    const clientIdLabel = document.createElement('label');
    clientIdLabel.innerHTML = 'Kliento kodas';

    const clientIdInput = document.createElement('input');
    setAttributes(clientIdInput, {
        id: 'client-id',
        name: 'client-id',
        placeholder: 'Kodas',
        class: 'form-control',
        spellcheck: false,
        required: true,
    });
    clientIdFieldset.appendChild(clientIdLabel);
    clientIdFieldset.appendChild(clientIdInput);

    //submit button
    const submitButton = document.createElement('button');
    setAttributes(submitButton, {
        id: 'submit-button',
        type: 'submit',
        class: 'btn btn-primary',
    });
    submitButton.innerText = 'Prisijungti';

    clientLoginForm.appendChild(clientLoginTitle);
    clientLoginForm.appendChild(clientIdFieldset);
    clientLoginForm.appendChild(submitButton);
    return clientLoginForm;
}
