import React from 'react';
import { Link } from 'react-router-dom';
import astronauta from "../assets/img/astronauta.png";
import './css/notFound.css'

export default function NotFound() {
  return (
    <div className='not-found-container'>
      <div className="texto-not-found">
        <h2>404</h2>
        <h4>Whoops... No encontramos la página que estabas buscando</h4>
        <Link to="/home">
        <button>Volver al Home</button></Link>
      </div>
      <div className="img-not-found">
        <img src={astronauta} alt="astronauta-not-found" />
      </div>
    </div>
  )
}
