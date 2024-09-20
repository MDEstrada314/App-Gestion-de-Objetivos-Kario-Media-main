import React from "react";
import { useHistory } from "react-router-dom";
import "./css/logout.css";
import Swal from "sweetalert2";

export default function LogoutBox() {
  const history = useHistory();

  const handleLogoutClick = () => {
    Swal.fire({
      title: "¿Seguro deseas cerrar sesión?",
      text: "No podrás acceder de nuevo sin iniciar sesión",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Cerrando sesión",
          icon: "info",
          timer: 1500,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        setTimeout(() => {
          localStorage.clear();
          history.push("/");
        }, 1500);
      }
    });
  };

  return (
    <div className="logout-box">
      <button className="logout-button" onClick={handleLogoutClick}>
        <i className="bi bi-box-arrow-left"></i> Cerrar Sesión
      </button>
    </div>
  );
}
