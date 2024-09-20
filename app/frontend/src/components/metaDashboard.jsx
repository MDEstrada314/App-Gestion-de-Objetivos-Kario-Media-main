import React, { useEffect, useState, Suspense, lazy } from "react";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "./spinner.jsx";
import urlApi from "../data/urlApi.js";
import "./css/metaDashboard.css";

const MetasContent = lazy(() => import("./metasContent.jsx"));

export default function MetaDashboard() {
  /* prueba con sweetalert2 */
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const metaId = localStorage.getItem("IDMeta");
  const token = localStorage.getItem("x-auth-token");
  const history = useHistory();

  const [apiData, setApiData] = useState(null);
  const [tareas, setTareas] = useState(null);

  /* fetch API data */
  useEffect(() => {
    if (!token) return history.push("/");
    fetch(`${urlApi}/metas/${metaId}`, {
      method: "GET",
      headers: {
        "x-auth-token": token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setApiData(data);
        setTareas(data.tareas);
      })
      .catch((err) => console.log(err));
  }, []);

  /* marcar completo o incompleto una tarea */
  const toggleCheckbox = (tareaId) => {
    let newTareas = [...tareas];
    let editado = newTareas.find((t) => t._id === tareaId);
    let index = newTareas.findIndex((t) => t._id === tareaId);

    swalWithBootstrapButtons
      .fire({
        title: `¿Marcar la tarea como ${
          editado.check ? "INCOMPLETA" : "COMPLETADA"
        }?`,
        //text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, deseo hacerlo",
        cancelButtonText: "Mejor no",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          editado["check"] = !editado["check"];
          newTareas.splice(index, 1, editado);
          console.log(tareas, newTareas);

          newTareas.forEach((e, i) => {
            delete newTareas[i].integranteData;
            delete newTareas[i]._id;
          });

          fetch(`${urlApi}/metas/add-tasks/${metaId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
            body: JSON.stringify({ tareas: newTareas }),
          })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .finally(() => window.location.reload())
            .catch((err) => alert(err));

          swalWithBootstrapButtons.fire(
            "Hecho!",
            "Se han guardado los cambios exitosamente"
          );
        }
      });
  };

  /* eliminar una tarea */
  const deletingTask = (tareaId) => {
    let newTareas = [...tareas];
    let index = newTareas.findIndex((t) => t._id === tareaId);

    Swal.fire({
      title: "Estás seguro?",
      text: "Al eliminar este campo no podrás recuperarlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        newTareas.splice(index, 1);
        newTareas.forEach((e, i) => {
          delete newTareas[i].integranteData;
          delete newTareas[i]._id;
        });

        console.log(newTareas);
        fetch(`${urlApi}/metas/add-tasks/${metaId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({ tareas: newTareas }),
        })
          .then((res) => res.json())
          .then((data) => console.log(data))
          .finally(() => window.location.reload())
          .catch((err) => alert(err));

        Swal.fire("¡Eliminado!", "El registro ha sido borrado con éxito");
      }
    });
  };

  const addNewTask = (newTask) => {
    console.log("entraaa");
    let newTareas = [...tareas];
    newTareas.forEach((e, i) => {
      delete newTareas[i].integranteData;
      delete newTareas[i]._id;
    });
    newTareas.push(newTask);
    console.log(newTareas);

    fetch(`${urlApi}/metas/add-tasks/${metaId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({ tareas: newTareas }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .finally(() => window.location.reload())
      .catch((err) => alert(err));
  };

  if (!apiData) {
    // esperar a recibir respuesta para renderizar
    return (
      <div className="spinner-container">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="metas-container">
      <Suspense fallback={<Spinner />}>
        <MetasContent
          apiData={apiData}
          tareas={tareas}
          toggleCheckbox={toggleCheckbox}
          deletingTask={deletingTask}
          addNewTask={addNewTask}
        />
      </Suspense>
    </div>
  );
}
