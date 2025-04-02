import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login: React.FC = () => {
  const [correo, setCorreo] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post<{ token: string }>('http://localhost:8080/login', {
        correo,
        pass,
      });

      const { token } = response.data;
      localStorage.setItem('jwt_token', token);
      alert('Login exitoso');
      navigate("/Dashboard");
    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="image-container">
          <img
            src="https://busbud.imgix.net/operator-logos/Civa.png?h={height}&w={width}&auto=format&fit=fill&bg=0FFF"
            alt="Logo"
            className="login-logo"
            style={{ width: '200px' }}
          />
        </div>

        <h2 className="login-title">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="correo" className="label">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              className="input"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="pass" className="label">Contraseña</label>
            <input
              type="password"
              id="pass"
              className="input"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
