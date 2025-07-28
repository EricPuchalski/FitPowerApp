import { Client } from "../model/Client";
import { User, Mail, Phone, Calendar, Target } from 'lucide-react';
import { Link } from "react-router-dom";

export const ClientCard = ({ client }: { client: Client }) => (
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border-l-4 border-blue-500">
    <div className="flex items-center mb-3">
      <div className="bg-blue-500 rounded-full p-2 mr-3">
        <User className="w-4 h-4 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-lg">
          {client.name} {client.lastName}
        </h3>
        <p className="text-gray-500 text-xs">DNI: {client.dni}</p>
      </div>
    </div>
    
    <div className="bg-blue-50 rounded-md p-3 mb-3 border border-blue-200">
      <div className="flex items-center mb-1">
        <Target className="w-4 h-4 text-blue-600 mr-2" />
        <span className="font-medium text-blue-800 text-xs uppercase">Objetivo</span>
      </div>
      <p className="text-blue-900 font-medium text-sm">{client.goal}</p>
    </div>
    
    <div className="space-y-2 mb-3">
      <div className="flex items-center text-gray-600">
        <Mail className="w-3 h-3 mr-2 text-gray-500" />
        <span className="text-xs">{client.email}</span>
      </div>
      <div className="flex items-center text-gray-600">
        <Phone className="w-3 h-3 mr-2 text-gray-500" />
        <span className="text-xs">{client.phoneNumber}</span>
      </div>
      <div className="flex items-center text-gray-600">
        <Calendar className="w-3 h-3 mr-2 text-gray-500" />
        <span className="text-xs">Creado: {new Date(client.createdAt).toLocaleDateString("es-ES")}</span>
      </div>
    </div>
    
    <div className="flex flex-col">
      <Link to={`/trainer/client/${client.dni}/training-plans`}>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors">
          Ver Cliente
        </button>
      </Link>
    </div>
  </div>
);