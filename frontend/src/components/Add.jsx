import React from 'react';
import './App.css';
import {useQuery, useMutation} from '@apollo/client';
import queries from '../queries';

function Add(props){

    // Add Authors
    const [addAuthor] = useMutation(queries.ADD_AUTHOR, {
        update(cache, {data: {addAuthor}}) {
            const {authors} = cache.readQuery({
                query: queries.GET_AUTHORS
            });
            cache.writeQuery({
                query: queries.GET_AUTHORS,
                data: {authors: [...authors, addAuthor]}
            })
        }
    });

    // Add Books
    const [addBook] = useMutation(queries.ADD_BOOK, {
        update(cache, {data: {addBook}}) {
            const {books} = cache.readQuery({
                query: queries.GET_BOOKS
            });
            cache.writeQuery({
                query: queries.GET_BOOKS,
                data: {books: [...books, addBook]}
            });
        }
    });

    // Add Publishers
    const [addPublisher] = useMutation(queries.ADD_PUBLISHER, {
        update(cache, {data: {addPublisher}}) {
            const {publishers} = cache.readQuery({
                query: queries.GET_PUBLISHERS
            });
            cache.writeQuery({
                query: queries.GET_PUBLISHERS,
                data: {publishers: [...publishers, addPublisher]}
            });
        }
    });

    // Submit Author
    const onSubmitAuthor = (e) => {
        e.preventDefault();
        let name = document.getElementById('name');
        let bio = document.getElementById('bio');
        let dob = document.getElementById('dob');
        if(bio.value){
            bio = bio.value;
        } else {
            bio = '';
        }
        addAuthor({
            variables: {
                name: name.value,
                bio: bio.value,
                dateOfBirth: dob.value
            }
        });
        document.getElementById('add-author').reset();
        props.closeAddForm();
        alert('Author Added');
    }

    // Submit Book
    const onSubmitBook = (e) => {
        e.preventDefault();
        let title = document.getElementById('title');
        let publicationDate = document.getElementById('publicationDate');
        let genre = document.getElementById('genre');
        let chapters = document.getElementById('chapters');
        let authorId = document.getElementById("authorId");
        let publisherId = document.getElementById("publisherId");
        addBook({
            variables: {
                title: title.value,
                publicationDate: publicationDate.value,
                genre: genre.value,
                chapters: chapters.value !== "" ? chapters.value.split(",") : [],
                authorId: authorId.value,
                publisherId: publisherId.value
            }
        });

        document.getElementById('add-book').reset();
        props.closeAddForm();
        alert("Book Added");
    }

    const onSubmitPublisher = (e) => {
        e.preventDefault();
        let publisherName = document.getElementById('publisherName');
        let establishedYear = document.getElementById("establishedYear");
        let location = document.getElementById("location");
        addPublisher({
            variables: {
                name: publisherName.value,
                establishedYear: parseInt(establishedYear.value),
                location: location.value
            }
        });

        document.getElementById('add-publisher').reset();
        props.closeAddForm();
        alert("Publisher Added");
    }
    const authorData = useQuery(queries.GET_AUTHORS);
    const bookData = useQuery(queries.GET_BOOKS);
    const publisherData = useQuery(queries.GET_PUBLISHERS);
    
    let body = null;

    if(props.type === 'author'){
        
        body = (
            <div className="modal">
                <form className='form' id='add-author' onSubmit={onSubmitAuthor}>
                    <div className="modal-header">
                        <h3>Add Author</h3>
                    </div>
                    <div className="modal-content">
                        <div className="modal-form">
                            <div className='form-group'>
                                <label htmlFor="name">Author Name:</label>
                                <input id="name" required autoFocus={true} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dob">Date of Birth:</label>
                                <input id="dob" required placeholder="MM/DD/YYYY" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="bio">Author Bio:</label>
                                <textarea id="bio" rows="3"></textarea>
                            </div>
                        </div>
                        <div className="modal-btn-wrapper">
                            <button 
                                className="btn btn-green" 
                                type="submit"
                            >Add Author</button>
                            <button 
                                type="button"
                                className="btn btn-yellow"
                                onClick={() => {
                                    document.getElementById('add-author').reset();
                                    props.closeAddForm();
                                }}
                            >Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    } else if(props.type === 'book'){
        let authors, publishers = null;
        if(authorData.data){authors = authorData.data.authors}
        if(publisherData.data){publishers = publisherData.data.publishers}
        body = (
            <div className="modal">
                <form className="form" id="add-book" onSubmit={onSubmitBook}>
                    <div className="modal-header">
                        <h3>Add Book</h3>
                    </div>
                    <div className="modal-content">
                        <div className="modal-form">
                            <div className="form-group">
                                <label htmlFor="title">Book Title:</label>
                                <input id="title" required autoFocus={true}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="publicationDate">Publication Date:</label>
                                <input id="publicationDate" required placeholder="MM/DD/YYYY" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="genre">Genre:</label>
                                <select name="genre-list" id="genre" required placeholder="Select Genre">
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
                                <label htmlFor="chapters">Please list the chapters below, each chapter separated by a comma:</label>
                                <textarea id="chapters" rows="3"></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="authorId">Select Author:</label>
                                <select id="authorId" required>
                                    {authors && authors.map( (author) => {
                                        return (
                                            <option key={author._id} value={author._id}>
                                                {author.name}
                                            </option>
                                        );
                                    })}
                                </select>
                                <p className="form-note">If author is not listed, please add author before adding book.</p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="publisherId">Select publisher:</label>
                                <select id="publisherId" required>
                                    {publishers && publishers.map( (publisher) => {
                                        return (
                                            <option key={publisher._id} value={publisher._id}>
                                                {publisher.name}
                                            </option>
                                        );
                                    })}
                                </select>
                                <p className="form-note">If publisher is not listed, please add publisher before adding book.</p>
                            </div>
                        </div>
                        <div className="modal-btn-wrapper">
                            <button
                                className="btn btn-green"
                                type="submit"
                            >Add Book</button>
                            <button
                                className="btn btn-red"
                                type="button"
                                onClick={ () => {
                                    document.getElementById("add-book").reset();
                                    props.closeAddForm();
                                }}
                            >Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        );
        
    } else if(props.type === 'publisher'){
        body = (
            <div className="modal">
                <form className='form' id='add-publisher' onSubmit={onSubmitPublisher}>
                    <div className="modal-header">
                        <h3>Add Publisher</h3>
                    </div>
                    <div className="modal-content">
                        <div className="modal-form">
                            <div className='form-group'>
                                <label htmlFor="publisherName">Publisher Name:</label>
                                <input id="publisherName" required autoFocus={true} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="establishedYear">Established Year:</label>
                                <input id="establishedYear" required placeholder="YYYY" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="location">Location:</label>
                                <input id="location" />
                            </div>
                        </div>
                        <div className="modal-btn-wrapper">
                            <button 
                                className="btn btn-green" 
                                type="submit"
                            >Add Publisher</button>
                            <button 
                                type="button"
                                className="btn btn-yellow"
                                onClick={() => {
                                    document.getElementById('add-publisher').reset();
                                    props.closeAddForm();
                                }}
                            >Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    } else {
        body = (
            <p>Error loading form</p>
        );
    }

    return(
        <>
            {body}
        </>
    );
}

export default Add;