import React, {useState} from 'react';
import './App.css';
import ReactModal from 'react-modal';
import {useQuery, useMutation} from '@apollo/client';
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

function EditModal (props) {
    const [showEditModal, setEditModal] = useState(props.isOpen);
    const [author, setAuthor] = useState(props.author);
    const [book, setBook] = useState(props.book);
    const [publisher, setPublisher] = useState(props.publisher);

    if(props.type === "author"){
        const [editAuthor] = useMutation(queries.EDIT_AUTHOR);
        let name, bio, dateOfBirth;

        return (
            <>
                <ReactModal
                    name='editModal'
                    isOpen={showEditModal}
                    contentLabel="Edit Author"
                    style={customStyles}
                >
                    <form 
                        className="form" 
                        id="edit-author"
                        onSubmit={(e) => {
                            e.preventDefault();
                            editAuthor({
                                variables: {
                                    id:props.author._id,
                                    name: name.value,
                                    bio: bio.value,
                                    dateOfBirth: dateOfBirth.value
                                }
                            });
                            name.value='';
                            bio.value='';
                            dateOfBirth.value='';
                            props.handleClose();
                            alert("Author Updated!");
                        }}
                    >
                        <div className="modal-header">
                            <h3>Edit Author</h3>
                        </div>
                        <div className="modal-content">
                            <div className="modal-form">
                                <div className="form-group">
                                    <label htmlFor="name">Author Name:</label>
                                    <input ref={(node) => {name = node;}} defaultValue={author.name} autoFocus={true} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="dateOfBirth">Date Of Birth:</label>
                                    <input ref={(node) => {dateOfBirth = node}} defaultValue={author.dateOfBirth} placeholder="MM/DD/YYYY" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="bio">Author Bio:</label>
                                    <textarea ref={(node) => {bio = node}} defaultValue={author.bio} rows="5"></textarea>
                                </div>
                            </div>
                            <div className="modal-btn-wrapper">
                                <button
                                    className="btn btn-green"
                                    type="submit"
                                >Submit</button>
                                <button
                                    type="button"
                                    className="btn btn-yellow"
                                    onClick={() => {
                                        setAuthor(null);
                                        setEditModal(false);
                                        props.handleClose();
                                    }}
                                >Cancel</button>
                            </div>
                        </div>
                    </form>
                </ReactModal>
            </>
        );
    } else if(props.type === "book"){
        const [editBook] = useMutation(queries.EDIT_BOOK);
        let title, publicationDate, genre, chapters, authorId, publisherId;

        let authors, publishers;
        const authorData = useQuery(queries.GET_AUTHORS);
        const publisherData = useQuery(queries.GET_PUBLISHERS);
        if(authorData.data){authors = authorData.data.authors};
        if(publisherData.data){publishers = publisherData.data.publishers};

        return (
            <>
                <ReactModal
                    name='editModal'
                    isOpen={showEditModal}
                    contentLabel="Edit Book"
                    style={customStyles}
                >
                    <form
                        className="form"
                        id='edit_book'
                        onSubmit={(e) => {
                            e.preventDefault();
                            editBook({
                                variables: {
                                    id: props.book._id,
                                    title: title.value,
                                    publicationDate: publicationDate.value,
                                    genre: genre.value,
                                    chapters: chapters.value.split(','),
                                    authorId: authorId.value,
                                    publisherId: publisherId.value
                                }
                            });
                            title.value='';
                            publicationDate.value='';
                            chapters.value='';
                            props.handleClose();
                            alert("Book Updated!");
                        }}
                    >
                        <div className="modal-header">
                            <h3>Edit Book</h3>
                        </div>
                        <div className="modal-content">
                            <div className="modal-form">
                                <div className="form-group">
                                    <label htmlFor="title">Book Title:</label>
                                    <input ref={(node) => {title = node;}} defaultValue={book.title} autoFocus={true} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="publicationDate">Publication Date:</label>
                                    <input ref={(node) => {publicationDate = node}} defaultValue={book.publicationDate} placeholder="MM/DD/YYYY" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="genre">Genre:</label>
                                    <select defaultValue={book.genre} ref={(node) => {genre = node;}}>
                                        <option value="FICTION">Fiction</option>
                                        <option value="NON_FICTION">Non Fiction</option>
                                        <option value="MYSTERY">Mystery</option>
                                        <option value="FANTASY">Fantasy</option>
                                        <option value="ROMANCE">Romance</option>
                                        <option value="SCIENCE_FICTION">Science Fiction</option>
                                        <option value="HORROR">Horror</option>
                                        <option value="BIOGRAPHY">Biography</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="chapters">Chapters:</label>
                                    <textarea ref={(node) => {chapters = node}} defaultValue={book.chapters} row="3"></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="authorId">Author:</label>
                                    <select defaultValue={book.author._id} ref={(node) => {authorId = node;}}>
                                        {authors && authors.map((author) => {
                                            return(
                                                <option key={author._id} value={author._id}>{author.name}</option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="publisherId">Publisher:</label>
                                    <select defaultValue={book.publisher.name} ref={(node) => {publisherId = node;}}>
                                        {publishers && publishers.map((publisher) => {
                                            return(
                                                <option key={publisher._id} value={publisher._id}>{publisher.name}</option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-btn-wrapper">
                                <button
                                    className="btn btn-green"
                                    type="submit"
                                >Submit</button>
                                <button
                                    type="button"
                                    className="btn btn-yellow"
                                    onClick={() => {
                                        setBook(null);
                                        setEditModal(false);
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
        const [editPublisher] = useMutation(queries.EDIT_PUBLISHER);
        let publisherName, establishedYear, location;

        return (
            <>
                <ReactModal
                    name='editModal'
                    isOpen={showEditModal}
                    contentLabel="Edit Publisher"
                    style={customStyles}
                >
                    <form 
                        className="form" 
                        id="edit-publisher"
                        onSubmit={(e) => {
                            e.preventDefault();
                            editPublisher({
                                variables: {
                                    id:props.publisher._id,
                                    publisherName: publisherName.value,
                                    establishedYear: parseInt(establishedYear.value),
                                    location: location.value
                                }
                            });
                            publisherName.value='';
                            establishedYear.value='';
                            location.value='';
                            props.handleClose();
                            alert("Pulisher Updated!");
                        }}
                    >
                        <div className="modal-header">
                            <h3>Edit Publisher</h3>
                        </div>
                        <div className="modal-content">
                            <div className="modal-form">
                                <div className="form-group">
                                    <label htmlFor="publisherName">Publisher Name:</label>
                                    <input ref={(node) => {publisherName = node;}} defaultValue={publisher.name} autoFocus={true} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="establishedYear">Established Year:</label>
                                    <input ref={(node) => {establishedYear = node}} defaultValue={publisher.establishedYear} placeholder="MM/DD/YYYY" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="location">Location:</label>
                                    <input ref={(node) => {location = node}} defaultValue={publisher.location} rows="5"/>
                                </div>
                            </div>
                            <div className="modal-btn-wrapper">
                                <button
                                    className="btn btn-green"
                                    type="submit"
                                >Submit</button>
                                <button
                                    type="button"
                                    className="btn btn-yellow"
                                    onClick={() => {
                                        setPublisher(null);
                                        setEditModal(false);
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

export default EditModal;