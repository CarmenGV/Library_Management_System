import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {authors, books, publishers} from '../config/mongoCollections.js';

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    const bookCollection = await books();
    const authorCollection = await authors();
    const publisherCollection = await publishers();
    
    //Book Collection
    await bookCollection.insertMany([
        {
            title: "Jane Eyre",
            publicationDate: "10/16/1847",
            genre: "FICTION",
            chapters: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI","XII", "XII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX",
                "XX", "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX", "XXXI", "XXXII", "XXXIII", "XXXIV", "XXXV", "XXXVI", "XXXVII", "XXXVIII"
            ]
        },
        {
            title: "The Hobbit",
            publicationDate: "09/21/1937",
            genre: "FICTION",
            chapters: ["Unexpected party", "Roast mutton", "Short rest", "Over hill and under hill", "Riddles in the dark", "Out of the frying-pan into the fire", "Queer lodgings", "Flies and spiders", "Barrels out of bond", "Warm welcome", "On the doorstep", "Inside information", "Not a home", "Fire and water", "Gathering of the clouds", "Thief in the night", "Clouds burst", "Return journey", "Last stage"]
        }
    ]);

    await authorCollection.insertMany([
        {
            name: "J. R. R. Tolkien", 
            bio: "John Ronald Reuel Tolkien: writer, artist, scholar, linguist. Known to millions around the world as the author of The Lord of the Rings, Tolkien spent most of his life teaching at the University of Oxford where hewas a distinguished academic in the fields of Old and Middle English and Old Norse. His creativity, confined to his spare time, found its outlet in fantasy works, stories for children, poetry, illustration and invented languages and alphabets.",
            dateOfBirth: "01/03/1892"
        },
        {
            name: "Charlotte Bronte",
            bio: "Charlotte Nicholls, commonly known as Charlotte Bronte, was an English novelist and poet, the eldest of the three Bronte sisters who survived into adulthood and whose novels became classics of English literature. She is best known for her novel Jane Eyre, which she published under the male pseudonym Currer Bell.",
            dateOfBirth: "04/21/1816"
        }
    ]);

    await publisherCollection.insertMany([
        {
            name: "Penguin Books",
            establishedYear: 1935,
            location: "Westminster, London, England",
        },
        {
            name: "HarperCollins",
            establishedYear: 1817,
            location: "New York City"
        }
    ]);

    console.log("Done seeding database");
    await closeConnection();
};

main().catch(console.log);
