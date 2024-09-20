import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./css/login.css";
import logo from "../assets/img/kario.png";
import logo2 from "../assets/img/kario-media.png";
import urlApi from "../data/urlApi.js";

export default function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const verifyCredentials = async () => {   
    fetch(`${urlApi}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((data) => data.json())
      .then((data) => redireccionamiento(data))
      .catch((err) => console.log(err));
  };

  const redireccionamiento = (data) => {
    if (!data.token) {
      return alert(data.message);
    } else {
      const {
        token,
        usuario: { _id, nombre, rol, imagen },
      } = data;
      
      localStorage.setItem('x-auth-token', token);
      localStorage.setItem('ID', _id);
      localStorage.setItem('userImage', imagen);

      history.push({
        pathname: "/welcome",
        state: {
          nombre,
          rol,
          imagen
        },
      });
    }

  };

  return (
    <div className="logo">
      <img id="img-animated" src={logo} alt="..." />
      <div className="login">
        <div className="header-login">
          <div className="logo-login">
            <img src={logo2} alt="..." />
          </div>
          <div className="title-login">
            <h1>Bienvenido al panel digital de KARIO Media</h1>
          </div>
          <div className="subtitle-login">
            <p>
              Por favor ingresa los siguientes datos para ingresar a la
              plataforma
            </p>
          </div>
        </div>
        <div className="inputs-login">
          <div className="inputs-container">
            <label>Usuario</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="inputs-container">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="button-login">
          <button onClick={() => verifyCredentials()}>Ingresar al panel</button>
        </div>
        <div className="info-login">
          <p>
            Tienes problemas para ingresar? Por favor contactarse con asistencia
            técnica lo más pronto posible.
          </p>
        </div>
      </div>
    </div>
  );
}
