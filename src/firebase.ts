import admin from 'firebase-admin';
import { Quote } from './discord';

const saveQuotesToDatabase = async (quotes: Array<Quote>): Promise<number> => {
    const db = admin.database();
    const quotesRef = db.ref('/quotes');
    await quotesRef.set(null);
    const totalNumberUploaded = await upload(quotes);
    await saveTotalQuoteAmount(totalNumberUploaded);
    return totalNumberUploaded;
}

const upload = async (quotes: Array<Quote>): Promise<number> => {
    const db = admin.database();
    const quotesRef = db.ref('/quotes');
    quotes.forEach(q => quotesRef.push(q));
    const allQuotes = await quotesRef.once('value');
    return Object.keys(allQuotes.val() || {}).length;
}

const saveTotalQuoteAmount = async (total: number) => {
    await admin.database().ref('/totalQuotes').set(total);
}

export const setupFirebase = (fetchQuotes: () => Promise<Array<Quote>>) => {
    // Initialize the app with a service account, granting admin privileges
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: "https://quote-game-knhb-default-rtdb.europe-west1.firebasedatabase.app"
    });

    const updateQuotesRef = admin.database().ref('/updateQuotes');

    updateQuotesRef.on('value', async snapshot => {
        const shouldUpdate = snapshot.val();
        if (shouldUpdate) {
            console.log('Update request received!');
            const quotes = await fetchQuotes();
            console.log('Quotes: ', quotes);
            saveQuotesToDatabase(quotes);
            updateQuotesRef.set(false);
        }
    });
};
