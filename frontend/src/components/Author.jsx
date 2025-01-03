import React, {useState} from 'react';
import './App.css';
import {Link, useParams} from 'react-router-dom';
import {useQuery} from '@apollo/client';
import queries from '../queries';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';

function Author (){
    const [showEditModal, setEditModal] = useState(false);
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [editAuthor, setEditAuthor] = useState(null);
    const [deleteAuthor, setDeleteAuthor] = useState(null);

    const {id} = useParams();

    const {loading, error, data} = useQuery(queries.GET_AUTHOR_BY_ID, {
        variables: { id },
        fetchPolicy: 'cache-and-network'
    });

    //Edit Modal
    const handleOpenEditModal = (author) => {
        setEditModal(true);
        setEditAuthor(author);
    }

    //Delete Modal
    const handleOpenDeleteModal = (author) => {
        setDeleteModal(true);
        setDeleteAuthor(author);
    };

    //Close Modals
    const handleCloseModals = () => {
        setEditModal(false);
        setDeleteModal(false);
    }

    if(data){
        const author = data.getAuthorById;
        return(
            <>
                <header>
                    <div className="header-text">
                        <h1>Author</h1>
                        <p>Below is detailed information about the author, including the number of books they have written and a list of their books by name. You can click on the individual books to read more information about the book. You can also edit or delete said author by clicking on the respective button.</p>
                    </div>
                    <div></div>
                </header>
                <main>
                    <div className="card">
                        <h2 className="card-title">{author.name}</h2>
                        <p>Born: {author.dateOfBirth}</p>
                        <p>{author.bio}</p>
                        <h3 className="card-list-title">Books: {author.numOfBooks}</h3>
                        <ul className="list-card-wrapper">
                            {author.books.map( (book) => {
                                return(
                                    <li className="list-card" key={author._id}>
                                        <p className="list-title">{book.title}</p>
                                        <Link className="btn btn-green" to={"/book/" + book._id}>View Book</Link>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="card-btn-wrapper">
                            <button 
                                className="btn btn-green"
                                onClick={() => handleOpenEditModal(author)}
                            >Edit Author</button>
                            <button 
                                className="btn btn-red"
                                onClick={() => {handleOpenDeleteModal(author)}}
                            >Delete Author</button>
                        </div>
                    </div>
                    {showEditModal && (
                            <EditModal
                                type="author"
                                isOpen={showEditModal}
                                author={editAuthor}
                                handleClose={handleCloseModals}
                            />
                        )}
                        {showDeleteModal && (
                            <DeleteModal
                                type="author"
                                author={deleteAuthor}
                                isOpen={showDeleteModal}
                                handleClose={handleCloseModals}
                                delete={deleteAuthor}
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

export default Author;