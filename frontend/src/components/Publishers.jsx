import React, {useState} from 'react';
import './App.css';
import {Link} from 'react-router-dom';
import {useQuery} from '@apollo/client';
import queries from '../queries';
import Add from './Add';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';

function Publishers() {

    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setEditModal] = useState(false);
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [editPublisher, setEditPublisher] = useState(null);
    const [deletePublisher, setDeletePublisher] = useState(null);

    const {loading, error, data} = useQuery(queries.GET_PUBLISHERS, {
        fetchPolicy: 'cache-and-network'
    });

    //Edit Modal
    const handleOpenEditModal = (publisher) => {
        setEditModal(true);
        setEditPublisher(publisher);
    }

    //Delete Modal
    const handleOpenDeleteModal = (publisher) => {
        setDeleteModal(true);
        setDeletePublisher(publisher);
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
        const {publishers} = data;
        return(
            <>
                <header>
                    <div className="header-text">
                        <h1>Publishers Listing</h1>
                        <p>Below is the list of publishers in our database. You can add a new publisher by clicking on the button to the right. You can also edit or delete an individual publisher. Click a publisher's name to view more information about the publisher.</p>
                    </div>
                    <button 
                        className="header-btn"
                        onClick={() => setShowAddForm(!showAddForm)}
                        >
                            <span>Add Publisher</span>
                        </button>
                        {showAddForm && (
                            <Add type="publisher" closeAddForm={closeAddForm} />
                        )}
                </header>
                <main>
                    <ul className="list-card-wrapper">
                        {publishers.map( (publisher) => {
                            return (
                                <li className="list-card" key={publisher._id}>
                                    <Link className="list-link" to={"/publisher/" + publisher._id}>
                                        <p className="list-title">{publisher.name}</p>
                                    </Link>
                                    <div className="list-btn-wrapper">
                                        <button 
                                            className="btn btn-green"
                                            onClick={() => handleOpenEditModal(publisher)}
                                            >Edit Publisher</button>
                                        <button 
                                            className="btn btn-red"
                                            onClick={() => {handleOpenDeleteModal(publisher)}}
                                            >Delete Publisher</button>
                                    </div>
                                </li>
                            );
                        })}
                        {showEditModal && (
                            <EditModal
                                type="publisher"
                                isOpen={showEditModal}
                                publisher={editPublisher}
                                handleClose={handleCloseModals}
                            />
                        )}
                        {showDeleteModal && (
                            <DeleteModal
                                type="publisher"
                                publisher={deletePublisher}
                                isOpen={showDeleteModal}
                                handleClose={handleCloseModals}
                                delete={deletePublisher}
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

export default Publishers;