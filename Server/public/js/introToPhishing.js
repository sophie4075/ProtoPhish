let questions;
let currentQuestion = 0;
let totalPoints = 0;
let achievements;
let startTime = Date.now();
let phishingRecognized = 0;
let phishingMissed = 0;
let currentSectionIndex = 0;
let currentBlitzQuestion = 0; // Für Blitz-Quiz
const blitzQuizInterval = 5;  // Blitz-Quiz nach jedem vierten Abschnitt
let blitzQuizQuestions = [];
let currentSection;
let nextSection;
const sections = document.querySelectorAll('.section');
const modal = new bootstrap.Modal(document.getElementById('blitzQuizModal'), {
    backdrop: 'static',
    keyboard: false
});


function getElapsedTime() {
    return Math.floor((Date.now() - startTime) / 1000); // Zeit in Sekunden
}

/* Aleeeerts*/
function showAlert(type, message) {
    // Erstelle das Alert-Element mit einem Schließen-Button
    const alertContainer = document.createElement('div');
    alertContainer.classList.add('alert', `alert-${type}`, 'alert-dismissible', 'fade', 'show');
    alertContainer.setAttribute('role', 'alert');
    alertContainer.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" style="background-color: transparent; border: none">
            <span aria-hidden="true">x</span>
        </button>
    `;

    // Füge das Alert-Element zum DOM hinzu
    document.body.appendChild(alertContainer);



    setTimeout(() => {
        $(alertContainer).alert('close');
        }, 5000);
}
/*_____________QUIZZZZZZ___________*/



function showBlitzQuiz() {


    blitzQuizQuestions = getQuestionsForBlitzQuiz(); // Hol die Fragen für den aktuellen Blitz-Quiz-Intervall
    currentBlitzQuestion = 0;

    startTimer();

    // Zeige die erste Blitz-Quiz-Frage
    showBlitzQuestion();
    document.getElementById('close-quiz-modal').disabled = true;

    modal.show();
}

function showBlitzQuestion() {
    const quizContainer = document.getElementById('blitz-quiz-questions-container');
    quizContainer.innerHTML = ''; // Leere den Container für die neue Frage

    // Verwende `currentBlitzQuestion`, um die aktuelle Frage zu ermitteln
   /* const question = questions[currentBlitzQuestion];
    const questionHTML = createQuestionHTML(question, currentBlitzQuestion);
    quizContainer.appendChild(questionHTML);*/

    const questionsForBlitz = getQuestionsForBlitzQuiz();

    // Prüfen, ob noch Fragen übrig sind
    if (currentBlitzQuestion < questionsForBlitz.length) {
        const question = questionsForBlitz[currentBlitzQuestion];
        const questionHTML = createQuestionHTML(question, currentBlitzQuestion);
        quizContainer.appendChild(questionHTML);
    }
}

function getQuestionsForBlitzQuiz() {

    // Hole alle Fragen bis zur aktuellen Sektion und ignoriere leere Sektionen
    // Gib die gesammelten Fragen zurück
    //return questions.slice(0, currentSectionIndex-1).filter(Boolean)

    const startIndex = Math.max(0, currentSectionIndex - blitzQuizInterval);
    const endIndex = currentSectionIndex - 1 ;

    console.log(`Start Index: ${startIndex}, End Index: ${endIndex}`);
    const filteredQuestions = questions.slice(startIndex, endIndex);

    console.log('Gefilterte Fragen:', filteredQuestions);
    return filteredQuestions;

}

function createQuestionHTML(question, idx) {
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('mb-4');

    const questionLabel = document.createElement('label');
    questionLabel.innerText = `Frage ${idx + 1}: ${question.question}`;
    questionDiv.appendChild(questionLabel);

    question.choices.forEach((choice, choiceIdx) => {
        const choiceDiv = document.createElement('div');
        choiceDiv.classList.add('form-check');

        // Ändere input type von 'radio' zu 'checkbox'
        const input = document.createElement('input');
        input.type = 'checkbox';  // Multiple-Choice durch Checkboxen
        input.name = `question-${idx}`;
        input.id = `choice-${idx}-${choiceIdx}`;
        input.value = choiceIdx.toString();
        input.classList.add('form-check-input');

        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.classList.add('form-check-label');
        label.innerText = choice;

        choiceDiv.appendChild(input);
        choiceDiv.appendChild(label);
        questionDiv.appendChild(choiceDiv);
    });

    // Feedback-Bereich für die Frage
    const feedbackDiv = document.createElement('div');
    feedbackDiv.classList.add('feedback');
    questionDiv.appendChild(feedbackDiv);

    // Button zum Überprüfen der Antwort
    const checkAnswerButton = document.createElement('button');
    checkAnswerButton.classList.add('btn', 'btn-primary', 'mt-3');
    checkAnswerButton.innerText = 'Antwort überprüfen';
    checkAnswerButton.addEventListener('click', () => checkBlitzAnswer(question, feedbackDiv));
    questionDiv.appendChild(checkAnswerButton);

    return questionDiv;
}

/*function checkBlitzAnswer(question, feedbackDiv) {
    const selectedOptions = document.querySelectorAll(`input[name="question-${currentBlitzQuestion}"]:checked`);

    if (selectedOptions.length === 0) {
        feedbackDiv.textContent = 'Bitte wähle mindestens eine Antwort aus.';
        return;
    }

    // Array der ausgewählten Antworten erstellen

    const selectedAnswers = Array.from(selectedOptions).map(option => parseInt(option.value, 10));
    let pointsForQuestion = 0;
    let feedbackMessage = '';

    const allCorrect = selectedAnswers.every(idx => question.correct.includes(idx)) &&
        question.correct.length === selectedAnswers.length;

    if (allCorrect) {
        pointsForQuestion += question.points;
        feedbackMessage = `Richtig! ${question.reward}. +${pointsForQuestion} Punkte`;
        feedbackDiv.classList.add('text-success');
        //showAlert("success", feedbackMessage); // Bootstrap Alert
    } else {
        pointsForQuestion -= 2;
        feedbackMessage = `Falsch. ${question.hint}. Du verlierst ${pointsForQuestion} Punkte`;
        feedbackDiv.classList.add('text-danger');
       // showAlert("danger", feedbackMessage); // Bootstrap Alert
    }

    totalPoints += pointsForQuestion;
    feedbackDiv.textContent = feedbackMessage; // Zeige das Feedback unter der Frage an

    // Wenn es noch weitere Fragen gibt, springe zur nächsten
    currentBlitzQuestion++;
    if (currentBlitzQuestion < blitzQuizQuestions.length) {
        setTimeout(showBlitzQuestion, 2000); // Zeige nach 2 Sekunden die nächste Frage
    }else {
        modal.hide();

        if (currentSectionIndex >= questions.length) {
            //
            console.log('Check results at Section Index', currentSectionIndex);
            evaluateAchievements();
            //scrollToNextSection();
        }

        nextSection.scrollIntoView({ behavior: 'smooth' });
    }


}*/



function checkBlitzAnswer(question, feedbackDiv) {
    const selectedOptions = document.querySelectorAll(`input[name="question-${currentBlitzQuestion}"]:checked`);

    if (selectedOptions.length === 0) {
        feedbackDiv.textContent = 'Bitte wähle mindestens eine Antwort aus.';
        return;
    }

    // Array der ausgewählten Antworten erstellen
    const selectedAnswers = Array.from(selectedOptions).map(option => parseInt(option.value, 10));
    let pointsForQuestion = 0;
    let allCorrect = true;

    // Überprüfe jede ausgewählte Antwort und addiere/ziehe Punkte ab
    selectedAnswers.forEach(idx => {
        if (question.correct.includes(idx)) {
            pointsForQuestion += question.points;  // Punkte für richtige Antwort
        } else {
            pointsForQuestion -= 2;  // Punktabzug für falsche Antwort
            allCorrect = false;
        }
    });

    // Überprüfe, ob alle korrekten Antworten ausgewählt wurden
    const unselectedCorrectAnswers = question.correct.filter(idx => !selectedAnswers.includes(idx));
    if (unselectedCorrectAnswers.length === 0 && allCorrect) {
        totalPoints += pointsForQuestion;
        feedbackDiv.textContent = `Richtig! ${question.reward}. +${pointsForQuestion} Punkte`;
        feedbackDiv.classList.add('text-success');
        achievements.correctAnswers++;
        achievements.correctQuestions.push(question.questionId);
    } else {
        totalPoints += pointsForQuestion;
        if (pointsForQuestion > 0) {
            feedbackDiv.textContent = `Fast. ${question.hint}! +${pointsForQuestion} Punkte`;
            feedbackDiv.classList.add('text-warning');
        } else {
            feedbackDiv.textContent = `Falsch. ${question.hint}. -${pointsForQuestion} Punkte`;
            feedbackDiv.classList.add('text-danger');
        }
        achievements.wrongAnswers++;
    }

    // Springe zur nächsten Frage oder beende das Quiz
    currentBlitzQuestion++;
    if (currentBlitzQuestion < blitzQuizQuestions.length) {
        setTimeout(showBlitzQuestion, 2000); // Zeige nach 2 Sekunden die nächste Frage
    } else {
        stopTimer();
        modal.hide();

        if (currentSectionIndex >= questions.length) {
            //
            console.log('Check results at Section Index', currentSectionIndex);
            evaluateAchievements();
            //scrollToNextSection();
        }

        nextSection.scrollIntoView({ behavior: 'smooth' });
    }
}




function scrollToNextSection() {
    // const currentSection = document.querySelector('.section.visible')
    // currentSection.classList.remove('visible');
    // const nextSection = currentSection.nextElementSibling;
    // nextSection.classList.add('visible');
    //
    // console.log(nextSection);
    //
    // if (nextSection) {
    //     nextSection.scrollIntoView({ behavior: 'smooth' });
    // }
    currentSection = sections[currentSectionIndex];
    currentSection.classList.remove('visible');
    currentSectionIndex++;
    nextSection = sections[currentSectionIndex];
    nextSection.classList.add('visible');

    // Zeige Blitz-Quiz nach jeder vierten Sektion
    if (currentSectionIndex % blitzQuizInterval === 0) {
        showBlitzQuiz();
    } else {
        nextSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function checkAnswer(buttonElement) {
    const currentSection = buttonElement.closest('.quiz-container');
    const feedback = currentSection.querySelector('.feedback');
    const checkboxes = currentSection.querySelectorAll('.choice-checkbox');
    const question = questions[currentQuestion];

    let selected = [];
    checkboxes.forEach((checkbox, idx) => {
        if (checkbox.checked) {
            selected.push(idx);
        }
    });

    let pointsForQuestion = 0;
    let allCorrect = true;

    selected.forEach((idx) => {
        if (question.correct.includes(idx)) {
            pointsForQuestion += question.points;  // Punkte für richtige Antwort
        } else {
            pointsForQuestion -= 2;  // Punktabzug für falsche Antwort
            allCorrect = false;
        }
    });

    const unselectedCorrectAnswers = question.correct.filter(idx => !selected.includes(idx));
    if (unselectedCorrectAnswers.length === 0 && allCorrect) {
        totalPoints += pointsForQuestion;
        /*feedback.textContent = `Richtig! ${question.reward}`;*/
        showAlert("success", `Richtig! ${question.reward}. +${pointsForQuestion} Punkte`);
        achievements.correctAnswers++;
        achievements.correctQuestions.push(question.questionId);
    } else {
        totalPoints += pointsForQuestion;
        if(pointsForQuestion > 0){
            showAlert("success", `Fast. ${question.hint}! +${pointsForQuestion} Punkte`);
        } else {
            showAlert("danger", `${question.hint}.  -${pointsForQuestion} Punkte`);
        }
        /*feedback.textContent = `${question.hint}`;*/
        achievements.wrongAnswers++;
    }

    currentQuestion++;



    setTimeout(() => {
        if (currentQuestion < questions.length) {
            showQuestion();
            scrollToNextSection();
        } else {
            scrollToNextSection();
            evaluateAchievements();
        }
    }, 5000);
}
/*------------TIMER------------------*/

let timerInterval;
let timerSeconds = 0;

function startTimer() {
    timerSeconds = 0; // Setze den Timer auf 0 zurück
    updateTimerDisplay(); // Starte mit 00:00

    timerInterval = setInterval(() => {
        timerSeconds++;
        updateTimerDisplay();
    }, 1000); // Jede Sekunde erhöhen
}

function stopTimer() {
    clearInterval(timerInterval); // Timer stoppen
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    document.getElementById('quiz-timer').innerText = `${formattedMinutes}:${formattedSeconds}`;
}
/*--------------------------------*/
function submitResults(points, recognizedScore, missedScore, badges, timeSpent) {
    fetch('/submit-intro-results', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            points: points,
            recognizedPhishingScore: recognizedScore,
            missedPhishingScore: missedScore,
            badges: badges,
            timeSpent: timeSpent
        })
    }).then(response => response.json())
        .then(data => {
            console.log('Results submitted:', data);
        });
}

function evaluateAchievements() {
    const quizContainer = document.getElementById('intro-quiz-results');
    let resultText = `<p>Du hast ${achievements.correctAnswers} von ${achievements.totalQuestions - 1} richtig beantwortet.</p>`;
    let earnedBadges = [];
    let timeSpent = getElapsedTime();

    if (achievements.correctAnswers === achievements.totalQuestions -1 ) {
        earnedBadges.push('Kluger Phishkopf');
    }

    if (totalPoints < 0) {
        earnedBadges.push('Das war wohl nichts!');
    }

    if (achievements.correctAnswers === achievements.totalQuestions - 1) {
        resultText += `<p>Super! Du hast alle Fragen richtig beantwortet</p>`;
    } else if (achievements.correctAnswers >= ((achievements.totalQuestions -1) / 2)) {
        resultText += `<p>Gut gemacht! Du hast die Mehrheit der Fragen richtig beantwortet.</p>`;
    } else {
        resultText += `<p>Du könntest etwas mehr Aufmerksamkeit auf das Thema Phishing legen.</p>`;
    }

    quizContainer.innerHTML = resultText;
    submitResults(totalPoints, phishingRecognized, phishingMissed, earnedBadges, timeSpent);

}
function showQuestion() {
    const questionTextElements = document.querySelectorAll('.question-text');
    const choicesContainers = document.querySelectorAll('.choices');

    questionTextElements[currentQuestion].textContent = questions[currentQuestion].question;

    const labels = choicesContainers[currentQuestion].querySelectorAll('.choice-label');
    const checkboxes = choicesContainers[currentQuestion].querySelectorAll('.choice-checkbox');
    labels.forEach((label, idx) => {
        label.textContent = questions[currentQuestion].choices[idx];
        checkboxes[idx].checked = false;  // Checkboxen zurücksetzen
    });

    const feedbackElements = document.querySelectorAll('.feedback');
    feedbackElements[currentQuestion].textContent = "";
}

document.addEventListener("DOMContentLoaded", function () {
    console.log('I am coming from the actual script' , window.globalData.questions);

    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('main-content');
    const video = document.getElementById("myVideo");
    const videoContainer= document.getElementById("video-container");
    const dialogueBox = document.getElementById("dialogue-box");
    const dialogueText = document.getElementById("dialogue-text");
    const choices = document.getElementById("choices");
    const quiz = document.getElementById("intro-quiz");
    questions = window.globalData.questions;
    achievements = {
        correctAnswers: 0,
        wrongAnswers: 0,
        totalQuestions: questions.length,
        correctQuestions: []
    };

    let phishingSpotted = '';
    let points = 0;
    let i = 0;
    let currentText = "";



    // Start the circle wipe effect and then reveal the main content
    setTimeout(() => {
        introScreen.classList.add('hidden');
        setTimeout(() => {
            introScreen.style.display = 'none';
            mainContent.style.display = 'block';
            showIntroText()  // Your main content logic goes here
        }, 1500);  // Duration of the animation
    }, 2000);  // How long the title stays before the animation starts




    const texts = new Map([
        ['intro', "Stell dir vor, du erhältst eine E-Mail von PayPal. Du wirst aufgefordert, dich bei deinem Konto anzumelden und deine Daten zu aktualisieren – es gibt sogar einen praktischen Link, der dich direkt zum Login führt! Was machst du?"],
        ['deleteSuccess', "Gut erkannt, die E-Mail sieht definitiv etwas sketchy aus. Falls du dir in solchen Fällen unsicher bist, logge dich direkt bei der Website ein. Lass uns trotzdem schauen, was passiert, wenn du dem Link folgen würdest."],
        ['loginPrompt', "Hmmm... Was willst du tun?"],
        ['closeWindowSuccess', "Sicher ist sicher! Logge dich immer direkt über die dir bekannte Website ein und achte besonders auf die URL. Aber mal angenommen, du loggst dich ein...Lass uns sehen was passiert"],
        ['00', "Whoops... so wie es scheint war die E-Mail gar nicht von PayPal...? Sondern von einem Betrüger, der eine täuschend echte Website eingerichtet hat, die genauso aussieht wie die von PayPal. Wenn du also auf den Link in der Mail klickst und deine Anmeldedaten eingibst, übermittelst du sie ihm. Damit bekommt er Zugriff auf deine persönlichen Daten. Ein kleiner Tipp für das nächste Mal - achte besonders auf den Absender der Mail und prüfe die URL genau. Die meisten Phishing-Versuche verraten sich durch kleine Details – falsche Domainnamen, ungewöhnliche Zeichen oder unpersönliche Anreden. Bleib wachsam, dann haben Betrüger keine Chance!"],
        ['11', "Wie du bereits gut erkannt hast, war das offensichtlich eine Phishing Mail! Behalte falsche Domainnamen, ungewöhnliche Zeichen oder unpersönliche Anreden weiterhin im Auge! Gut gemacht"],
        ['01', "Das war wohl Phishing... Gut gemacht, du hast die Mail zwar nicht sofort gelöscht, aber immerhin hast du den Login vermieden. Das ist schon mal ein Schritt in die richtige Richtung! Nächstes Mal, wenn dir etwas nicht ganz koscher vorkommt, achte besonders auf den Absender der Mail und prüfe die URL genau. Die meisten Phishing-Versuche verraten sich durch kleine Details – falsche Domainnamen, ungewöhnliche Zeichen oder unpersönliche Anreden. Bleib wachsam, dann haben Betrüger keine Chance!"],
        ['10', "Okay, also du wolltest die Mail eigentlich löschen? Aber dann dachtest du dir, warum nicht den Betrügern auch noch das Passwort auf dem Silbertablett servieren? Nächstes Mal machst du es hoffentlich besser und entscheidest dich wirklich für 'Löschen' – und nicht nur 'löschen… aber zuerst mein Passwort da lassen'. Ein kleiner Tipp fürs nächste Mal: Wenn dir was komisch vorkommt, schliße den Tab welcher sich durch den Link geöffnet hat. Gehe direkt auf die echte Seite und schau dort nach, ob Aktualisierungen erforderlich sind!"],
        ['default', "Etwas ist schiefgelaufen :("]
    ]);


    function scrollDialogue(nextKey, options = []) {
        anime({
            targets: '#dialogue-box',
            translateY: '-100vh',
            easing: 'easeInOutQuad',
            duration: 1000,
            complete: function () {
                // Nach dem Scrollen Dialog zurücksetzen und neuen Text anzeigen
                dialogueText.innerHTML = '';
                choices.innerHTML = '';
                resetScroll(() => showDialogue(nextKey, options));
            }
        });
    }

    function resetScroll(callback) {
        // Setzt die Position zurück, damit sie wieder von oben kommen kann

        anime({
            targets: '#dialogue-box',
            translateY: '0%',
            duration: 1000, // Sofortige Rücksetzung
            complete: callback // Führt den Callback aus, sobald das Zurücksetzen abgeschlossen ist
        });
    }

    function showChoices(options) {
        choices.innerHTML = '';  // Clear previous buttons
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.addEventListener('click', option.action);
            choices.appendChild(button);
        });
    }

    function typeWriter(callback) {


        if (i < currentText.length) {
            dialogueText.innerHTML += currentText.charAt(i);
            i++;
            setTimeout(() => typeWriter(callback), 20);
        } else if (callback) {
            // Callback für Buttons
            callback();
        }
    }


    function showDialogue(key, options) {
        i = 0;
        // Getting map text
        currentText = texts.get(key);
        dialogueText.innerHTML = '';
        // Remove Buttons
        choices.innerHTML = '';
        dialogueBox.style.display = "flex";  // Dialogbox anzeigen

        // Typwriter-Effekt ausführen und dann Optionen anzeigen
        typeWriter(() => {
            choices.innerHTML = '';
            options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option.text;
                button.addEventListener('click', option.action);
                choices.appendChild(button);
            });
        });
    }

    function showFinalMessage(key, options) {
        i = 0;
        currentText = texts.get(key);
        dialogueText.innerHTML = '';
        choices.innerHTML = '';
        dialogueBox.style.display = "block";

        // Typwriter without Buttons
        typeWriter();
    }

    video.addEventListener('timeupdate', function () {


        if (video.currentTime >= 5 && video.currentTime < 6) {
            video.pause();
            choices.style.display = "flex";
            showChoices([
                { text: "Mail Löschen", action: handleDeleteOption },
                { text: "Mal ansehen", action: continueAfterMail }
            ]);
        }

        if (video.currentTime >= 7 && video.currentTime < 8){
            video.pause();
            scrollDialogue('loginPrompt', [
                {text: "Login", action: handleLoginOption},
                {text: "Tab schließen", action: handleCloseWindowOption}
            ]);
        }
    });



    function handleLoginOption() {
        //scrollDialogue();
        dialogueBox.style.display = "none";
        console.log("Spotted so far:", phishingSpotted);
        if (phishingSpotted !== '11' && phishingSpotted !== '01') {
            //scrollDialogue();
            phishingSpotted += '0';
            phishingMissed += 1;
        } else {
            //scrollDialogue();
        }
        video.currentTime = 8;
        video.play();
    }

    function handleDeleteOption() {

        points += 5;
        phishingSpotted += '1';
        phishingRecognized += 1;
        //showDialogue('deleteSuccess', [{ text: "Weiter", action: continueAfterMail }]);
        scrollDialogue('deleteSuccess', [{text: "Weiter", action: continueAfterMail}])
    }


    function continueAfterMail() {

        dialogueBox.style.display = "none";
        if (phishingSpotted === '') {
            //scrollDialogue();
            phishingSpotted += '0';
            phishingMissed += 1;
        } else {
            //scrollDialogue();
        }
        video.currentTime = 6; // Skip to the next part of the video
        video.play();
    }


    function handleCloseWindowOption() {
        scrollDialogue('closeWindowSuccess', [{text: "Weiter", action: handleLoginOption}]);
        points += 5;
        phishingSpotted += '1';
        phishingRecognized += 1;
        //showDialogue('closeWindowSuccess', [{ text: "Weiter", action: handleLoginOption }]);

    }

    function stylingToggle() {
        mainContent.style.display = "none";
        mainContent.classList.toggle("d-flex");
        quiz.style.display = "block";
    }

    video.addEventListener('ended', function () {
        videoContainer.style.display = 'none';
        console.log(phishingSpotted);
        let finalMessageKey = phishingSpotted;
        if (!texts.has(finalMessageKey)) {
            // Fallback in case key cannot be found
            finalMessageKey = 'default';
        }
        //showFinalMessage(finalMessageKey, [{ text: "Weiter", action: stylingToggle }]);
        showDialogue(finalMessageKey, [{ text: "Weiter", action: stylingToggle }])
    });

    function showIntroText() {
        currentText = texts.get('intro');
        typeWriter(() => {
            // After typewriter is done, show the video
            videoContainer.style.display = "flex";
            video.play();
        });
    }


    //showQuestion();
});




