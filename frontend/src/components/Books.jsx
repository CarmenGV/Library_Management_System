import React, {useState} from 'react';
import './App.css';
import {Link} from 'react-router-dom';
import {useQuery} from '@apollo/client';
import queries from '../queries';
import Add from './Add';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';

function Books () {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setEditModal] = useState(false);
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [editBook, setEditBook] = useState(null);
    const [deleteBook, setDeleteBook] = useState(null);

    const {loading, error, data} = useQuery(queries.GET_BOOKS, {
        fetchPolicy: 'cache-and-network'
    });

    //Edit Modal
    const handleOpenEditModal = (book) => {
        setEditModal(true);
        setEditBook(book);
    };

    //Delete Modal
    const handleOpenDeleteModal = (book) => {
        setDeleteModal(true);
        setDeleteBook(book);
    };

    //Close Add Form
    const closeAddForm = () => {
        setShowAddForm(false);
    }

    //Close Modals
    const handleCloseModals = () => {
        setEditModal(false)
        setDeleteModal(false)
    }

    if(data){
        const {books} = data;
        return(
            <>
                <header>
                    <div className="header-text">
                        <h1>Books Listing</h1>
                        <p>Below is the list of books in our database. You can add a new book by clickin on the button on the right. You can also edit or delete an individual book. Click the book's name to view more information about the book.</p>
                    </div>
                    <button
                        className="header-btn"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        <span>Add Book</span>
                    </button>
                    {showAddForm && (
                        <Add type="book" closeAddForm={closeAddForm} />
                    )}
                </header>
                <main>
                    <ul className="list-card-wrapper">
                        {books.map( (book) => {
                            return(
                                <li className="list-card" key={book._id}>
                                    <div className="list-p-wrapper">
                                        <Link className="list-link" to={"/book/" + book._id}>
                                            <p className="list-title">{book.title}</p>
                                        </Link>
                                        <p><strong>Genre:</strong> {book.genre}</p>
                                    </div>
                                    <div className="list-btn-wrapper">
                                        <button
                                            className="btn btn-green"
                                            onClick={() => handleOpenEditModal(book)}
                                        >Edit Book</button>
                                        <button
                                            className="btn btn-red"
                                            onClick={() => {handleOpenDeleteModal(book)}}
                                        >Delete Book</button>
                                    </div>
                                </li>
                            );
                        })}
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
                    </ul>
                </main>
            </>
        );
    } else if(loading){
        return <div className="loading-animation">Loading</div>
    } else if(error){
        return <div className="error-message">{error.message}</div>
    }
};

export default Books;