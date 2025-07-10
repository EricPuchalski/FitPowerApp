import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../auth/service/AuthService';
import { FooterPag } from '../components/Footer';

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.changePassword(currentPassword, newPassword);
      setMessage('Contraseña actualizada con éxito');
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      if (err.response?.data) {
        const data = err.response.data;

        if (typeof data === 'object' && !Array.isArray(data)) {
          const validationMessages = Object.values(data).join(', ');
          setMessage(validationMessages);
        } else if (typeof data === 'string') {
          setMessage(data);
        } else if (data.message) {
          setMessage(data.message);
        } else {
          setMessage("Error desconocido");
        }
      } else {
        setMessage("Error desconocido");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-indigo-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">FITPOWER</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 max-w-md">
        <h2 className="text-2xl mb-4">Cambiar Contraseña</h2>
        {message && <p className="mb-4 text-red-600">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Contraseña Actual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block">Nueva Contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-800 text-white rounded">
            Guardar
          </button>
        </form>
      </main>

      <FooterPag />
    </div>
  );
}
