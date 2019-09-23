import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    ready,
    loadOptionsToSelect,
    setDataToLocalStorage,
    getDataFromLocalStorage,
    setClients,
} from './utils';
import { createFormSubmitAlert } from './sharedElements';
import { status, specialists, alertStatus } from './constants';

ready(() => {
    const setDataButton = document.getElementById('set-data-button');
    setDataButton.addEventListener('click', handleSetDataButton);

    const specialistSelect = document.getElementById('specialist');
    loadOptionsToSelect(specialistSelect, specialists);

    const registrationForm = document.getElementById('registration-form');
    registrationForm.addEventListener('submit', handleFormSubmit);

    setFocusOnClientNameInput();
    setCustomValidationMessage(
        'client-name',
        'Varde turi buti pirma dižioji ir kitos mažosios raidės'
    );
    setCustomValidationMessage('specialist', 'Pasirinkite vieną specialistą');
});

function handleSetDataButton() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/clients.json`, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                setDataToLocalStorage({ index: 'clients', data });
            } else if (xhr.status === 404) {
                console.error('Nepavyko nuskaityti lankytojų duomenų');
            }
        }
    };
    xhr.send();
}

function handleFormSubmit(event) {
    event.preventDefault();

    const clientName = this.elements['client-name'].value;
    const chosenSpecialist = this.elements['specialist'].value;

    const newClientId = setNewClient({ clientName, chosenSpecialist });
    showAlert(alertStatus.success, newClientId);

    setFocusOnClientNameInput();
    this.reset();
}

function setNewClient({ clientName, chosenSpecialist }) {
    const newClient = createNewClient({ clientName, chosenSpecialist });
    setClients([newClient]);
    return newClient.id;
}

function createNewClient({ clientName, chosenSpecialist }) {
    const clients = getDataFromLocalStorage('clients');
    const newClient = {
        id: generateRandomClientId(clients),
        name: clientName,
        specialist: chosenSpecialist,
        status: status.waiting,
        queue: getLastInQueue({ clients, chosenSpecialist }) + 1,
    };
    return newClient;
}

function getLastInQueue({ clients, chosenSpecialist }) {
    let lastQueue = 0;
    clients.forEach(client => {
        if (
            client.specialist === chosenSpecialist &&
            client.queue > lastQueue &&
            client.status === status.waiting
        ) {
            lastQueue = client.queue;
        }
    });
    return lastQueue;
}

function showAlert(status, clientId) {
    const outerWrapper = document.getElementById('root');
    const alert = createFormSubmitAlert(status, {
        successMessage: {
            heading: 'Užregistruota sėkmingai',
            paragraph: `Užregistruoto kliento kodas: <strong>${clientId}</strong>`,
        },
        failMessage: {
            heading: 'Registracija nepavyko!',
            paragraph: '',
        },
    });

    outerWrapper.appendChild(alert);
}

function setFocusOnClientNameInput() {
    document.getElementById('client-name').focus();
}

function setCustomValidationMessage(elementId, message) {
    const element = document.getElementById(elementId);

    element.oninvalid = function() {
        return this.setCustomValidity(message);
    };
    element.oninput = function() {
        return this.setCustomValidity('');
    };
}

function generateRandomClientId(clients) {
    const randomClientId = Math.random()
        .toString(36)
        .substr(2, 9);
    const isIdTaken = clients.some(client => client.id === randomClientId);

    if (!isIdTaken) {
        return randomClientId;
    }
    return generateRandomClientId(clients);
}
