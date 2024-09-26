import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import urlApi from "../data/urlApi";

export default function Panel2() {
  const history = useHistory();
  const token = localStorage.getItem("x-auth-token");
  const [data, setData] = useState([]);

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
  }, [token, history]);

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

  const handleClick = (id) => {
    localStorage.setItem("IDMeta", id);
    window.location.reload(); // Forza la recarga de la página después de hacer clic
  };

  const handleButtonClick = (e, metaId) => {
    e.preventDefault();

    Swal.fire({
      title: "¿Estás seguro de que deseas eliminar esta meta?",
      text: "No podrás recuperarla una vez borrada",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${urlApi}/metas/${metaId}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              Swal.fire("¡Eliminado con éxito!", "", "success");
              setTimeout(() => {
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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", options);
  };

  return (
    <div className="">
      <table className="table p-2 ">
        <thead className="">
          <tr>
          
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td>
                  <Link
                    to="/meta-dashboard"
                    onClick={() => handleClick(item._id)} // Recarga la página al hacer clic
                    style={{ textDecoration: "none", color: "black" }} // Sin subrayado y texto negro
                  >
                    {item.nombre}
                  </Link>
                </td>
                <td>{item.dificultad}</td>

                <td>{formatDate(item.fechaFinal)}</td>
                <td>
                  <h4>
                    {calculatePercentage(item.tareas)}%
                  </h4>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Cargando datos...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
