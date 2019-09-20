import 'bootstrap/dist/css/bootstrap.css';
import getRegistrationForm from './registrationForm';
import clientsData from '../clients.json';
import {
    ready,
    setDataToLocalStorage,
    setClient,
    getLastInQueue
} from '../utils';
import { status } from '../constants';

ready(() => {
    const setDataButton = document.getElementById('set-data-button');
    setDataButton.addEventListener('click', handleSetDataButton);
    document
        .getElementById('root')
        .appendChild(getRegistrationForm(handleFormSubmit));
});

function handleSetDataButton() {
    setDataToLocalStorage({ index: 'clients', data: clientsData });
}

function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const clientsName = form.elements['name'].value;
    const chosenSpecialist = form.elements['specialist'].value;

    setNewClient({ clientsName, chosenSpecialist });
}

function setNewClient({ clientsName, chosenSpecialist }) {
    const newClient = createNewClient({ clientsName, chosenSpecialist });
    setClient(newClient);
}

function createNewClient({ clientsName, chosenSpecialist }) {
    const newClientID = generateUniqueId();
    const newClient = {
            id: newClientID,
            name: clientsName,
            specialist: chosenSpecialist,
            status: status.waiting,
            queue: getLastInQueue(chosenSpecialist) + 1
    };
    return newClient;
}

function generateUniqueId() {
    return Date.now();
}
