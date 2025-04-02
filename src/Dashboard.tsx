import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

interface Bus {
  bus_id: number;
  numeroBus: string;
  placa: string;
  marcaNom: string;
  fecha_crea: string;
  caracteristicas: string;
  activo: boolean;
}

const Dashboard: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate("/");
    } else {
      fetchBuses(page);
    }
  }, [page, navigate]);

  const fetchBuses = async (pageNumber: number) => {
    try {
      const response = await fetch(`http://localhost:8080/bus?page=${pageNumber}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los buses");
      }
      const data = await response.json();
      setBuses(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusDetails = async (bus_id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/bus/${bus_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener detalles del bus");
      }
      const data: Bus = await response.json();

      alert(`Bus ID: ${data.bus_id}\nNumero de Bus: ${data.numeroBus}\nPlaca: ${data.placa}\nFecha de Creacion: ${data.fecha_crea}\nCaracteristicas: ${data.caracteristicas}\nActivos: ${data.activo}\nNombre de Marca: ${data.marcaNom}`);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <button onClick={handleLogout} className="logout-button">
        Cerrar Sesión
      </button>
      <h2>Lista de Buses</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <table >
            <thead>
              <tr>
                <th>ID</th>
                <th>NumeroBus</th>
                <th>Placa</th>
                <th>Marca</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus.bus_id}>
                  <td>{bus.bus_id}</td>
                  <td>{bus.numeroBus}</td>
                  <td>{bus.placa}</td>
                  <td>{bus.marcaNom}</td>
                  <td>
                    <button onClick={() => fetchBusDetails(bus.bus_id)}>Ver Detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button disabled={page === 0} onClick={() => setPage(page - 1)}>
              Anterior
            </button>
            <span>
              Página {page + 1} de {totalPages}
            </span>
            <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
