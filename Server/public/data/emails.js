const emails = [
    {
        id: "paypal",
        sender: "paypal@service.com",
        phishing: "true",
        subject: "Ihre Mithilfe ist erforderlich!",
        date: "19.06.2024",
        avatar: "https://pngimg.com/uploads/paypal/paypal_PNG7.png",
        logo: "https://pngimg.com/uploads/paypal/paypal_PNG7.png",
        headerColor: "linear-gradient(-120deg, #003087, #009cde, #012169)",
        buttonText: "Bestätigen",
        buttonLink: "palpay.com/login.html",
        buttonColor: "#0070ba",
        message: "<h1>Ihre Mithilfe ist erforderlich! </h1><p>Die neuen Datenschutzgesetze verpflichten uns nun dazu, in regelmäßigen Abständen die Konten unserer Kunden zu überprüfen. Dies dient ausschließlich zu Ihrer eigenen Sicherheit, da in der Vergangenheit immer mehr Vorfälle von Benutzung verschiedener Kundenkonten durch unbefugte Personen entstanden sind. </p> <p>Um daher wie gewohnt weiterhin Ihr Konto bei uns nutzen zu können, ist Ihre aktive Mitwirkung erforderlich. Dies wird vom Gesetzgeber so verlangt. </p> <p>Nachdem Sie sich über den Bestätigungsknopf angemeldet haben, werden Ihnen detailliert alle weiteren notwendigen Schritte erklärt. </p>",
        finalClause: "<p>Bei Missachtung oder Verweigerung ist ganz klar eine Schließung des Kundenkontos vorgesehen. Der Gesetzgeber fordert in so einem Fall dazu auf. </p> <p>Vielen Dank im Voraus für Ihre Mitwirkung und Ihr Verständnis! </p> <p> Mit freundlichen Grüßen <br>Ihr PayPal Kundensupport </p>",
        hint: "Hover beim nächsten Mal über den Button und achte auf die URL. Ebenfalls Vorischt beim Absender!",
    },
    {
        id: "amazon",
        sender: "no-reply@amazon.de",
        phishing: "true",
        subject: "Aktualisierung Ihres Kundenkontos",
        date: "19.06.2024",
        avatar: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        headerColor: "transparent",
        buttonText: "Jetzt Aktualisieren",
        buttonLink: "https://www.amaz0n.de/gp/css/your-account-access/",
        buttonColor: "#ff9900",
        message: "<p>Guten Tag</p> <p> Aufgrund des letzten Updates von Amazon haben wir Sie gebeten, Ihre Kontoangaben zu aktualisieren, damit Sie weiterhin einkaufen können.</p> <p>Aktualisieren Sie Ihre Informationen, um die besten Dienste mit Amazon zu erhalten.</p>",
        finalClause:"<p>Dies ist eine automatisch versendete Nachricht. Bitte antworten Sie nicht auf dieses Schreiben, da die Adresse nur zur Versendung von E-Mails eingerichtet ist.</p>",
        hint: "Hover beim nächsten Mal über den Button und achte auf die URL!"

    },
    {
        id: "Max Müller",
        sender: "max.mueller@gmail.com",
        phishing: "false",
        subject: "Weekly Meeting Reschedule",
        date: "18.06.2024",
        avatar: "https://upload.wikimedia.org/wikipedia/commons/a/af/Default_avatar_profile.jpg",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/af/Default_avatar_profile.jpg",
        headerColor: "#fff",
        buttonText: "Zum Formular",
        buttonLink: "#",
        buttonColor: "#e30613",
        message: "<p>Hey, na? <p><p> Ich hoffe, es geht dir gut!  </p><p>Ich wollte mal hören, ob wir unser Meeting, am Montag um 10:30 Uhr, vielleicht um eine halbe Stunde verschieben könnten?  </p><p>Freue mich von dir zu hören!</p>",
        finalClause:"<p>VG, <br>Max </p>",
        hint: "Kein Phising - Es gibt weder keine auffälligen Links oder Anhänge."
    },
    {
        id: "sparkasse",
        sender: "inf0@sparkasse.de",
        phishing: "true",
        subject: "Sicherheitswarnung",
        date: "17.06.2024",
        avatar: "https://ksk-limburg.sparkasseblog.de/files/2019/08/ak-psd2-icon-s-app.png",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Sparkassen-Logo.jpg",
        headerColor: "#fff",
        buttonText: "Jetzt Reaktivieren",
        buttonLink: "https://www.sparkassen.de/login-online-banking.html",
        buttonColor: "#e30613",
        message: "<p>Sehr geehrte Kundin, sehr geehrter Kunde, <p><p> Ihre 3-D Secure-Anmeldung läuft am <b>19.06.2024</b> ab, wodurch Ihr Online-Banking kurzzeitig deaktiviert wird, bis Sie sich erneut legitimieren.</p><p>Sie können die Legitimation ganz einfach online durchführen, ohne eine Filiale besuchen zu müssen.</p> <p>Der Vorgang ist unkompliziert, dauert nur wenige Minuten und kann sowohl am Computer als auch auf dem Smartphone erledigt werden.</p>",
        finalClause:"<p>Wir entschuldigen uns für die Unannehmlichkeiten.<br>Ihr Sparkassen-Team </p>",
        hint: "Achte beim nächsten mal mehr auf die E-Mail Adresse des Absenders."
    },
    {
        id: "actual paypal",
        sender: "service@paypal.com",
        phishing: "false",
        subject: "Sie haben ein neues Passwort erstellt",
        date: "16.06.2024",
        avatar: "https://pngimg.com/uploads/paypal/paypal_PNG7.png",
        logo: "https://pngimg.com/uploads/paypal/paypal_PNG7.png",
        headerColor: "linear-gradient(-120deg, #003087, #009cde, #012169)",
        buttonText: "Zum Helpcenter",
        buttonLink: "https://www.paypal.com/de/smarthelp/contact-us",
        buttonColor: "#0070ba",
        message: "<h1>Ihr Passwort wurde geändert </h1><p>Falls Sie Ihr Passwort nicht geändert haben, setzen Sie sich bitte sofort mit uns in Verbindung.</p> <p>So bleibt Ihr PayPal-Konto sicher: <ul><li>Teilen Sie Ihr Passwort oder Ihre Sicherheitsfragen niemals anderen Personen mit.</li><li>Wählen Sie Passwörter, die nicht leicht zu erraten sind und keine personenbezogenen Daten enthalten. Verwenden Sie unbedingt Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen.</li><li>Nutzen Sie unterschiedliche Passwörter für verschiedene Online-Konten.</li></ul></p>",
        finalClause: "<p>Bei Missachtung oder Verweigerung ist ganz klar eine Schließung des Kundenkontos vorgesehen. Der Gesetzgeber fordert in so einem Fall dazu auf. </p> <p>Vielen Dank im Voraus für Ihre Mitwirkung und Ihr Verständnis! </p> <p> Mit freundlichen Grüßen <br>Ihr PayPal Kundensupport </p>",
        hint: "Kein Phising - Sowohl Link als auch E-Mail Adresse sind legitim",
    },
];

module.exports = emails;

