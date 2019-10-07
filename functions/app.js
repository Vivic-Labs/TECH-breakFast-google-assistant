const { dialogflow, DateTime, Suggestions } = require("actions-on-google");

const app = dialogflow();

// Register handlers for Dialogflow intents

app.intent('Default Welcome Intent', (conv) => {
    conv.ask('Cześć, witaj w Game Bar!');
    conv.ask('W czym mogę Ci pomóc?');

    conv.ask(new Suggestions(['Sprawdź dostępność gry', 'Zarezerwuj stolik']))

});


app.intent('bookTable', (conv, parameters) => {

    const options = {
        prompts: {
            initial: 'Na kiedy chciałbyś zarezerwować stolik?',
            date: 'Którego dnia?',
            time: 'O której godzinie?'
        }
    }

    conv.ask(new DateTime(options))

});


app.intent('bookTable-dateTime', (conv, parameters, dateTime) => {

    const {day, month} = dateTime.date;
    const {hours, minutes} = dateTime.time;


    conv.data.dateTime = dateTime;


    conv.ask(`
    <speak>
    Rozumiem, stolik na 
    <say-as interpret-as="date" format="dm">${day}.${month}</say-as>
    o godzinie
    <say-as interpret-as="time" format="hms24">${hours}:${minutes || '00'}</say-as>
    </speak>
    `)

    conv.ask('A na ile osób?')

})


app.intent('bookTable-peopleCount', (conv, parameters) => {

    //check in database

    const {day, month} = conv.data.dateTime.date;
    const {hours, minutes} = conv.data.dateTime.time;

    conv.close(`
    <speak>
    Wspaniale! Podsumowując, rezerwuję dla Ciebie stolik na ${parameters.peopleCount} osób w dniu
    <say-as interpret-as="date" format="dm">${day}-${month}</say-as>
    o godzinie
    <say-as interpret-as="time" format="hms24">${hours}-${minutes || '00'}</say-as>
    </speak>
     `)

})


app.intent('gameAvailable', (conv, parameters) => {

    if (parameters.boardGame == '5 sekund') {
        conv.ask('Niestety nie posiadamy jej na stanie. Ale możesz zapytać o inną grę')
    } else {
        conv.ask(`Pewnie, posiadamy grę ${parameters.boardGame}`)
        conv.ask('Zarezerwuj stolik i wpadaj ze znajomymi!')

        conv.ask(new Suggestions('Rezerwuję stolik!'))
    }

})


module.exports = app;


