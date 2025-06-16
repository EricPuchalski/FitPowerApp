import { useState } from "react"; // Importar useState
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { FooterPag } from "./Footer";
import { useNavigate } from "react-router-dom";

export default function LogIn() {
  const navigate = useNavigate();

  // Estado para manejar el email y la contraseña
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Estado para manejar errores

  // Función para manejar el inicio de sesión
  const login = async (e:any) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Enviar username y contraseña
      });

      const data = await response.json();
      if (response.ok) {
        // Almacenar el token en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.roles[0]); // Almacenar el rol del primer elemento en el array de roles
        localStorage.setItem('userId', data.id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userDni', data.dni);
        localStorage.setItem('gymName', data.gymName);


        // Redirigir al dashboard según el rol
        if (data.roles.includes("ROLE_NUTRITIONIST")) {
          navigate("/nutritionist");
        } else if (data.roles.includes("ROLE_CLIENT")) {
          navigate("/client");
        } else if (data.roles.includes("ROLE_TRAINER")) {
          navigate("/trainer/clients");
        } else if (data.roles.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/"); // Redirigir a una ruta por defecto si el rol no coincide
        }
      } else {
        setError(data.message || "Error en la autenticación."); // Mostrar mensaje de error
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Error en la autenticación. Por favor, inténtelo de nuevo.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#220901] relative">
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gym-5364404_1280-WLCaZmCO874uBuOz60BJlhr8Tnm6iv.jpg')", opacity: 0.6 }}></div>
        <div className="bg-[#110814] p-8 rounded-lg shadow-xl shadow-[#444245] w-96 z-10">
          <h2 className="text-3xl font-bold mb-6 text-[#F6AA1C] text-center">FitPower</h2>
          {error && <p className="text-red-500 text-center">{error}</p>} {/* Mostrar error */}
          <form className="space-y-4" onSubmit={login}> {/* Manejar el submit aquí */}
            <div>
              <Label htmlFor="username" className="text-[#F6AA1C]">User</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="Enter your username" 
                value={username} // Vincular el valor
                onChange={(e) => setUsername(e.target.value)} // Actualizar el estado
                className="bg-[#110814] text-[#F6AA1C] placeholder-[#F6AA1C] placeholder-opacity-50 border-[#F6AA1C] focus:border-[#F6AA1C] focus:ring-[#F6AA1C]" 
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-[#F6AA1C]">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                value={password} // Vincular el valor
                onChange={(e) => setPassword(e.target.value)} // Actualizar el estado
                className="bg-[#110814] text-[#F6AA1C] placeholder-[#F6AA1C] placeholder-opacity-50 border-[#F6AA1C] focus:border-[#F6AA1C] focus:ring-[#F6AA1C]" 
              />
            </div>
            <Button type="submit" className="w-full bg-[#F6AA1C] text-[#220901] hover:bg-opacity-90 focus:ring-[#F6AA1C]">
              Log In
            </Button>
          </form>
          <p className="mt-4 text-center text-[#F6AA1C] text-sm">
            Don't have an account? <a href="#" className="text-[#F6AA1C] hover:underline">Sign up</a>
          </p>
        </div>
      </div>
      <FooterPag />
    </>
  );
}
