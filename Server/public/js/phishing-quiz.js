let emails;
let emailId;
let score = 0;
let recognizedPhishingScore = 0;
let missedPhishingScore = 0;
let startTime = Date.now();
let mailRemovedCount;
let timeSpent;

function getElapsedTime() {
    return Math.floor((Date.now() - startTime) / 1000); // Zeit in Sekunden
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById('score-display');
    scoreElement.innerText = `Punkte: ${score}`;
}


// Funktion für Phishing-Button
function onPhishingSelected() {
    const emailId = getCurrentEmailId();


    const email = emails.find(e => e.id === emailId);
    console.log(email);

    if (email.phishing === "true") {
        score += 10;
        recognizedPhishingScore += 1;
        showAlert("success", "Richtig erkannt! +10 Punkte");
    } else {
        score -= 5;
        missedPhishingScore += 1;
        showAlert("danger", `Leider falsch - ${email.hint} -5 Punkte`);
    }

    updateScoreDisplay();
    removeEmailFromList(emailId);
}

// Funktion für Nicht-Phishing-Button
function onNonPhishingSelected() {
    const emailId = getCurrentEmailId();
    const email = emails.find(e => e.id === emailId);

    if (email.phishing === "false") {
        showAlert("success", "Gut erkannt! Das war kein Phishing. + 1 Punkt");
        score += 1;
    } else {
        score -= 2;
        //missedPhishingScore += 1;
        showAlert("danger", `Leider falsch - ${email.hint} - 2 Punkte`);
    }

    updateScoreDisplay();
    removeEmailFromList(emailId);
}


// Funktion zur Entfernung der E-Mail nach der Bewertung
function removeEmailFromList(emailId) {
    emails.filter(email => email.id !== emailId);

    const emailElement = document.querySelector(`[data-id="${emailId}"]`);
    if (emailElement) {
        emailElement.remove();
        document.querySelector('.mailBody').innerHTML = '<h3>Wähle die nächste E-Mail aus!</h3>';
        mailRemovedCount -= 1;
        console.log(mailRemovedCount);
    }

    if (mailRemovedCount === 0) {

        timeSpent = getElapsedTime();
        document.querySelector('.mailBody').innerHTML = '<h3>Dein Posteingang ist leer</h3><p>Aber ein paar Takeaways zum Schluss:</p>' +
            '<h5 class="mb-4" style="font-family: \'Oswald\', sans-serif;">Betrügerische Mails erkennen</h5><ol><li><h6>Gefälschte Absender-Adresse</h6><p>Ist die E-Mail-Adresse des Absenders z.B. durch einen Vergleich zu verifizieren?\n' +
            'Kann der Absender den Versand der Mail persönlich/telefonisch bestätigen? </p></li>' +
            '<li><h6>Abfrage vertraulicher Daten</h6><p>Fordert die E-Mail zur Eingabe persönlicher Informationen auf?\n' +
            'Werden Geheimnummern oder Passwörter abgefragt? </p></li>' +
            '<li><h6>Vorgetäuschter dringender Handlungsbedarf</h6><p>Signalisiert die E-Mail Dringlichkeit oder Handlungsbedarf? \n' +
            'Wird eine Nachricht des Absenders erwartet? </p></li>' +
            '<li><h6>Links zu gefälschten Webseiten</h6><p>Enthält die E-Mail Verlinkungen, die auf andere Webseiten verweisen? \n' +
            'Welche Ziel-URL wird beim Mouseover angezeigt?</p></li>' +
            '<li><h6>Sprachliche Ungenauigkeiten</h6><p>Ist die Anrede unpersönlich formuliert? \n' +
            'Enthält der Text Rechtschreib- oder Zeichenfehler?</p></li></ol>' +
            '<h5 class="mb-4" style="font-family: \'Oswald\', sans-serif;">Das solltest Du tun, wenn...</h5>' +
            '<ul>' +
            '<li><h6>Du Zahlungsdaten preisgegeben hast:</h6><p>Sperre Dein Bankonto und kontrolliere Deine Umsätze regelmäßg und informiere Deine Bank. Nutze nach Entsperrung des Kontos nur neue Passwörter und PINs.</p></li>' +
            '<li><h6>Du auf einen Link geklickt hast und Geldforderung bekommst:</h6><p>Gehe nicht auf die Geldforderungen ein und wende Dich an die Polizei, Verbraucherzentrale und suche Dir ggf. Rat bei einem Rechtsbeistand.</p></li>' +
            '<li><h6>bei Verdacht auf Datendiebstahl:</h6><p>Erstatte Anzeige bei Deiner örtlichen Polizeidienststelle</p></li>' +
            '<li><h6>Du Zugangsdaten weitergegeben hast:</h6><p>Vergib ein neues Passwort. Sind Zugänge für Online-Shops, Zahlungsanbieter oder ähnliches betroffen, kontaktiere den Anbieter und überprüfe ob Zahlungsdaten betroffen waren. Nimm ggf. Kontakt mit deiner Bank auf.</p></li>' +
            '</ul>' +
            '<small class="text-muted mb-4">Quelle: <a href="https://www.bsi.bund.de/DE/Themen/Verbraucherinnen-und-Verbraucher/Cyber-Sicherheitslage/Methoden-der-Cyber-Kriminalitaet/Spam-Phishing-Co/Passwortdiebstahl-durch-Phishing/Wie-erkenne-ich-Phishing-in-E-Mails-und-auf-Webseiten/wie-erkenne-ich-phishing-in-e-mails-und-auf-webseiten_node.html">Bundesamt für Sicherheit in der Informationstechnik (BSI)</a></small>' +
            '<p><a href="/trainings" class="btn btn-dark">Training abschließen</a></p>';

        submitResults().then(() => {
            console.log('Ergebnisse wurden erfolgreich gesendet');
        }); // Alle E-Mails sind verarbeitet, sende die Ergebnisse
    }
}


