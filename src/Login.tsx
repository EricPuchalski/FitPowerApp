import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"

export default function LogIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#220901] relative">
      <div className="absolute inset-0 bg-cover bg-center z-0 " style={{backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gym-5364404_1280-WLCaZmCO874uBuOz60BJlhr8Tnm6iv.jpg')", opacity: 0.6}}></div>
      <div className="bg-[#110814] p-8 rounded-lg shadow-xl shadow-[#444245] w-96 z-10">
        <h2 className="text-3xl font-bold mb-6 text-[#F6AA1C] text-center">FitFlow</h2>
        <form className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-[#F6AA1C]">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              className="bg-[#110814] text-[#F6AA1C] placeholder-[#F6AA1C] placeholder-opacity-50 border-[#F6AA1C] focus:border-[#F6AA1C] focus:ring-[#F6AA1C]" 
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-[#F6AA1C]">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter your password" 
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
  )
}