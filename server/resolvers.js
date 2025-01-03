import {GraphQLError} from 'graphql';
import redis from 'redis';

import {
    authors as authorCollection,
    books as bookCollection,
    publishers as publisherCollection
 } from './config/mongoCollections.js';

 import {ObjectId} from 'mongodb';

 const client = redis.createClient();
 client.connect().then(() => {});

 export const resolvers = {
    //Queries
    Query: {
        //Get All Authors
        authors: async (_, args) => {
            const authors = await authorCollection();
            const allAuthors = await authors.find({}).toArray();
            if(!allAuthors || !Array.isArray(allAuthors)){
                throw new GraphQLError(`Internal Server Error`,{
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }
            let redisAuthors = await client.json.get('authors');
            if(redisAuthors){
                console.log("Authors was cached. Displaying cached authors list.");
                return redisAuthors;
            } else {
                console.log("Authors was not cached or expired. Returning authors from server");
                await client.json.set('authors', '$', allAuthors);
                await client.expire('authors', 3600);
                return allAuthors;
            }
        },
        //Get All Books
        books: async (_, args) => {
            const books = await bookCollection();
            const allBooks = await books.find({}).toArray();
            if(!allBooks || !Array.isArray(allBooks)){
                throw new GraphQLError(`Interanl Server Error`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }
            let redisBooks = await client.json.get('books');
            if(redisBooks){
                console.log("Books was cached. Displaying cached books list.");
                return redisBooks;
            } else{
                console.log("Books was not cached or expired. Returning books from server.");
                await client.json.set('books', '$', allBooks);
                await client.expire('books', 3600);
                return allBooks;
            }
        },
        //Get All Publishers
        publishers: async (_, args) => {
            const publishers = await publisherCollection();
            const allPublishers = await publishers.find({}).toArray();
            if(!allPublishers || !Array.isArray(allPublishers)){
                throw new GraphQLError(`Internal Server Error`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }
            let redisPublishers = await client.json.get('publishers');
            if(redisPublishers){
                console.log("Publishers was cached. Displaying cached publishers list.");
                return redisPublishers;
            } else{
                console.log("Publishers was not cached or expired. Returning publishers from server.");
                await client.json.set('publishers', '$', allPublishers);
                await client.expire('publishers', 3600);
                return allPublishers;
            }
        },
        //Get Author By Id
        getAuthorById: async (_, args) => {
            if(!ObjectId.isValid(args._id)){
                throw new GraphQLError(
                    `Provided ID is invalid.`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    }
                );
            }
            const authors = await authorCollection();
            const author = await authors.findOne({_id: new ObjectId(args._id)});
            if(!author){
                throw new GraphQLError('Author Not Found', {
                    extensions: {code: 'NOT_FOUND'}
                });
            }
            let redisAuthorId = await client.json.get("author:" + args._id);
            if(redisAuthorId){
                console.log("Author by ID was cached. Displaying cached author by id.");
                return redisAuthorId;
            } else{
                console.log("Author by ID was not cached. Returning author by ID from server.");
                await client.json.set("author:" + args._id, '$', author);
                return author;
            }
        },
        //Get Book By Id
        getBookById: async (_, args) => {
            if(!ObjectId.isValid(args._id)){
                throw new GraphQLError(
                    `Provided ID is invalid.`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    }
                );
            }
            const books = await bookCollection();
            const book = await books.findOne({_id: new ObjectId(args._id)});
            if(!book){
                throw new GraphQLError('Book Not Found', {
                    extensions: {code: "NOT_FOUND"}
                });
            }
            let redisBookId = await client.json.get("book:" + args._id);
            if(redisBookId){
                console.log("Book by ID was cached. Displaying cached book by ID.");
                return redisBookId;
            } else {
                console.log("Book by ID was not cached. Returning book by ID from server.");
                await client.json.set("book:" + args._id, '$', book);
                return book;
            }
        },
        //Get Publisher by Id
        getPublisherById: async (_, args) => {
            if(!ObjectId.isValid(args._id)){
                throw new GraphQLError(
                    `Provided ID is invalid.`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    }
                );
            }
            const publishers = await publisherCollection();
            const publisher = await publishers.findOne({_id: new ObjectId(args._id)});
            if(!publisher){
                throw new GraphQLError('Publisher Not Found', {
                    extensions: {code: "NOT_FOUND"}
                });
            }
            let redisPublisherId = await client.json.get("publisher:" + args._id);
            if(redisPublisherId){
                console.log("Publisher by ID was cached. Displaying cached publisher by ID.");
                return redisPublisherId;
            } else {
                console.log("Publisher by ID was not cached. Returning publisher by ID from server.");
                await client.json.set("publisher:" + args._id, '$', publisher);
                return publisher;
            }
        },
        //Get Chapters by Book ID
        getChaptersByBookId: async (_, args) => {
            const books = await bookCollection();
            const book = await books.findOne({_id: new ObjectId(args.bookId)}, {projection: {chapters: 1}});
            if(!book){
                throw new GraphQLError('Book Not Found', {
                    extensions: {code: "NOT_FOUND"}
                });
            }
            let redisChapters = await client.json.get("book:" +args.bookId + ":chapters");
            if(redisChapters){
                console.log("Book was cached. Displaying cached book chapters.");
                return redisChapters;
            } else {
                console.log("Book was not cached. Returning book chapters from server.");
                await client.json.set("book:" + args.bookId + ":chapters", '$', book.chapters);
                await client.expire("book:" +args.bookId + ":chapters", 3600);
                return book.chapters;
            }
        },
        //Get Book By Genre
        booksByGenre: async (_, args) => {
            if(args.genre.trim().length === 0){
                throw new GraphQLError('Provided genre cannot be an empty string.', {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }
            const books = await bookCollection();
            const bookGenre = await books.find({'genre': args.genre}).toArray();
            if(!bookGenre || bookGenre.length === 0){
                throw new GraphQLError('Book Genre Not Found', {
                    extensions: {code: 'NOT_FOUND'}
                });
            }
            let redisGenre = await client.json.get("genre:" + args.genre);
            if(redisGenre){
                console.log("Book by genre was cached. Displaying cached book by genre.");
                return redisGenre;
            } else {
                console.log("Book genre was not cached. Returning book by genre from the server.");
                await client.json.set("genre:" + args.genre, '$', bookGenre);
                await client.expire("genre:" + args.genre, 3600);
                return bookGenre;
            }
        },
        //Get Publishers By Established Year
        publishersByEstablishedYear: async (_, args) => {
            let invalidMinMax = false;
            let invalidYear = new Date().getFullYear() + 5;
            if(args.min <= 1409|| args.max <= args.min || args.max >= invalidYear){
                invalidMinMax = true;
            }
            const publishers = await publisherCollection();
            const publisherEstablished = await publishers
                .find({
                    $and: [{'establishedYear': {$lte: args.max}}, {'establishedYear': {$gte: args.min}}]
                })
                .toArray();
            if(!publisherEstablished || invalidMinMax || publisherEstablished.length === 0){
                throw new GraphQLError('Publishers by established year not found, or Min/Max were invalid.', {
                    extensions: {code: 'NOT_FOUND'}
                });
            }
            let redisEstablished = await client.json.get("establishedYear:" + args.min + ":" + args.max);
            if(redisEstablished){
                console.log("Publisher by established year was cached. Displaying cached publisher by established year.");
                return redisEstablished;
            } else {
                console.log("Publisher by established year was not cached. Returning publisher by established year from server.");
                await client.json.set("establishedYear:" + args.min + ":" + args.max, '$', publisherEstablished);
                await client.expire("establishedYear:" + args.min + ":" + args.max, 3600);
                return publisherEstablished;
            }
        },
        //Get Author By Name
        searchAuthorByName: async (_, args) => {
            let isNonAlpha = /[^a-zA-Z\s]/;
            if(args.searchTerm.match(isNonAlpha)){
                throw new GraphQLError("Author name cannot contain numbers or special characters.", {
                    extensions: {code: "BAD_USER_INPUT"}
                });
            }
            if(args.searchTerm.trim().length === 0){
                throw new GraphQLError("Author name cannot be an empty string.", {
                    extensions: {code: "BAD_USER_INPUT"}
                });
            }
            const authors = await authorCollection();
            const authorByName = await authors
                .find({'name': {$regex: args.searchTerm, $options: 'i'}})
                .toArray();
            if(!authorByName){
                throw new GraphQLError("Author could not be found by search term.", {
                    extensions: {code: "NOT_FOUND"}
                });
            }
            let authorName = await client.json.get("search:author:" + args.searchTerm);
            if(authorName){
                console.log("Author was cached. Displaying cached author.");
                return authorName;
            } else {
                console.log("Author was not cached. Returning author from server");
                await client.json.set("search:author:" + args.searchTerm, '$', authorByName);
                await client.expire("search:author:" + args.searchTerm, 3600);
                return authorByName;
            }
        },
        //Search Book By Title
        searchBookByTitle: async (_, args) => {
            let isNonAlpha = /[^a-zA-Z\s]/;
            if(args.searchTerm.match(isNonAlpha)){
                throw new GraphQLError("Search term cannot contain numbers or special characters.", {
                    extensions: {code: "BAD_USER_INPUT"}
                });
            }
            if(args.searchTerm.trim().length === 0){
                throw new GraphQLError("Search term cannot be an empty string.", {
                    extensions: {code: "BAD_USER_INPUT"}
                });
            }
            const books = await bookCollection();
            const bookByName = await books
                .find({"title": {$regex: args.searchTerm, $options: 'i'}})
                .toArray();
            if(!bookByName){
                throw new GraphQLError("Book could not be found by search term.", {
                    extensions: {code: 'NOT_FOUND'}
                });
            }
            let bookName = await client.json.get("search:book:" + args.searchTerm);
            if(bookName){
                console.log("Book was cached. Displaying cached book.");
                return bookName;
            } else {
                console.log("Book was not cached. Returning book from server");
                await client.json.set("search:book:" + args.searchTerm, '$', bookByName);
                await client.expire("search:book:" + args.searchTerm, 3600);
                return bookByName;
            }
        }
    },
    //Book Relations
    Book: {
        author: async (parentValue) => {
            const authors = await authorCollection();
            const author = await authors
                .findOne({_id: new ObjectId(parentValue.authorId)});
            return author;
        },
        publisher: async (parentValue) => {
            const publishers = await publisherCollection();
            const publisher = await publishers
                .findOne({_id: new ObjectId(parentValue.publisherId)});
            return publisher;
        }
    },
    //Author Relations
    Author: {
        books: async (parentValue) => {
            const books = await bookCollection();
            const authorBooks = await books
                .find({authorId: parentValue._id})
                .toArray();
            return authorBooks;
        },
        numOfBooks: async (parentValue) => {
            const books = await bookCollection();
            const authorBooks = await books
                .count({authorId: parentValue._id});
            return authorBooks;
        }
    },
    //Publisher Relations
    Publisher: {
        books: async (parentValue) => {
            const books = await bookCollection();
            const publisherBooks = await books
                .find({publisherId: parentValue._id})
                .toArray();
            return publisherBooks;
        },
        numOfBooks: async (parentValue) => {
            const books = await bookCollection();
            const publisherBooks = await books
                .count({publisherId: parentValue._id});
            return publisherBooks;
        }
    },
    //Mutations
    Mutation: {
        //Author Mutations
        addAuthor: async (_, args) => {
            if(args.name.trim().length === 0 || args.dateOfBirth.trim().length === 0){
                throw new GraphQLError(
                    `None of the provided arguments can be empty strings.`, 
                    {extensions: {code: 'BAD_USER_INPUT'}}
                );
            }
            if(args.bio && args.bio.trim().length === 0){
                throw new GraphQLError(
                    `None of the provided arguments can be empty strings.`, 
                    {extensions: {code: 'BAD_USER_INPUT'}}
                );
            }
            const isNonAlpha = /[^a-zA-Z\s]/;
            if(args.name.match(isNonAlpha)){
                throw new GraphQLError("Author name cannot contain numbers or special characters.", {
                    extensions: {code: "BAD_USER_INPUT"}
                });
            }
            const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
            if(!dateRegex.test(args.dateOfBirth)){
                throw new GraphQLError("Date of birth is in an invalid format. Must use MM/DD/YYYY.", {
                    extensions: {code: "BAD_USER_INPUT"}
                });
            }
            let [month, day, year] = args.dateOfBirth.split("/");
            let bYear = new Date(year).getFullYear();
            let today = new Date().getFullYear();
            if(bYear > today){
                throw new GraphQLError("Date of birth is invalid format. Cannot use future dates", {
                    extensions: {code: "BAD_USER_INPUT"}
                });
            }
            const authors = await authorCollection();
            const newAuthor = {
                name: args.name,
                bio: args.bio,
                dateOfBirth: args.dateOfBirth
            };
            let insertedAuthor = await authors.insertOne(newAuthor);
            if(!insertedAuthor.acknowledged || !insertedAuthor.insertedId){
                throw new GraphQLError(`Could not add author.`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }
            const authorID = insertedAuthor.insertedId;
            newAuthor._id = authorID;
            await client.json.set("author:" + authorID.toString(), '$', newAuthor);
            let authorList = await client.exists("authors");
            if(authorList === 1){
                let authorArray = await client.json.get("authors");
                authorArray.push(newAuthor);
                await client.json.set("authors", '$', authorArray);
            } 
            return newAuthor;
        },
        editAuthor: async (_, args) => {
            if(args.name && args.name.trim().length === 0){
                throw new GraphQLError(
                    `None of the provided arguments can be empty strings.`, 
                    {extensions: {code: 'BAD_USER_INPUT'}}
                );
            }
            if(args.dateOfBirth && args.dateOfBirth.trim().length === 0){
                throw new GraphQLError(
                    `None of the provided arguments can be empty strings.`, 
                    {extensions: {code: 'BAD_USER_INPUT'}}
                );
            }
            if(args.bio && args.bio.trim().length === 0){
                throw new GraphQLError(
                    `None of the provided arguments can be empty strings.`, 
                    {extensions: {code: 'BAD_USER_INPUT'}}
                );
            }
            const isNonAlpha = /[^a-zA-Z\s]/;
            if(args.name && args.name.match(isNonAlpha)){
                throw new GraphQLError("Author name cannot contain numbers or special characters.", {
                    extensions: {code: "BAD_USER_INPUT"}
                });
            }
            const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
            if(args.dateOfBirth && !dateRegex.test(args.dateOfBirth)){
                throw new GraphQLError("Date of birth is in an invalid format. Must use MM/DD/YYYY.", {
                    extensions: {code: "BAD_USER_INPUT"}
                });
            }
            let [month, day, year] = args.dateOfBirth.split("/");
            let bYear = new Date(year).getFullYear();
            let today = new Date().getFullYear();
            console.log("bYear = ", bYear);
            console.log("today = ", today);
            if(args.dateOfBirth && bYear > today){
                throw new GraphQLError("Date of birth is invalid format. Cannot use future dates", {
                    extensions: {code: "BAD_USER_INPUT"}
                });
            }
            const authors = await authorCollection();
            let editAuthor = await authors.findOne({_id: new ObjectId(args._id)});
            if(editAuthor){
                if(args.name){
                    editAuthor.name = args.name;
                }
                if(args.bio){
                    editAuthor.bio = args.bio;
                }
                if(args.dateOfBirth){
                    editAuthor.dateOfBirth = args.dateOfBirth;
                }
                await authors.updateOne({_id: new ObjectId(args._id)}, {$set: editAuthor});
            } else {
                throw new GraphQLError(
                    `Could not update author with _id of ${args._id}`,
                    {extensions: {code: 'NOT_FOUND'}}
                );
            }
            let updatedAuthor = await authors.findOne({_id: new ObjectId(args._id)});
            await client.json.set("author:" + args._id, '$', updatedAuthor);
            let authorList = await client.exists("authors");
            if(authorList === 1){
                let authorArray = await client.json.get("authors");
                let authorIndex = authorArray.findIndex((author) => author._id === args._id);
                authorArray[authorIndex] = updatedAuthor;
                await client.json.set("authors", '$', authorArray);
            }
            return editAuthor;
        },
        removeAuthor: async (_, args) => {
            //Delete Author from database
            const authors = await authorCollection();
            let deletedAuthor = await authors.findOneAndDelete({_id: new ObjectId(args._id)});
            if(!deletedAuthor){
                throw new GraphQLError (
                    `Could not delete author with _id of ${args._id}`,
                    {extensions: {code: 'NOT_FOUND'}}
                );
            }
            //Delete Books from database
            const books = await bookCollection();
            let deletedBooks = await books.deleteMany({ authorId: args._id });
            if(!deletedBooks){
                throw new GraphQLError (
                    `Could not delete books from author with _id of ${args._id}`,
                    {extensions: {code: 'NOT_FOUND'}}
                );
            }
            //Update cached data
            let redisAuthor = await client.json.get("author:" + args._id);
            if(redisAuthor){
                console.log("Deleted author has been deleted from redis cache.");
                await client.del(["author:" + args._id]);
            }
            let authorExists = await client.exists("authors");
            if(authorExists === 1){
                let authorArray = await client.json.get("authors");
                let authorIndex = authorArray.findIndex((author) => author._id === args._id);
                authorArray.splice(authorIndex, 1);
                await client.json.set("authors", '$', authorArray);
            } 
            let bookExists = await client.exists("books");
            if(bookExists === 1){
                let bookArray = await client.json.get("books");
                let filteredBooks = bookArray.filter((book) => book.authorId !== args._id);
                await client.json.set("books", '$', filteredBooks);
            }
            return deletedAuthor;
        },
        //Publisher Mutations
        addPublisher: async (_, args) => {
            if(args.name.trim().length === 0 || args.location.trim().length === 0){
                throw new GraphQLError(
                    `None of the provided arguments can be empty strings.`, 
                    {extensions: {code: 'BAD_USER_INPUT'}}
                );
            }
            const isNonAlpha = /[^a-zA-Z\s]/;
            if(args.name.match(isNonAlpha)){
                throw new GraphQLError("Publisher name cannot contain numbers or special characters.", {
                    extensions: {code: "BAD_USER_INPUT"}
                });
            }
            let maxYear = new Date().getFullYear();
            if(args.establishedYear < 1403 || args.establishedYear > maxYear){
                throw new GraphQLError("Invalid Established year. Established year either predates the earliest printed book or is greater than the current year.", {
                    extensions: {code: "BAD_USER_INPUT"}
                });
            }
            const publishers = await publisherCollection();
            const newPublisher = {
                name: args.name,
                establishedYear: args.establishedYear,
                location: args.location
            };
            let insertedPublisher = await publishers.insertOne(newPublisher);
            if(!insertedPublisher.acknowledged || !insertedPublisher.insertedId){
                throw new GraphQLError(`Could not add publisher.`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }
            const publisherID = insertedPublisher.insertedId;
            newPublisher._id = publisherID;
            await client.json.set("publisher:" + publisherID.toString(), '$', newPublisher);
            let pubExist = await client.exists("publishers");
            if(pubExist === 1){
                let pubArray = await client.json.get("publishers");
                pubArray.push(newPublisher);
                await client.json.set("publishers", '$', pubArray);
            } 
            return newPublisher;
        },
        editPublisher: async (_, args) => {
            if(args.name && args.name.trim().length === 0){
                throw new GraphQLError(
                    `None of the provided arguments can be empty strings.`, 
                    {extensions: {code: 'BAD_USER_INPUT'}}
                );
            }
            if(args.location && args.location.trim().length === 0){
                throw new GraphQLError(
                    `None of the provided arguments can be empty strings.`, 
                    {extensions: {code: 'BAD_USER_INPUT'}}
                );
            }
            const isNonAlpha = /[^a-zA-Z\s]/;
            if(args.name && args.name.match(isNonAlpha)){
                throw new GraphQLError("Publisher name cannot contain numbers or special characters.", {
                    extensions: {code: "BAD_USER_INPUT"}
                });
            }
            let maxYear = new Date().getFullYear();
            if(args.establishedYear && (args.establishedYear < 1403 || args.establishedYear > maxYear)){
                throw new GraphQLError("Invalid Established year. Established year either predates the earliest printed book or is greater than the current year.", {
                    extensions: {code: "BAD_USER_INPUT"}
                });
            }
            const publishers = await publisherCollection();
            let editPublisher = await publishers.findOne({_id: new ObjectId(args._id)});
            if(editPublisher){
                if(args.name){
                    editPublisher.name = args.name;
                }
                if(args.establishedYear){
                    editPublisher.establishedYear = args.establishedYear;
                }
                if(args.location){
                    editPublisher.location = args.location;
                }
                await publishers.updateOne({_id: new ObjectId(args._id)}, {$set: editPublisher});
            } else {
                throw new GraphQLError(
                    `Could not update publisher with _id of ${args._id}`,
                    {extensions: {code: 'NOT_FOUND'}}
                );
            }
            let updatedPublisher = await publishers.findOne({_id: new ObjectId(args._id)});
            await client.json.set("publisher:" + args._id, '$', updatedPublisher);
            let pubExists = await client.exists("publishers");
            if(pubExists === 1){
                let pubArray = await client.json.get("publishers");
                let pubIndex = pubArray.findIndex((pub) => pub._id === args._id);
                pubArray[pubIndex] = updatedPublisher;
                await client.json.set("publishers", '$', pubArray);
            }
            return updatedPublisher;
        },
        removePublisher: async (_, args) => {
            const publishers = await publisherCollection();
            let deletedPublisher = await publishers.findOneAndDelete({_id: new ObjectId(args._id)});
            if(!deletedPublisher){
                throw new GraphQLError (
                    `Could not delete publisher with _id of ${args._id}`,
                    {extensions: {code: 'NOT_FOUND'}}
                );
            }
            const books = await bookCollection();
            let deletedBooks = await books.deleteMany({ publisherId: args._id });
            console.log("removePublisher, deleted books count: ", deletedBooks.deletedCount);
            if(!deletedBooks){
                throw new GraphQLError (
                    `Could not delete books from publisher with _id of ${args._id}`,
                    {extension: {code: 'NOT_FOUND'}}
                );
            }
            //Update cached data
            let redisPublisher = await client.json.get("publisher:" + args._id);
            if(redisPublisher){
                console.log("Deleted publisher has been deleted from redis cache.");
                await client.del(["publisher:" + args._id]);
            }
            let pubExists = await client.exists("publishers");
            if(pubExists === 1){
                let pubArray = await client.json.get("publishers");
                let pubIndex = pubArray.findIndex((pub) => pub._id === args._id);
                pubArray.splice(pubIndex, 1);
                await client.json.set("publishers", '$', pubArray);
            } 
            let booksExists = await client.exists("books");
            if(booksExists === 1){
                let bookArray = await client.json.get("books");
                let filteredBooks = bookArray.filter((book) => book.publisherId !== args._id);
                await client.json.set("books", '$', filteredBooks);
            }
            return deletedPublisher;
        },
        //Book Mutations
        addBook: async (_, args) => {
            if(!ObjectId.isValid(args.authorId)){
                throw new GraphQLError(
                    `Author ID is invalid.`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    }
                );
            }
            if(!ObjectId.isValid(args.publisherId)){
                throw new GraphQLError(
                    `Publisher ID is invalid.`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    }
                );
            }
            if(args.title.trim().length === 0 || args.publicationDate.trim().length === 0 || args.genre.trim().length === 0){
                throw new GraphQLError(
                    `None of the provided arguments can be empty strings.`, 
                    {extensions: {code: 'BAD_USER_INPUT'}}
                );
            }
            if(args.chapters){
                args.chapters.map( (chapter) => {
                    if(chapter.trim().length === 0){
                        throw new GraphQLError(
                            `Chapter titles cannot be empty spaces.`, 
                            {extensions: {code: 'BAD_USER_INPUT'}}
                        );
                    }
                })
            }
            const authors = await authorCollection();
            const publishers = await publisherCollection();
            const books = await bookCollection();
            let bookChapters = [];
            const newBook = {
                title: args.title,
                publicationDate: args.publicationDate,
                genre: args.genre,
                chapters: args.chapters ? args.chapters : bookChapters,
                authorId: args.authorId,
                publisherId: args.publisherId
            }
            let author = await authors.findOne({_id: new ObjectId(args.authorId)});
            if(!author){
                throw new GraphQLError(
                    `Could not find author with authorId of ${args.authorId}`,
                    {extensions: {code: 'BAD_USER_INPUT'}}
                );
            }
            let publisher = await publishers.findOne({_id: new ObjectId(args.publisherId)});
            if(!publisher){
                throw new GraphQLError(
                    `Could not find publisher with publisherId of ${args.publisherId}`,
                    {extensions: {code: 'BAD_USER_INPUT'}}
                );
            }
            let insertedBook = await books.insertOne(newBook);
            if(!insertedBook.acknowledged || !insertedBook.insertedId){
                throw new GraphQLError(`Could not add book.`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }
            const bookId = insertedBook.insertedId;
            newBook._id = bookId;
            await client.json.set("book:" + bookId.toString(), '$', newBook);
            let bookExists = await client.exists("books");
            if(bookExists === 1){
                let bookArray = await client.json.get("books");
                bookArray.push(newBook);
                await client.json.set("books", '$', bookArray);
            } 
            return newBook;
        },
        editBook: async (_, args) => {
            if(args.authorId && !ObjectId.isValid(args.authorId)){
            throw new GraphQLError(
                `Author ID is invalid.`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                }
            );
            }
            if(args.publisherId && !ObjectId.isValid(args.publisherId)){
                throw new GraphQLError(
                    `Publisher ID is invalid.`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    }
                );
            }
            if(args.title && args.title.trim().length === 0){
                throw new GraphQLError(
                    `Book title cannot be an empty string.`, 
                    {extensions: {code: 'BAD_USER_INPUT'}}
                );
            }
            if(args.publicationDate &&  args.publicationDate.trim().length === 0){
                throw new GraphQLError(
                    `Publication date cannot be an empty string.`, 
                    {extensions: {code: 'BAD_USER_INPUT'}}
                );
            }
            if(args.genre &&  args.genre.trim().length === 0){
                throw new GraphQLError(
                    `Genre cannot be an empty string.`, 
                    {extensions: {code: 'BAD_USER_INPUT'}}
                );
            }
            if(args.chapters){
                args.chapters.map( (chapter) => {
                    if(chapter.trim().length === 0){
                        throw new GraphQLError(
                            `Chapter titles cannot be empty spaces.`, 
                            {extensions: {code: 'BAD_USER_INPUT'}}
                        );
                    }
                })
            }
            const books = await bookCollection();
            let editBook = await books.findOne({_id: new ObjectId(args._id)});
            if(editBook){
                if(args.title){
                    editBook.title = args.title;
                }
                if(args.publicationDate){
                    editBook.publicationDate = args.publicationDate;
                }
                if(args.genre){
                    editBook.genre = args.genre;
                }
                if(args.chapters){
                    editBook.chapters = args.chapters;
                }
                if(args.authorId){
                    const authors = await authorCollection();
                    let author = await authors.findOne({_id: new ObjectId(args.authorId)});
                    if(!author){
                        throw new GraphQLError(
                            `Could not find author with authorId of ${args.authorId}`,
                            {extensions: {code: 'BAD_USER_INPUT'}}
                        );
                    } else {
                        editBook.authorId = args.authorId;
                    }
                }
                if(args.publisherId){
                    const publishers = await publisherCollection();
                    let publisher = await publishers.findOne({_id: new ObjectId(args.publisherId)});
                    if(!publisher){
                        throw new GraphQLError(
                            `Could not find publisher with publisherId of ${args.publisherId}`,
                            {extensions: {code: 'BAD_USER_INPUT'}}
                        );
                    } else {
                        editBook.publisherId = args.publisherId;
                    }
                }
                await books.updateOne({_id: new ObjectId(args._id)}, {$set: editBook});
            } else {
                throw new GraphQLError(
                    `Could not update book with _id of ${args._id}`,
                    {extensions: {code: 'NOT_FOUND'}}
                );
            }
            //Update cache
            let updatedBook = await books.findOne({_id: new ObjectId(args._id)});
            await client.json.set("book:" + args._id, '$', updatedBook);
            let bookExists = await client.exists("books");
            if(bookExists === 1){
                let bookArray = await client.json.get("books");
                let bookIndex = bookArray.findIndex((book) => book._id === args._id);
                bookArray[bookIndex] = updatedBook;
                await client.json.set("books", '$', bookArray);
            }
            let authorExists = await client.exists("authors");
            if(authorExists === 1){
                let authors = await authorCollection();
                const allAuthors = await authors.find({}).toArray();
                await client.json.set("authors", '$', allAuthors);

            }
            let pubExists = await client.exists("publishers");
            if(pubExists === 1){
                let publishers = await publisherCollection();
                const allPub = await publishers.find({}).toArray();
                await client.json.set("publishers", '$', allPub);
            }
            return updatedBook;
        },
        removeBook: async (_, args) => {
            //Delete from Book Collection 
            const books = await bookCollection();
            let deletedBook = await books.findOneAndDelete({_id: new ObjectId(args._id)});
            if(!deletedBook){
                throw new GraphQLError (
                    `Could not delete book with _id of ${args._id}`,
                    {extensions: {code: 'NOT_FOUND'}}
                );
            }
            //Delete from Author Collection 
            let authors = await authorCollection();
            let delAuthorBook = await authors.updateOne(
                {'books:_id': args._id},
                {$pull: {books: args._id}}
            );
            console.log("Deleted Author Book: ", delAuthorBook);
            if(!delAuthorBook){
                throw new GraphQLError (
                    `Could not delete book from author collection with _id ${args._id}`,
                    {extensions: {code: 'NOT_FOUND'}}
                );
            }
            //Delete from Publisher Collection
            let publishers = await publisherCollection();
            let delPubBook = await publishers.updateOne(
                { 'books:_id': args._id},
                { $pull: {books: args._id}}
            );
            console.log("Deleted Publisher Book: ", delPubBook);
            if(!delPubBook){
                throw new GraphQLError (
                    `Could not delete book from publisher collection with _id ${args._id}`,
                    {extensions: {code: 'NOT_FOUND'}}
                );
            }
            //Delete from cache
            let redisBook = await client.json.get("book:" + args._id);
            if(redisBook){
                console.log("Deleted book has been deleted from redis cache.");
                await client.del(["book:" + args._id]);
            }
            let bookExists = await client.exists("books");
            if(bookExists === 1){
                let bookArray = await client.json.get("books");
                let bookIndex = bookArray.findIndex((book) => book._id === args._id);
                bookArray.splice(bookIndex, 1);
                await client.json.set("books", '$', bookArray);
            } 
            let authorExists = await client.exists("authors");
            if(authorExists === 1){
                let authors = await authorCollection();
                const allAuthors = await authors.find({}).toArray();
                await client.json.set("authors", '$', allAuthors);

            }
            let pubExists = await client.exists("publishers");
            if(pubExists === 1){
                let publishers = await publisherCollection();
                const allPub = await publishers.find({}).toArray();
                await client.json.set("publishers", '$', allPub);
            }
            return deletedBook;
        }
    }
 }