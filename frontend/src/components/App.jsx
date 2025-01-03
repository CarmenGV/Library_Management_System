import React from 'react';
import './App.css';
import {NavLink, Route, Routes} from 'react-router-dom';
import Home from './Home';
import Authors from './Authors';
import Author from './Author';
import Books from './Books';
import Book from './Book';
import Publishers from './Publishers';
import Publisher from './Publisher';
import Search from './Search';


function App() {

  return (
    <>
      <nav>
        <NavLink className="home-link" to='/'>Library Management System</NavLink>
        <ul className="links-wrapper">
          <li><NavLink className="nav-link" to='/authors/'>Authors</NavLink></li>
          <li><NavLink className="nav-link" to='/books/'>Books</NavLink></li>
          <li><NavLink className="nav-link" to='/publishers'>Publishers</NavLink></li>
          <li><NavLink className="nav-link" to="./search">Search</NavLink> </li>
        </ul>
      </nav>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/authors/' element={<Authors />} />
        <Route path='/author/:id' element={<Author />} />
        <Route path='/books/' element={<Books />} />
        <Route path='/book/:id' element={<Book />} />
        <Route path='/publishers/' element={<Publishers />} />
        <Route path='/publisher/:id' element={<Publisher />} />
        <Route path='/search/' element={<Search/>} />
      </Routes>
    </>
  )
}

export default App
