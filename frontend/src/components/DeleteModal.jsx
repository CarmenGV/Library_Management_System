import React, {useState} from 'react';
import './App.css';
import ReactModal from 'react-modal';
import {useMutation} from '@apollo/client';
import queries from '../queries';

ReactModal.setAppElement('#root');
const customStyles = {
    content: {
        top:'50%',
        left:'50%',
        right:'auto',
        bottom:'auto',
        marginRight: '-50%',
        transform:'translate(-50%, -50%)',
        width:'60%',
        border:'none',
        borderRadius:'20px',
        padding:'0'
    }
};

function DeleteModal(props){

    const [showDeleteModal, setDeleteModal] = useState(props.isOpen);
    const [author, setAuthor] = useState(props.author);
    const [book, setBook] = useState(props.book)
    const [publisher, setPublisher] = useState(props.publisher);

    if(props.type === 'author'){
        const [removeAuthor] = useMutation(queries.DELETE_AUTHOR, {
            update(cache) {
                cache.modify({
                    fields: {
                        authors(existingAuthors, {readField}){
                            return existingAuthors.filter(
                                (authRef) => author._id !== readField('_id', authRef)
                            );
                        }
                    }
                });
            }
        });
    
    
        return(
            <>
                <ReactModal
                    name='deleteModal'
                    isOpen={showDeleteModal}
                    contentLabel='Delete Author'
                    style={customStyles}
                >
                    <form
                        className="form"
                        id="delete-author"
                        onSubmit={(e) => {
                            e.preventDefault();
                            removeAuthor({
                                variables: {
                                    id:props.author._id
                                }
                            });
                            setDeleteModal(false);
                            props.handleClose();
                            alert("Author Deleted");
                        }}
                    >
                        <div className="modal-header">
                            <h3>Delete Author</h3>
                        </div>
                        <div className="modal-content">
                            <p>Are you sure you want to delete {author.name}?</p>
                            <div class="modal-btn-wrapper">
                                <button className="btn btn-red" type='submit'>
                                    Delete Author
                                </button>
                                <button
                                    type='button'
                                    className="btn btn-yellow"
                                    onClick={() => {
                                        setDeleteModal(false);
                                        props.handleClose();
                                    }}
                                >Cancel</button>
                            </div>
                        </div>
                    </form>
                </ReactModal>
            </>
        );
    } else if(props.type === 'book'){
        const [removeBook] = useMutation(queries.DELETE_BOOK, {
            update(cache){
                cache.modify({
                    fields: {
                        books(existingBooks, {readField}){
                            return existingBooks.filter(
                                (bookRef) => book._id !== readField('_id', bookRef)
                            );
                        }
                    }
                });
            }
        });
        return(
            <>
                <ReactModal
                    name='deleteModal'
                    isOpen={showDeleteModal}
                    contentLabel='Delete Book'
                    style={customStyles}
                >
                    <form
                        className="form"
                        id="delete-book"
                        onSubmit={(e) => {
                            e.preventDefault();
                            removeBook({
                                variables:{
                                    id:props.book._id
                                }
                            });
                            setDeleteModal(false);
                            props.handleClose();
                            alert("Book Deleted!");
                        }}
                    >
                        <div className="modal-header">
                            <h3>Delete Book</h3>
                        </div>
                        <div className="modal-content">
                            <p>Are you sure you want to delete {book.title}?</p>
                            <div className="modal-btn-wrapper">
                                <button className="btn btn-red" type="submit">
                                    Delete Book
                                </button>
                                <button
                                    type='button'
                                    className="btn btn-yellow"
                                    onClick={() => {
                                        setDeleteModal(false);
                                        props.handleClose();
                                    }}
                                >Cancel</button>
                            </div>
                        </div>
                    </form>
                </ReactModal>
            </>
        );
    } else if(props.type === 'publisher'){
        const [removePublisher] = useMutation(queries.DELETE_PUBLISHER, {
            update(cache) {
                cache.modify({
                    fields: {
                        publishers(existingPublishers, {readField}){
                            return existingPublishers.filter(
                                (pubRef) => publisher._id !== readField('_id', pubRef)
                            );
                        }
                    }
                });
            }
        });
    
    
        return(
            <>
                <ReactModal
                    name='deleteModal'
                    isOpen={showDeleteModal}
                    contentLabel='Delete Publisher'
                    style={customStyles}
                >
                    <form
                        className="form"
                        id="delete-publisher"
                        onSubmit={(e) => {
                            e.preventDefault();
                            removePublisher({
                                variables: {
                                    id:props.publisher._id
                                }
                            });
                            setDeleteModal(false);
                            props.handleClose();
                            alert("Publisher Deleted");
                        }}
                    >
                        <div className="modal-header">
                            <h3>Delete Publisher</h3>
                        </div>
                        <div className="modal-content">
                            <p>Are you sure you want to delete {publisher.name}?</p>
                            <div class="modal-btn-wrapper">
                                <button className="btn btn-red" type='submit'>
                                    Delete Publisher
                                </button>
                                <button
                                    type='button'
                                    className="btn btn-yellow"
                                    onClick={() => {
                                        setDeleteModal(false);
                                        props.handleClose();
                                    }}
                                >Cancel</button>
                            </div>
                        </div>
                    </form>
                </ReactModal>
            </>
        );
    }
}

export default DeleteModal;