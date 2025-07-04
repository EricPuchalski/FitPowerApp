//src/components/Login.tsx
import { useState, FormEvent } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { FooterPag } from "./Footer";
import { useNavigate } from "react-router-dom";
import authService from "../auth/service/AuthService";

export default function LogIn() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userData = await authService.login({ username, password });
      
      // Redirigir según el rol usando el método del servicio
      const redirectPath = authService.getRedirectPath(userData.roles);
      navigate(redirectPath);
      
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      setError(error.message || "Error desconocido. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#220901] relative">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ 
            backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gym-5364404_1280-WLCaZmCO874uBuOz60BJlhr8Tnm6iv.jpg')", 
            opacity: 0.6 
          }}
        />
        <div className="bg-[#110814] p-8 rounded-lg shadow-xl shadow-[#444245] w-96 z-10">
          <h2 className="text-3xl font-bold mb-6 text-[#F6AA1C] text-center">FitPower</h2>
          
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <form className="space-y-4" onSubmit={login}>
            <div>
              <Label htmlFor="username" className="text-[#F6AA1C] block mb-2">
                Usuario
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Ingrese su nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#110814] text-[#F6AA1C] placeholder-[#F6AA1C]/50 border-[#F6AA1C] focus:ring-[#F6AA1C] focus:border-[#F6AA1C]"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-[#F6AA1C] block mb-2">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#110814] text-[#F6AA1C] placeholder-[#F6AA1C]/50 border-[#F6AA1C] focus:ring-[#F6AA1C] focus:border-[#F6AA1C]"
                required
                disabled={loading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#F6AA1C] hover:bg-[#F6AA1C]/90 text-[#220901] font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
          
          <p className="mt-6 text-center text-[#F6AA1C] text-sm">
            ¿No tienes una cuenta?{' '}
            <a href="#" className="text-[#F6AA1C] hover:underline font-medium">
              Regístrate
            </a>
          </p>
        </div>
      </div>
      <FooterPag />
    </>
  );
}