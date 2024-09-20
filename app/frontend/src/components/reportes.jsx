import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import urlApi from "../data/urlApi.js";
import "./css/reportes.css";

export default function Reportes() {
  const history = useHistory();
  const usuario = localStorage.getItem("ID");
  const token = localStorage.getItem("x-auth-token");

  const [asunto, setAsunto] = useState("");
  const [especifico, setEspecifico] = useState("");

  useEffect(() => {
    if (!token) history.push("/");
  }, []);

  const crearReclamo = () => {
    if (asunto == "" || especifico == "") {
      Swal.fire("Campos incompletos", "Por favor, complete todos los campos.", "error");
      return;
    }

    const nuevo = {
      asunto,
      especifico,
      usuario,
    };
    fetch(`${urlApi}/reportes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify(nuevo),
    })
      .then((res) => res.json)
      .then(() =>
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Tu reporte ha sido enviado con éxito",
          showConfirmButton: false,
          timer: 1500,
        })
      )
      .then(() => {
        setAsunto("");
        setEspecifico("");
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="reportes-container">
      <h2>¿Tienes alguna queja, reclamo o sugerencia?</h2>
      <form className="form-container">
        <div className="inputs-reclamos">
          <div className="input-form-container tareas">
            <label htmlFor="asunto">Asunto:</label>
            <input
              required
              type="text"
              id="asunto"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
            />
          </div>
          <div className="input-form-container tareas">
            <label htmlFor="especifico">
              Sé un poco más específico al respecto:
            </label>
            <textarea
              required
              rows={7}
              id="especifico"
              value={especifico}
              onChange={(e) => setEspecifico(e.target.value)}
            ></textarea>
          </div>
        </div>
      </form>
      <button className="reportes-btn" onClick={() => crearReclamo()}>
        Enviar
      </button>
    </div>
  );
}
