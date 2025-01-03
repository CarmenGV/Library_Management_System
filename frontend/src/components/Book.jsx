import React, {useState} from 'react';
import './App.css';
import {useParams} from 'react-router-dom';
import {useQuery} from '@apollo/client';
import queries from '../queries';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';

function Book (){
    const [showEditModal, setEditModal] = useState(false);
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [editBook, setEditBook] = useState(null);
    const [deleteBook, setDeleteBook] = useState(null);

    const {id} = useParams();

    const {loading, error, data} = useQuery(queries.GET_BOOK_BY_ID, {
        variables: { id },
        fetchPolicy: 'cache-and-network'
    });

    //Edit Modal
    const handleOpenEditModal = (book) => {
        setEditModal(true);
        setEditBook(book);
    }

    //Delete Modal
    const handleOpenDeleteModal = (book) => {
        setDeleteModal(true);
        setDeleteBook(book);
    };

    //Close Modals
    const handleCloseModals = () => {
        setEditModal(false);
        setDeleteModal(false);
    }

    if(data){
        const book = data.getBookById;
        return(
            <>
                <header>
                    <div className="header-text">
                        <h1>Book</h1>
                        <p>Below is detailed information about the book, including the author, genre, publication date, chapters, and publisher. You can click on the individual books to read more information about the book. You can also edit or delete said book by clicking on the respective button.</p>
                    </div>
                    <div></div>
                </header>
                <main>
                    <div className="card center">
                        <h2 className="card-title">{book.title}</h2>
                        <p>Author: {book.author.name}</p>
                        <p>Genre: {book.genre}</p>
                        <p>Publisher: {book.publisher.name}</p>
                        <p>Publication Date: {book.publicationDate}</p>
                        <ul className="list-card-wrapper">
                            {book.chapters.map( (chapter) => {
                                return(
                                    <li className="list-card" key={book._id}>
                                        <p className="list-title">{chapter}</p>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="card-btn-wrapper">
                            <button 
                                className="btn btn-green"
                                onClick={() => handleOpenEditModal(book)}
                            >Edit Book</button>
                            <button 
                                className="btn btn-red"
                                onClick={() => {handleOpenDeleteModal(book)}}
                            >Delete Book</button>
                        </div>
                    </div>
                    {showEditModal && (
                            <EditModal
                                type="book"
                                isOpen={showEditModal}
                                book={editBook}
                                handleClose={handleCloseModals}
                            />
                        )}
                        {showDeleteModal && (
                            <DeleteModal
                                type="book"
                                book={deleteBook}
                                isOpen={showDeleteModal}
                                handleClose={handleCloseModals}
                                delete={deleteBook}
                            />
                        )}
                </main>
            </>
        );
    } else if(loading){
        return <div> Loading...</div>
    } else if (error){
        return <div>{error.message}</div>
    }
}

export default Book;