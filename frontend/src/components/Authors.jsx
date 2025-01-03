import React, {useState} from 'react';
import './App.css';
import {Link} from 'react-router-dom';
import {useQuery} from '@apollo/client';
import queries from '../queries';
import Add from './Add';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';

function Authors() {

    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setEditModal] = useState(false);
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [editAuthor, setEditAuthor] = useState(null);
    const [deleteAuthor, setDeleteAuthor] = useState(null);

    const {loading, error, data} = useQuery(queries.GET_AUTHORS, {
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

    //Close Add Form
    const closeAddForm = () => {
        setShowAddForm(false);
    };

    //Close Modals
    const handleCloseModals = () => {
        setEditModal(false);
        setDeleteModal(false);
    }

    if(data){
        const {authors} = data;
        return(
            <>
                <header>
                    <div className="header-text">
                        <h1>Authors Listing</h1>
                        <p>Below is the list of authors in our database. You can add a new author by clicking on the button to the right. You can also edit or delete an individual author. Click an author's name to view more information about the author.</p>
                    </div>
                    <button 
                        className="header-btn"
                        onClick={() => setShowAddForm(!showAddForm)}
                        >
                            <span>Add Author</span>
                        </button>
                        {showAddForm && (
                            <Add type="author" closeAddForm={closeAddForm} />
                        )}
                </header>
                <main>
                    <ul className="list-card-wrapper">
                        {authors.map( (author) => {
                            return (
                                <li className="list-card" key={author._id}>
                                    <Link className="list-link" to={"/author/" + author._id}>
                                        <p className="list-title">{author.name}</p>
                                    </Link>
                                    <div className="list-btn-wrapper">
                                        <button 
                                            className="btn btn-green"
                                            onClick={() => handleOpenEditModal(author)}
                                            >Edit Author</button>
                                        <button 
                                            className="btn btn-red"
                                            onClick={() => {handleOpenDeleteModal(author)}}
                                            >Delete Author</button>
                                    </div>
                                </li>
                            );
                        })}
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
                    </ul>
                </main>
            </>
        );
    } else if(loading){
        return <div className="loading-animation">Loading</div>
    } else if(error){
        return <div className="error-message">{error.message}</div>
    }
}

export default Authors;