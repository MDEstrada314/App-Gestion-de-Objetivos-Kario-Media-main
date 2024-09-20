import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2"; 
import axios from "axios";  
import "../components/css/panel.css";
import urlApi from "../data/urlApi";

import incompleta from "../assets/img/grafica-incompleto.svg";
import proceso from "../assets/img/grafica-proceso.svg";
import completa from "../assets/img/grafica-completo.svg";
import formatDate from "../helpers/dateFormating";

export default function Panel() {
  const history = useHistory();
  const token = localStorage.getItem("x-auth-token");
  const [data, setData] = useState([])

  useEffect(() => {
    if (!token) return history.push("/");
    fetch(`${urlApi}/metas`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Error al obtener datos de la API:", error);
      });
  }, []);

  const calculatePercentage = (tareas) => {
    if (tareas && tareas.length > 0) {
      const completadas = tareas.filter((tarea) => tarea.check).length;
      const totalTareas = tareas.length;
      const porcentaje = (completadas / totalTareas) * 100;

      return Math.round(porcentaje);
    } else {
      return 0;
    }
  };

  // Guardar la _id en localStorage
  const handleClick = (id) => {
    localStorage.setItem("IDMeta", id);
  };

  const displayNormal=()=>{
    const textHome = document.querySelector('#text-home')
    const textDelete = document.querySelector('#text-delete')
    const textInfo = document.querySelector('#text-info')
    const textInfoDelete = document.querySelector('#text-info-delete')
    const btnCrearMetas = document.querySelector("#crear-metas");
    const btnCancel = document.querySelector("#cancelar-borrar");
    const iconTrashElements = document.querySelectorAll('.icon-trash')
    const cellBorrarElements = document.querySelector('.cell-borrar')
    const padreHoverElements = document.querySelectorAll('.hover-rows');

        if (textHome.classList.contains('no-ver')) {
          textHome.classList.replace('no-ver', 'ver')
          textDelete.classList.replace('ver', 'no-ver')
        }

        if (textInfo.classList.contains('no-ver')) {
          textInfo.classList.replace('no-ver', 'ver')
          textInfoDelete.classList.replace('ver', 'no-ver')
        }

        if (btnCrearMetas.classList.contains("no-ver")) {
          btnCrearMetas.classList.replace("no-ver", "ver");
          btnCancel.classList.replace("ver", "no-ver");
        }
        
        if (cellBorrarElements.classList.contains("ver")) {
          cellBorrarElements.classList.replace("ver", "no-ver")
        }
    
        iconTrashElements.forEach((element) => {
          element.classList.replace("ver", "no-ver");
        });


        
        padreHoverElements.forEach((element) => {
          element.classList.replace("hover-eliminar","padre-tabla");
        });
    }

    const handleButtonClick = (e, metaId) => {
      e.preventDefault();
  
      // Usa Swal para confirmar la eliminación
      Swal.fire({
        title: "¿Estás seguro de que deseas eliminar esta meta?",
        text: "No podrás recuperarla una vez borrada",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          // Si el usuario confirmó, ejecuta la eliminación
          fetch(`${urlApi}/metas/${metaId}`, {
            method: "DELETE",
          })
            .then((response) => {
              if (response.ok) {
                // Después de eliminar, muestra una notificación de éxito
                Swal.fire("¡Eliminado con éxito!", "", "success");
                setTimeout(() => {
                  // Espera 2 segundos y luego recarga la página
                  window.location.reload();
                }, 1000);
              } else {
                console.error("Error al eliminar la meta.");
              }
            })
            .catch((error) => {
              console.error("Error al eliminar la meta:", error);
            });
        }
      });
    };

  return (
    <div style={{ width: "100%" }}>
      <div className="d-flex justify-content-center mt-3">
        <h1 id="text-home" className="ver">Panel de Indicadores</h1>
        <h1 id="text-delete" className="no-ver">Panel de Borrado</h1>
      </div>
      <div className="d-flex justify-content-center">
        <p id="text-info" className="ver" style={{ textAlign: "center" }}>
          Aquí puedes visualizar los indicadores propuestos y añadidos por tu
          equipo de trabajo. Si quieres ver más detalles, da clic en uno de
          ellos para obtener más información.
        </p>
        <p id="text-info-delete" className="no-ver" style={{ textAlign: "center" }}>
          Aquí puedes eliminar los indicadores propuestos y añadidos por tu
          equipo de trabajo. Da click en el que desees borrar.
        </p>
      </div>
      <div className="table">
        <div className="row-container">
          <div className="row-header indice">
            <div className="cell ver">Nombre</div>
            <div className="cell">Descripción</div>
            <div className="cell">Dificultad</div>
            <div className="cell">Fecha de Inicio</div>
            <div className="cell">Fecha de Termino</div>
            <div className="cell">Metodología</div>
            <div className="cell">Cumplimiento</div>
            <div className="cell">Área</div>
            <div className="cell no-ver cell-borrar">Borrar</div>
          </div>
        </div>
        {data.length > 0 ? (
          data.map((item, index) => (
            <Link id='remover' className="mapped-item" to="/meta-dashboard" onClick={() => handleClick(item._id)}  key={index}>
              <div id="padre-tabla" className="hover-rows row-container hover padre-tabla ">
                <div className="row">
                  <div className="cell hover">{item.nombre}</div>
                  <div className="cell tex-descrip">
                    <h4 className="descripcion">{item.descripcion}</h4>
                  </div>
                  <div className="cell">{item.dificultad}</div>
                  <div className="cell">{formatDate(item.fechaInicio)}</div>
                  <div className="cell">{formatDate(item.fechaFinal)}</div>
                  <div className="cell">{item.metodologia}</div>
                  <div className="cell">
                    <h4
                      style={{
                        backgroundImage:
                        calculatePercentage(item.tareas) > 80
                        ? `url(${completa})`
                        : calculatePercentage(item.tareas) > 40
                        ? `url(${proceso})`
                        : `url(${incompleta})`
                      }}
                      className="background-container"
                    >
                      {calculatePercentage(item.tareas)}%
                    </h4>
                  </div>
                  <div className="cell">{item.area[0].nombre}</div>
                  <div className="cell no-ver icon-trash"><button type="button" className="btn btn-danger" onClick={(e) => { handleClick(item._id); handleButtonClick(e, item._id); }}><i className="bi bi-trash3"></i></button></div>
                </div>
              </div>
            </Link> 
          ))
        ) : (
          <p>Cargando datos...</p>
        )}
      </div>
        <div className='btn-container'>
          <Link to="/home/formulario">
            <button id='crear-metas' className="ver"> Añadir Elementos </button>
          </Link>
          <Link to="/home">
            <button id='cancelar-borrar' className="no-ver" onClick={displayNormal}> Cancelar </button>
          </Link>
        </div>
    </div>
  );
}
