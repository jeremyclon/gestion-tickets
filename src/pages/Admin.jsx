import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth"; // Importa signOut
import '/src/Styles/Admin.css'; // Asegúrate de importar los estilos

const trabajadores = ["Jeremy Tuitice", "María Gómez", "Carlos Ramírez", "Ana Torres"];

export default function Admin() {
  const [tickets, setTickets] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [asignadoFiltro, setAsignadoFiltro] = useState("Todos");
  const navigate = useNavigate();
  const auth = getAuth();

  // Verificar si el usuario está autenticado y es admin
  useEffect(() => {
    if (!auth.currentUser || auth.currentUser.email !== "admin@admin.com") {
      navigate("/login"); // Redirigir a login si no es admin
    }
  }, [auth, navigate]);

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

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const ticketRef = doc(db, "tickets", id);
      await updateDoc(ticketRef, { estado: nuevoEstado });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  // Filtrar los tickets según el estado y el trabajador asignado
  const ticketsFiltrados = tickets.filter((ticket) => 
    (estadoFiltro === "Todos" || ticket.estado === estadoFiltro) && 
    (asignadoFiltro === "Todos" || ticket.asignadoA === asignadoFiltro)
  );

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirigir al login después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="admin-container">
      <div className="ticket-header">
        <h1>Lista de Tickets (Administrador)</h1>
        <Link to="/">
          <button className="btn-regresar">Regresar a Inicio</button>
        </Link>
        <button className="btn-logout" onClick={handleLogout}>
          Cerrar sesión
        </button> {/* Botón de cerrar sesión */}
      </div>

      <h2>Filtrar por Estado</h2>
      <select
        onChange={(e) => setEstadoFiltro(e.target.value)}
        value={estadoFiltro}
      >
        <option value="Todos">Todos</option>
        <option value="Abierto">Abierto</option>
        <option value="En proceso">En proceso</option>
        <option value="Resuelto">Resuelto</option>
      </select>

      <h2>Filtrar por Asignado a</h2>
      <select
        onChange={(e) => setAsignadoFiltro(e.target.value)}
        value={asignadoFiltro}
      >
        <option value="Todos">Todos</option>
        {trabajadores.map((trabajador) => (
          <option key={trabajador} value={trabajador}>
            {trabajador}
          </option>
        ))}
      </select>

      <h2>Tickets Registrados</h2>
      <ul className="ticket-list">
        {ticketsFiltrados.map((ticket) => (
          <li key={ticket.id}>
            <strong>{ticket.problema}</strong> - {ticket.categoria}
            <p>{ticket.descripcion}</p>
            <p>📌 <strong>Asignado a:</strong> {ticket.asignadoA}</p>
            <p>⏳ <strong>SLA:</strong> {ticket.sla}</p>
            <p>🔄 <strong>Estado:</strong> {ticket.estado}</p>
            <p>⚠️ <strong>Importancia:</strong> {ticket.importancia}</p>

            <label>Cambiar estado:</label>
            <select
              value={ticket.estado}
              onChange={(e) =>
                actualizarEstado(ticket.id, e.target.value)
              }
            >
              <option value="Abierto">Abierto</option>
              <option value="En proceso">En proceso</option>
              <option value="Resuelto">Resuelto</option>
            </select>
          </li>
        ))}
      </ul>

      <div className="water-drop"></div> {/* Gota de agua decorativa */}
    </div>
  );
}
