import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Dumbbell, BookOpen, TrendingUp } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { Link } from 'react-router-dom'
import { FooterPag } from './Footer'
import NavBarTrainer from './NavBarTrainer'
import { Client } from '../model/Client'

export default function TrainerClientList() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [dniFilter, setDniFilter] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const clientsPerPage = 20
  const email = localStorage.getItem("userEmail")
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token || !email) {
      console.error("Token o email no disponible")
      return
    }

    // Fetch clients from API
    fetch(`http://localhost:8080/api/trainers/clients-by-email/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setClients(data)
        setFilteredClients(data)
      })
      .catch((error) => console.error("Error fetching clients:", error))
  }, [token, email])

  useEffect(() => {
    // Filter clients by DNI
    const filtered = clients.filter(client =>
      client.dni.toLowerCase().includes(dniFilter.toLowerCase())
    )
    setFilteredClients(filtered)
    setCurrentPage(1) // Reset to the first page when filtering
  }, [dniFilter, clients])

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const indexOfLastClient = currentPage * clientsPerPage
  const indexOfFirstClient = indexOfLastClient - clientsPerPage
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient)

  return (
    <div className="flex flex-col min-h-screen">
      <NavBarTrainer />
      <div className="flex-grow mx-10">
        <Card className="w-full bg-white shadow-lg rounded-lg my-9">
          <CardHeader className="bg-[#120c41] text-white">
            <CardTitle className="text-lg font-bold">Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label htmlFor="dniFilter" className="block text-[#331b64] my-3">Filtrar por DNI:</label>
              <input
                id="dniFilter"
                type="text"
                value={dniFilter}
                onChange={(e) => setDniFilter(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            {currentClients.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No hay clientes asociados en este momento.</p>
            ) : (
              <Table className="min-w-full bg-white">
                <TableHeader className="bg-gray-200 text-gray-900">
                  <TableRow>
                    <TableHead className="w-[200px] py-2">Nombre</TableHead>
                    <TableHead className="py-2">Apellido</TableHead>
                    <TableHead className="py-2">DNI</TableHead>
                    <TableHead className="py-2">Objetivos</TableHead>
                    <TableHead className="py-2">Plan de Entrenamiento</TableHead>
                    <TableHead className="py-2">Diarios de Entrenamiento</TableHead>
                    <TableHead className="py-2">Rendimiento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentClients.map((client) => (
                    <React.Fragment key={client.id}>
                      <TableRow className="hover:bg-gray-100 transition-colors">
                        <TableCell className="font-medium py-2">{client.name}</TableCell>
                        <TableCell className="py-2">{client.lastname}</TableCell>
                        <TableCell className="py-2">{client.dni}</TableCell>
                        <TableCell className="py-2">{client.goal}</TableCell>
                        <TableCell className="py-2">
                          <Link to={`/trainer/client/${client.dni}/training-plan`} className="text-blue-500 hover:underline">
                            Ver detalles
                          </Link>
                        </TableCell>
                        <TableCell className="py-2">
                          <Link to={`/trainer/client/${client.dni}/training-logs`} className="text-blue-500 hover:underline">
                            Ver detalles
                          </Link>
                        </TableCell>
                        <TableCell className="py-2">
                          <Link to={`/trainer/client/${client.dni}/charts`} className="text-blue-500 hover:underline">
                            Ver detalles
                          </Link>
                        </TableCell>
                      </TableRow>
                      {expandedRow === client.id && (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <div className="p-4 bg-gray-100 rounded-lg">
                              <div className="mb-4 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700">
                                <p className="font-bold text-lg">
                                  El cliente tiene como objetivo "{client.goal}", mide {client.height} cm, pesa {client.weight} kg y su dirección es {client.address}.
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="flex justify-between mt-4">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Anterior
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={indexOfLastClient >= filteredClients.length}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Siguiente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <FooterPag />
    </div>
  )
}
