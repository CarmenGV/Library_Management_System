import React, {useState} from 'react';
import './App.css';
import {Link, useParams} from 'react-router-dom';
import {useQuery} from '@apollo/client';
import queries from '../queries';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';

function Publisher (){
    const [showEditModal, setEditModal] = useState(false);
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [editPublisher, setEditPublisher] = useState(null);
    const [deletePublisher, setDeletePublisher] = useState(null);

    const {id} = useParams();

    const {loading, error, data} = useQuery(queries.GET_PUBLISHER_BY_ID, {
        variables: { id },
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

    //Close Modals
    const handleCloseModals = () => {
        setEditModal(false);
        setDeleteModal(false);
    }

    if(data){
        const publisher = data.getPublisherById;
        return(
            <>
                <header>
                    <div className="header-text">
                        <h1>Publisher</h1>
                        <p>Below is detailed information about the publisher, including publisher's established year, location, and a list of books in our database they have published. You can click on the individual book to read more information about the book. You can also edit or delete said publisher by clicking on the respective button.</p>
                    </div>
                    <div></div>
                </header>
                <main>
                    <div className="card center">
                        <h2 className="card-title">{publisher.name}</h2>
                        <p>Established Year: {publisher.establishedYear}</p>
                        <p>Location: {publisher.bio}</p>
                        <h3 className="card-list-title">Books: {publisher.numOfBooks}</h3>
                        <ul className="list-card-wrapper">
                            {publisher.books.map( (book) => {
                                return(
                                    <li className="list-card" key={publisher._id}>
                                        <p className="list-title">{book.title}</p>
                                        <Link className="btn btn-green" to={"/book/" + book._id}>View Book</Link>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="card-btn-wrapper">
                            <button 
                                className="btn btn-green"
                                onClick={() => handleOpenEditModal(publisher)}
                            >Edit Publisher</button>
                            <button 
                                className="btn btn-red"
                                onClick={() => {handleOpenDeleteModal(publisher)}}
                            >Delete Publisher</button>
                        </div>
                    </div>
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
                </main>
            </>
        );
    } else if(loading){
        return <div> Loading...</div>
    } else if (error){
        return <div>{error.message}</div>
    }
}

export default Publisher;