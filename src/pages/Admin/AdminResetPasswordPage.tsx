import { useState } from 'react';
import authService from '../../auth/service/AuthService';
import { FooterPag } from '../../components/Footer';
import { AdminHeader } from '../../components/AdminHeader'; // o TrainerHeader si querés usar ese

export default function ResetPasswordPage() {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.resetPassword(username, newPassword);
      setMessage(`Contraseña de ${username} reseteada con éxito`);
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
      <AdminHeader onLogout={function (): void {
        throw new Error('Function not implemented.');
      } } /> {/* */}

      <main className="flex-grow container mx-auto p-4 max-w-md">
        <h2 className="text-2xl mb-4">Resetear Contraseña de los Usuarios</h2>
        {message && <p className="mb-4 text-red-600">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Username del usuario</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block">Nueva Contraseña para el usuario</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded">
            Resetear
          </button>
        </form>
      </main>

      <FooterPag />
    </div>
  );
}
