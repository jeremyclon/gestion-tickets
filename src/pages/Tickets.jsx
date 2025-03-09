import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, updateDoc, doc } from "firebase/firestore";
import catalogoProblemas from "../catalogoServicios";
import { Link } from "react-router-dom";
import "/src/Styles/Tickets.css"; // Importa los estilos

const trabajadores = ["Jeremy Tuitice", "María Gómez", "Carlos Ramírez", "Ana Torres"];

export default function Tickets() {
  const [problemaSeleccionado, setProblemaSeleccionado] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [sla, setSla] = useState(""); 
  const [asignadoA, setAsignadoA] = useState("");
  const [estado, setEstado] = useState("Abierto");
  const [importancia, setImportancia] = useState(""); 
  const [tickets, setTickets] = useState([]);
  const [notificacion, setNotificacion] = useState(""); 

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tickets"), (snapshot) => {
      const ticketData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(ticketData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!problemaSeleccionado || !descripcion || !categoriaSeleccionada || !asignadoA || !importancia) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      await addDoc(collection(db, "tickets"), {
        problema: problemaSeleccionado,
        descripcion,
        categoria: categoriaSeleccionada,
        sla,
        asignadoA,
        estado,
        importancia,
      });

      setProblemaSeleccionado("");
      setDescripcion("");
      setCategoriaSeleccionada("");
      setSla(""); 
      setAsignadoA("");
      setEstado("Abierto");
      setImportancia("");

      setNotificacion("✅ Ticket creado con éxito!");

      setTimeout(() => setNotificacion(""), 3000);
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      setNotificacion("⚠️ Error al crear el ticket. Intenta de nuevo.");
    }
  };

  return (
    <div className="tickets-container">
      <div className="ticket-header">
        <h1>🎫 Gestión de Tickets</h1>
        <div className="header-buttons">
          <Link to="/">
            <button className="btn-secondary">🏠 Inicio</button>
          </Link>
          <Link to="/admin">
            <button className="btn-admin">⚙️ Administrador</button>
          </Link>
        </div>
      </div>

      {notificacion && <div className="notificacion">{notificacion}</div>}

      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-group">
          <label>📌 Problema:</label>
          <select
            value={problemaSeleccionado}
            onChange={(e) => {
              const problema = e.target.value;
              setProblemaSeleccionado(problema);
              const problemaData = catalogoProblemas.find((p) => p.problema === problema);
              setCategoriaSeleccionada("");
              setSla(problemaData?.sla || "");
            }}
            required
          >
            <option value="">Seleccione un problema</option>
            {catalogoProblemas.map((p) => (
              <option key={p.id} value={p.problema}>
                {p.problema}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>📝 Descripción:</label>
          <textarea
            placeholder="Describe el problema"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>📂 Categoría:</label>
          <select
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            required
            disabled={!problemaSeleccionado}
          >
            <option value="">Seleccione una categoría</option>
            {problemaSeleccionado &&
              catalogoProblemas
                .find((p) => p.problema === problemaSeleccionado)
                ?.categorias.map((c, index) => (
                  <option key={index} value={c}>
                    {c}
                  </option>
                ))}
          </select>
        </div>

        <div className="form-group">
          <label>👤 Asignado a:</label>
          <select value={asignadoA} onChange={(e) => setAsignadoA(e.target.value)} required>
            <option value="">Seleccione un trabajador</option>
            {trabajadores.map((trabajador, index) => (
              <option key={index} value={trabajador}>
                {trabajador}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>⏳ SLA (Resolución):</label>
          <input type="text" value={sla} readOnly />
        </div>

        <div className="form-group">
          <label>⚠️ Importancia:</label>
          <select
            value={importancia}
            onChange={(e) => setImportancia(e.target.value)}
            required
          >
            <option value="">Seleccione una opción</option>
            <option value="Bajo">🟢 Bajo</option>
            <option value="Medio">🟡 Medio</option>
            <option value="Alto">🔴 Alto</option>
          </select>
        </div>

        <button type="submit" className="btn-submit">🚀 Crear Ticket</button>
      </form>
    </div>
  );
}
