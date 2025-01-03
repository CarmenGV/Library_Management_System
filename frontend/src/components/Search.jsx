import React, {useState} from 'react';
import './App.css';
import {Link} from 'react-router-dom';
import {useQuery, useLazyQuery} from '@apollo/client';
import queries from '../queries';

function Search(){
    const [searchType, setSearchType] = useState('');
    const [keyword, setKeyword] = useState('');
    const [minYear, setMinYear] = useState('');
    const [maxYear, setMaxYear] = useState('');
    const [results, setResults] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    // Get Books By Genre
    const [booksByGenre] = useLazyQuery(queries.GET_BOOK_BY_GENRE, {
        fetchPolicy: 'cache-and-network',
        onCompleted: (data) => {
            if(data && data.booksByGenre){
                setResults(data.booksByGenre);
            }
        },
        onError: (error) => {
            console.error('Error fetching books by genre: ', error);
        }
    });
    // Get Books By Title
    const [searchBookByTitle] = useLazyQuery(queries.GET_BOOK_BY_TITLE, {
        fetchPolicy: 'cache-and-network',
        onCompleted: (data) => {
            if(data && data.searchBookByTitle){
                setResults(data.searchBookByTitle);
            }
        },
        onError: (error) => {
            console.error('Error fetching books by title: ', error);
        }
    });
    // Get Publisher By Established Year
    const [publishersByEstablishedYear] = useLazyQuery(queries.GET_PUBLISHER_BY_ESTABLISHED_YEAR, {
        fetchPolicy: 'cache-and-network',
        onCompleted: (data) => {
            if(data && data.publishersByEstablishedYear){
                setResults(data.publishersByEstablishedYear);
            }
        },
        onError: (error) => {
            console.error('Error fetching publishers by established year: ', error);
        }
    });
    // Get Author By Name
    const [searchAuthorByName] = useLazyQuery(queries.GET_AUTHOR_BY_NAME, {
        fetchPolicy: 'cache-and-network',
        onCompleted: (data) => {
            if(data && data.searchAuthorByName){
                setResults(data.searchAuthorByName);
            }
        },
        onError: (error) => {
            console.error('Error fetching author by name: ', error);
        }
    });

    const onSelection = () => {
        const searchSelection = document.getElementById('search-selection').value;
        setSearchType(searchSelection);
        setIsVisible(true);
    }

    const detailsLink = (id) => {
        if(searchType === "booksByGenre" || searchType == "bookByTitle"){
            return "/book/" + id;
        } else if(searchType === "publisherEstablishedYear"){
            return "/publisher/" + id;
        } else {
            return "/author/" + id;
        }
    }

    let body;

    const onSubmitSearch = (e) => {
        e.preventDefault();
        try{
            let data;
            let searchSection = document.getElementById("searchSection");
            if(searchType === 'booksByGenre'){
                booksByGenre({ variables: {genre: keyword.toUpperCase()}});
            } else if(searchType === 'bookByTitle'){
                searchBookByTitle({variables: {searchTerm: keyword}});
            } else if(searchType === 'publisherEstablishedYear'){
                if(parseInt(minYear) > parseInt(maxYear)){
                    alert('Minimum year must be less than the maximum year');
                    return;
                }
                publishersByEstablishedYear({variables: {min: parseInt(minYear), max:parseInt(maxYear)}});
            } else if(searchType === 'authorName'){
                searchAuthorByName({variables: {searchTerm: keyword }});
            }
            searchSection.style.display = "block";
        } catch (error){
            body = (<p>Error fetching search results: {error}</p>);
            setResults([]);
        }
    }
    return(
        <>
            <header>
                <div className="header-text search">
                    <h1>Search</h1>
                    <p>welcome to the search page. You can search our database for the following:</p>
                    <ul>
                        <li>Search Book By Title</li>
                        <li>Search Book By Genre</li>
                        <li>Search Author By Name</li>
                        <li>Search Publisher By Established Year</li>
                    </ul>
                    <p>In the form below, first select the search you wish to conduct and then type the keyword(s) you wish to search. If searching for publisher by established year, input both a mininum and maximum year. </p>
                </div>
            </header>
            <main>
                <form id="searchForm" className="search-form" onSubmit={onSubmitSearch}>
                    <div className='selection-section'>
                        <select 
                            name="search-list" 
                            id='search-selection' 
                            required
                            onChange={onSelection}
                        >
                            <option value="">Select Search Type</option>
                            <option value="booksByGenre">Search Books By Genre</option>
                            <option value="bookByTitle">Search Book By Title</option>
                            <option value="publisherEstablishedYear">Search Publisher by Established Year</option>
                            <option value="authorName">Search Author By Name</option>
                        </select>
                        <button type="button" className="btn btn-yellow" onClick={onSelection}>Select</button>
                    </div>
                    <div className="search-input-wrapper" id="search-input" style={{ display: isVisible ? 'flex' : 'none'}}>
                        {searchType === 'publisherEstablishedYear' ? (
                            <div id="min-max-year">
                                <input
                                    type="number"
                                    id="min-year"
                                    placeholder="Minimum Year"
                                    value={minYear}
                                    onChange={(e) => setMinYear(e.target.value)}
                                />
                                <input
                                    type="number"
                                    id="max-year"
                                    placeholder="Maximum Year"
                                    value={maxYear}
                                    onChange={(e) => setMaxYear(e.target.value)}
                                />
                        </div>
                        ) : (
                            <input
                                id="keyword-input"
                                placeholder="Keyword"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        )}
                        <button type="submit" className="btn btn-green">Search</button>
                    </div>
                </form>
                <section className="results-section">
                    <h2>Search Results</h2>
                    <ul id="searchSection" className="list-card-wrapper" >
                        {results.length > 0 ? (
                            results.map( (item) => {
                                return(
                                    <li className="list-card" key={item._id}>
                                        <div className="list-p-wrapper">
                                            <p className="list-title">{item.title || item.name}</p>
                                            {item.genre && <p>Genre: {item.genre}</p>}
                                        </div>
                                        <div className="list-btn-wrapper">
                                            <Link
                                                className="btn btn-green"
                                                to={detailsLink(item._id)}
                                            >View Details</Link>
                                        </div>
                                    </li>
                                );
                            })
                        ) : (
                            <p>No results found.</p>
                        )}
                    </ul>
                </section>
            </main>
        </>
    );
}

export default Search;