// Helper-Funktion, um die aktuelle E-Mail-ID zu ermitteln
function getCurrentEmailId() {
    return emailId;
}

// Pop-up-Anzeige
function showAlert(type, message) {
    // Erstelle das Alert-Element mit einem Schließen-Button
    const alertContainer = document.createElement('div');
    alertContainer.classList.add('alert', `alert-${type}`, 'alert-dismissible', 'fade', 'show');
    alertContainer.setAttribute('role', 'alert');
    alertContainer.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" style="background-color: transparent; border: none;">
            <span aria-hidden="true">&times;</span>
        </button>
    `;

    // Füge das Alert-Element zum DOM hinzu
    document.body.appendChild(alertContainer);

    // Entferne Alert nach x Sekunden

    setTimeout(() => {
        $(alertContainer).alert('close');
    }, 5000);

}

function showHintInfo() {
    // Zeige das Modal, um den Punktverlust anzukündigen
    const hintModal = new bootstrap.Modal(document.getElementById('hintModal'));
    hintModal.show();
}

function acceptHint() {
    // Punkte um 2 reduzieren
    score -= 2;
    console.log('Neue Punktzahl:', score);

    // Tipp anzeigen und Info-Modal schließen
    // const hintModal = bootstrap.Modal.getInstance(document.getElementById('hintModal'));
    // hintModal.hide();
    //
    // const tipModal = new bootstrap.Modal(document.getElementById('tipModal'));
    // tipModal.show();

    $('#hintModal').modal('hide');
    $('#tipModal').modal('show');
}

async function submitResults() {
    // Sicherstellen, dass die Punkte nicht negativ sind
    const finalScore = Math.max(score, 0);
    const totalEmails = emails.length;  // Anzahl der E-Mails im Quiz

    const result = {
        points: finalScore,
        recognizedPhishingScore: recognizedPhishingScore,
        missedPhishingScore: missedPhishingScore,
        timeSpent: timeSpent,
        totalEmails: totalEmails
    };

    try {
        const response = await fetch('/submit-phishing-quiz-results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(result)
        });

        const data = await response.json();
        if (data.success) {
            console.log('Punkte und Fortschritt erfolgreich gespeichert');
        } else {
            console.error('Fehler beim Speichern der Ergebnisse', data.message);
        }
    } catch (error) {
        console.error('Fehler beim Senden der Ergebnisse:', error);
    }
}


document.addEventListener('DOMContentLoaded', function () {
    emails = JSON.parse(window.globalData.emails);
    mailRemovedCount = emails.length;

    updateScoreDisplay();

    document.querySelectorAll('.list-group-item').forEach(item => {
        item.addEventListener('click', function () {
            emailId = this.getAttribute('data-id');
            const email = emails.find(e => e.id === emailId);

            if (email) {
                document.querySelector('.mailBody').innerHTML = `
                    <div class="quiz-container-header">
                        <div class="quiz-btn d-flex gap-2 justify-content-end ms-auto">
                            <button type="button" class="btn btn-info" onclick="showHintInfo()">Hinweis</button>
                            <button type="button" class="btn btn-success" onclick="onNonPhishingSelected()">Kein Phishing</button>
                            <button type="button" class="btn btn-danger" onclick="onPhishingSelected()">Phishing</button>
                        </div>
                        <div class="mail-header p-4">
                            <div class="subject">
                                <span>${email.subject}</span>
                            </div>
                            <div class="mail-info d-flex">
                                <img src="${email.avatar}" class="img-fluid">
                                <div class="detail-block">
                                    <div class="From">${email.sender} &lt;${email.sender}&gt;</div>
                                    <div class="Date-Time">${email.date}</div>
                                    <div class="receivers">${window.globalData.userEmail}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="header ${email.id}-style" style="background: ${email.headerColor};">
                        <img src="${email.logo}" alt="Logo" class="img-fluid">
                    </div>
                    <div class="mail-content ${email.id}-style p-4">
                        ${email.message}
                        <a href="${email.buttonLink}" class="btn btn-primary mb-4 isDisabled" style="background-color: ${email.buttonColor}; border-color: ${email.buttonColor};">${email.buttonText}</a>
                        ${email.finalClause}
                    </div>
                `;
            }
        });
    });


});

