'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Trash } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

type ClientStats = {
  id: number
  weight: number
  height: number
  bodymass: number
  bodyfat: number
  creationDate: string
}

interface PhysicalStatusHistoryProps {
  clientStats: ClientStats[]
}

export default function PhysicalStatusHistory({ clientStats }: PhysicalStatusHistoryProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const handleDelete = (id: number) => {
    // Lógica para eliminar el registro
    console.log(`Eliminando registro con ID: ${id}`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  const offset = currentPage * itemsPerPage;
  const currentItems = clientStats.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(clientStats.length / itemsPerPage);

  return (
    <Card className="w-full bg-white    ">
      <CardHeader>
        <CardTitle>Historial de Estados Físicos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peso (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Altura (cm)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grasa corporal (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Masa muscular (cm)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((stat) => (
                <React.Fragment key={stat.id}>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(stat.creationDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.weight}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.bodyfat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.bodymass}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center space-x-2">
  
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(stat.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                  {expandedRow === stat.id && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="font-semibold text-gray-700">Grasa Corporal:</p>
                            <p className="text-gray-900">{stat.bodyfat}%</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Masa Muscular:</p>
                            <p className="text-gray-900">{stat.bodymass} kg</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <button
              className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Anterior
            </button>
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                className={`px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 ${currentPage === index ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => handlePageChange(index)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pageCount - 1}
            >
              Siguiente
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
