import { Link } from "react-router-dom";
import '/src/Styles/Home.css'; // Asegúrate de importar el archivo CSS

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="title">Bienvenido al Sistema de Gestión de Tickets</h1>
        <p className="description">Gestiona tus problemas técnicos de manera eficiente.</p>
        <Link to="/tickets">
          <button className="btn-go">Ir a Tickets</button>
        </Link>
      </div>
      <div className="water-drop"></div> {/* Gota de agua decorativa */}
    </div>
  );
}
