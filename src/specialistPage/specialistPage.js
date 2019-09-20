import 'bootstrap/dist/css/bootstrap.css';
import {
    ready,
    getFirstInLineClients,
    getClient,
    setClient,
    getDataFromLocalStorage,
    setDataToLocalStorage
} from '../utils';
import { status } from '../constants';

const NO_CLIENT_MESSAGE = 'Eilėje nėra klientų';

ready(() => {
    const specialistForm = document.getElementById('specialist-form');
    specialistForm.addEventListener('submit', handleSpecialistFormSubmit);

    const specialistSelect = document.getElementById('specialist');
    specialistSelect.addEventListener('change', handleSpecialistSelection);
});

function handleSpecialistFormSubmit(event) {
    event.preventDefault();
    const currentClientId = document.getElementById('client-id').innerText;
    const specialist = event.target.elements['specialist'].value;

    if (currentClientId === NO_CLIENT_MESSAGE) {
        return;
    }

    moveQueue(specialist);
    const client = getClient(currentClientId);

    if (client) {
        client.status = status.serviced;
        console.log('setClient', client);
        setClient(client);
    }

    updateCurrentClientsId(specialist);
}

function handleSpecialistSelection(event) {
    const specialist = event.target.value;
    updateCurrentClientsId(specialist);
}

function updateCurrentClientsId(specialist) {
    const clientIdElement = document.getElementById('client-id');
    const firstInLineClient = getFirstInLineClients({
        specialist,
        clientsAmount: 1,
    })[0];

    if (firstInLineClient) {
        clientIdElement.innerText = firstInLineClient.id;
        enableSubmitButton();
    } else {
        clientIdElement.innerText = NO_CLIENT_MESSAGE;
        disableSubmitButton();
    }
}

function moveQueue(specialist){
    const clients = getDataFromLocalStorage('clients');

    clients.map((client) => {
        if(client.specialist === specialist && client.status === status.waiting){
            client.queue--;
        }
    });

    setDataToLocalStorage({index: 'clients', data: clients});
}

function disableSubmitButton() {
    document.getElementById('submit-button').disabled = true;
}

function enableSubmitButton() {
    document.getElementById('submit-button').disabled = false;
}
