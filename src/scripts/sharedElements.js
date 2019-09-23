import { alertStatus } from './constants';
import { setAttributes } from './utils';

export function createFormSubmitAlert(status, { successMessage, failMessage }) {
    if (document.getElementsByClassName('form-alert')[0]) {
        dismissAlert();
    }

    //alert
    const alert = document.createElement('div');
    setAttributes(alert, {
        class: 'form-alert alert alert-dismissible fade show',
        role: 'alert',
    });
    //alert heading
    const alertHeading = document.createElement('h4');
    alertHeading.setAttribute('class', 'alert-heading');

    //parahraph
    const alertParagraph = document.createElement('p');

    //dismiss button
    const dismissButton = document.createElement('button');
    setAttributes(dismissButton, {
        type: 'button',
        class: 'close alert-dismiss-button',
        style: 'outline:none',
    });
    dismissButton.innerHTML = '&times';
    dismissButton.addEventListener('click', dismissAlert);

    if (status === alertStatus.success) {
        alertHeading.innerText = successMessage.heading;
        alertParagraph.innerHTML = successMessage.paragraph;
        alert.classList.add('alert-success');
    } else {
        alertHeading.innerText = failMessage.heading;
        alertParagraph.innerHTML = failMessage.paragraph;
        alert.classList.add('alert-danger');
    }
    alert.appendChild(alertHeading);
    alert.appendChild(alertParagraph);
    alert.appendChild(dismissButton);
    return alert;
}

function dismissAlert() {
    const alert = document.getElementsByClassName('form-alert')[0];
    alert.parentNode.removeChild(alert);
}
