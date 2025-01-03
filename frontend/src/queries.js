import {gql} from '@apollo/client';

// Queries
// Get All
const GET_AUTHORS = gql`
    query {
        authors {
            _id
            name
            bio
            dateOfBirth
        }
    }
`;

const GET_BOOKS = gql`
    query Books {
        books {
            _id
            title
            publicationDate
            genre
                author {
                    name
                    _id
                }
            publisher {
                _id
                name
            }
            chapters
        }
    }
`;
const GET_PUBLISHERS = gql`
    query Publishers {
        publishers {
            _id
            name
            establishedYear
            location
            numOfBooks
            books {
                _id
                title
            }
        }
    }
`;

// Get By Id
const GET_AUTHOR_BY_ID = gql`
    query GetAuthorById($id: String!) {
        getAuthorById(_id: $id) {
            _id
            name
            bio
            dateOfBirth
            books {
                _id
                title
            }
            numOfBooks
        }
    }
`;
const GET_BOOK_BY_ID = gql`
    query GetBookById(
        $id: String!
    ) {
        getBookById(
            _id: $id
        ) {
            _id
            title
            publicationDate
            genre
            chapters
            author {
                _id
                name
            }
            publisher {
                _id
                name
            }
        }
    }
`;
const GET_PUBLISHER_BY_ID = gql`
    query GetPublisherById(
        $id: String!
    ) {
        getPublisherById(
            _id: $id
        ) {
            _id
            name
            establishedYear
            location
            numOfBooks
            books {
                _id
                title
            }
        }
    }
`;

// Search Queries
const GET_BOOK_BY_GENRE = gql`
    query Query(
        $genre: Genre!
    ) {
        booksByGenre(
            genre: $genre
        ) {
            _id
            title
            publicationDate
            genre
            author {
                _id
                name
            }
            publisher {
                _id
                name
            }
            chapters
        }
    }
`;
const GET_BOOK_BY_TITLE = gql`
    query SearchBookByTitle(
        $searchTerm: String!
    ) {
        searchBookByTitle(
            searchTerm: $searchTerm
        ) {
            _id
            title
            publicationDate
            genre
            author {
                _id
                name
            }
            publisher {
                _id
                name
            }
            chapters
        }
    }
`;
const GET_PUBLISHER_BY_ESTABLISHED_YEAR = gql`
    query PublishersByEstablishedYear($min: Int!, $max: Int!) {
  publishersByEstablishedYear(min: $min, max: $max) {
    _id
    name
    establishedYear
    location
    books {
      _id
      title
    }
    numOfBooks
  }
}
`;
const GET_AUTHOR_BY_NAME = gql`
    query SearchAuthorByName($searchTerm: String!) {
  searchAuthorByName(searchTerm: $searchTerm) {
    _id
    name
    bio
    dateOfBirth
    books {
      _id
      title
    }
    numOfBooks
  }
}
`;

// Mutations
// Add
const ADD_AUTHOR = gql`
    mutation AddAuthor(
        $name: String! 
        $dateOfBirth: String! 
        $bio: String
    ) {
        addAuthor(
            name: $name
            dateOfBirth: $dateOfBirth
            bio: $bio
        ) {
            _id
            name
        }
    }
`;
const ADD_BOOK = gql`
    mutation AddBook(
        $title: String!
        $publicationDate: String!
        $genre: Genre!
        $chapters: [String!]!
        $authorId: String!
        $publisherId: String!
    ) {
        addBook(
            title: $title
            publicationDate: $publicationDate
            genre: $genre
            chapters: $chapters
            authorId: $authorId
            publisherId: $publisherId
        ) {
            _id
            title
            publicationDate
            genre
            chapters
            author {
                _id
                name
            }
            publisher {
                _id
                name
            }
        }
    }
`;
const ADD_PUBLISHER = gql`
    mutation AddPublisher(
        $name: String!
        $establishedYear: Int!
        $location: String!
    ) {
        addPublisher(
            name: $name
            establishedYear: $establishedYear
            location: $location
        ) {
            _id
            name
            establishedYear
            location
            books {
                _id
                title
            }
            numOfBooks
        }
    }
`;

// Edit
const EDIT_AUTHOR = gql`
    mutation EditAuthor(
        $id: String! 
        $name: String
        $bio: String
        $dateOfBirth: String
    ) {
        editAuthor(
            _id: $id
            name: $name
            bio: $bio
            dateOfBirth: $dateOfBirth
        ) {
            _id
            name
            bio
            dateOfBirth
            books {
                _id
                title
            }
            numOfBooks
        }
    }
`;
const EDIT_BOOK = gql`
    mutation EditBook(
        $id: String!
        $title: String 
        $publicationDate: String
        $genre: Genre
        $chapters: [String!]
        $authorId: String
        $publisherId: String
    ) {
        editBook(
            _id: $id
            title: $title
            publicationDate: $publicationDate
            genre: $genre
            chapters: $chapters
            authorId: $authorId
            publisherId: $publisherId
        ) {
            _id
            title
            publicationDate
            genre
            chapters
            author {
                _id
                name
            }
            publisher {
                _id
                name
            }
        }
    }
`;
const EDIT_PUBLISHER = gql`
    mutation EditPublisher(
        $id: String!
        $name: String
        $establishedYear: Int
        $location: String
    ) {
        editPublisher(
            _id: $id
            name: $name
            establishedYear: $establishedYear
            location: $location
        ) {
            _id
            name
            establishedYear
            location
            numOfBooks
            books {
                _id
                title
            }
        }
    }
`;

// Delete
const DELETE_AUTHOR = gql`
    mutation RemoveAuthor(
        $id: String!
    ) {
        removeAuthor(_id: $id) {
            _id
            name
            dateOfBirth
        }
    }
`;
const DELETE_BOOK = gql`
    mutation RemoveBook(
        $id: String!
    ) {
        removeBook(
            _id: $id
        ) {
            _id
            title
        }
    }
`;
const DELETE_PUBLISHER = gql`
    mutation RemovePublisher(
        $id: String!
    ) {
        removePublisher(_id: $id) {
            _id
            name
        }
    }
`;

let exported = {
    GET_AUTHORS,
    GET_BOOKS,
    GET_PUBLISHERS,
    GET_AUTHOR_BY_ID,
    GET_PUBLISHER_BY_ID,
    GET_BOOK_BY_ID,
    GET_BOOK_BY_GENRE,
    GET_BOOK_BY_TITLE,
    GET_PUBLISHER_BY_ESTABLISHED_YEAR,
    GET_AUTHOR_BY_NAME,
    ADD_AUTHOR,
    ADD_BOOK,
    ADD_PUBLISHER,
    EDIT_AUTHOR,
    EDIT_BOOK,
    EDIT_PUBLISHER,
    DELETE_AUTHOR,
    DELETE_BOOK,
    DELETE_PUBLISHER
};

export default exported;