import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import "./css/formularioCreate.css";
import urlApi from "../data/urlApi.js";
import Swal from "sweetalert2";

const Formulario = () => {
  let history = useHistory();
  const token = localStorage.getItem("x-auth-token");

  const [nombre, Setnombre] = useState("");
  const [descripcion, Setdescripcion] = useState("");
  const [dificultad, Setdificultad] = useState("");
  const [fechaInicio, SetfechaInicio] = useState("");
  const [fechaFinal, SetfechaFinal] = useState("");
  const [metodologia, Setmetodologia] = useState("");
  const [cumplimiento, Setcumplimiento] = useState("");
  const [area, Setarea] = useState("");
  const [areas, SetAreas] = useState([]);
  const swalRef = useRef(null);

  useEffect(() => {
    if (!token) return history.push("/");
    axios.get(`${urlApi}/areas`).then((response) => {
      const extractedAreas = response.data.map(({ _id, nombre, estado }) => ({
        _id,
        nombre,
        estado,
      }));
      SetAreas(extractedAreas);
    });
  }, []);

  const isFormValid = () => {
    return (
      nombre.trim() !== "" &&
      descripcion.trim() !== "" &&
      dificultad !== "" &&
      fechaInicio !== "" &&
      fechaFinal !== "" &&
      metodologia.trim() !== "" &&
      area !== ""
    );
  };

  const postData = () => {
    const token = localStorage.getItem("x-auth-token");

    const headers = {
      "x-auth-token": token,
    };

    const cumplimientoNumber = Number(cumplimiento);

    axios
      .post(
        `http://localhost:8000/api/v1/metas`,
        {
          nombre,
          descripcion,
          dificultad,
          fechaInicio,
          fechaFinal,
          metodologia,
          cumplimiento: cumplimientoNumber,
          area,
        },
        {
          headers: headers,
        }
      )
      .then(() => {
        // Redirecciona a "/home" después de guardar
        history.push("/home");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Verificar si el formulario es válido
    if (!isFormValid()) {
      Swal.fire("Campos incompletos", "Por favor, complete todos los campos.", "error");
      return;
    }
  
    // Verificar si la FechaInicio es mayor que la FechaFinal
    if (new Date(fechaInicio) > new Date(fechaFinal)) {
      Swal.fire("Fechas Incongruentes", "La Fecha de Inicio NO debe ser mayor que la Fecha de Finalización.", "error");
      return;
    }
  
    // Continuar con el proceso de guardado
    swalRef.current = Swal.fire({
      title: "Guardando...",
      icon: "success",
      didOpen: () => {
        Swal.showLoading();
      },
      timer: 1000,
      timerProgressBar: true,
      willClose: () => {
        postData();
      },
    });
  };
  
  
  return (
    <div className="form-create-container">
      <div className="create-title-container">
        <h1>Agregar Nueva Meta</h1>
      </div>
      <div className="create-form-container">
        <form className="create-form" onSubmit={handleSubmit}>
          <div className="seccion-registrar">
            <div className="seccion-derecha">
              <div className="input-form-container derecha">
                <label>Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => Setnombre(e.target.value)}
                />
              </div>
              <div className="input-form-container derecha">
                <label>Descripcion</label>
                <textarea
                  rows="10"
                  value={descripcion}
                  onChange={(e) => Setdescripcion(e.target.value)}
                />
              </div>
            </div>
            <div className="seccion-izquierda">
              <div className="input-form-container izquierda">
                <label>Dificultad</label>
                <select
                  name="dificultad"
                  id="dificultad"
                  value={dificultad}
                  onChange={(e) => Setdificultad(e.target.value)}
                >
                  <option value="" disabled>
                    . . .
                  </option>
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>
              <div className="divisor-input">
                <div className="input-form-container izquierda">
                  <label>Fecha de Inicio</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => SetfechaInicio(e.target.value)}
                  />
                </div>
                <div className="input-form-container izquierda">
                  <label>Fecha de Finalizacion</label>
                  <input
                    type="date"
                    value={fechaFinal}
                    onChange={(e) => SetfechaFinal(e.target.value)}
                  />
                </div>
              </div>
              <div className="divisor-input">
                <div className="input-form-container izquierda">
                  <label>Metodologia</label>
                  <input
                    type="text"
                    value={metodologia}
                    onChange={(e) => Setmetodologia(e.target.value)}
                  />
                </div>
                <div className="input-form-container izquierda">
                  <label>Area</label>
                  <select
                    value={area}
                    onChange={(e) => Setarea(e.target.value)}
                  >
                    <option value="" disabled>
                      Selecciona un área
                    </option>
                    {areas.map((area) => (
                      <option key={area._id} value={area._id}>
                        {area.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="btn-submit-container">
            <button type="submit">
              Guardar
            </button>
            <Link to="/home">
              <button id="cancelar">Cancelar</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Formulario;
