import 'bootstrap/dist/css/bootstrap.css';
import {
    ready,
    loadOptionsToSelect,
    getClientsInQueue,
    getClient,
    setClients,
    getDataFromLocalStorage,
    setDataToLocalStorage,
} from './utils';
import { status, specialists } from './constants';

const NO_CLIENT_MESSAGE = 'Eilėje nėra klientų';

ready(() => {
    const specialistSelect = document.getElementById('specialist');
    loadOptionsToSelect(specialistSelect, specialists);
    specialistSelect.addEventListener('change', handleSpecialistSelection);

    const specialistForm = document.getElementById('specialist-form');
    specialistForm.addEventListener('submit', handleSpecialistFormSubmit);
});

function handleSpecialistFormSubmit(event) {
    event.preventDefault();
    const currentClientId = document.getElementById('client-id').innerText;
    const specialist = this.elements['specialist'].value;

    if (currentClientId === NO_CLIENT_MESSAGE) {
        return;
    }

    moveClientsQueue(specialist);

    const client = getClient(currentClientId) || {};
    if (client.status === status.waiting) {
        client.status = status.serviced;
        client.serviceEnd = new Date();
        setClients([client]);
    }

    updateCurrentClientsId(specialist);
}

function handleSpecialistSelection(event) {
    const specialist = event.target.value;
    updateCurrentClientsId(specialist);
}

function updateCurrentClientsId(specialist) {
    const clientIdElement = document.getElementById('client-id');
    const firstClientInQueue = getClientsInQueue(specialist)[0];

    if (firstClientInQueue) {
        firstClientInQueue.serviceStart = new Date();
        setClients([firstClientInQueue]);

        clientIdElement.innerText = firstClientInQueue.id;
        enableSubmitButton();
    } else {
        clientIdElement.innerText = NO_CLIENT_MESSAGE;
        disableSubmitButton();
    }
}

function moveClientsQueue(specialist) {
    const clients = getDataFromLocalStorage('clients');

    clients.map(client => {
        if (
            client.specialist === specialist &&
            client.status === status.waiting
        ) {
            client.queue--;
        }
    });

    setDataToLocalStorage({ index: 'clients', data: clients });
}

function disableSubmitButton() {
    document.getElementById('submit-button').disabled = true;
}

function enableSubmitButton() {
    document.getElementById('submit-button').disabled = false;
}
