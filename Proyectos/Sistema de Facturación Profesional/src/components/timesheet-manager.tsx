import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Clock, Construction } from 'lucide-react';

export function TimesheetManager() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timesheet</h1>
          <p className="text-gray-600 mt-1">Registro y aprobación de horas trabajadas</p>
        </div>
      </div>

      {/* Coming Soon Card */}
      <Card className="border-2 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="bg-blue-100 p-4 rounded-full mb-6">
            <Construction className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Funcionalidad en Desarrollo
          </h2>
          <p className="text-gray-600 text-center max-w-md mb-6">
            El sistema de Timesheet está planificado para una próxima versión.
            Permitirá registrar horas trabajadas, aprobarlas y vincularlas con facturas.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg max-w-2xl w-full">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Características Planificadas:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Cronómetro para registro de tiempo en tiempo real</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Registro manual de horas por proyecto/tarea</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Sistema de aprobación de horas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Integración con proyectos y facturación</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Reportes de horas facturables vs no facturables</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Soporte multi-moneda para tarifas por hora</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            Por ahora, puedes gestionar tus <strong>Clientes</strong> y <strong>Facturas</strong> desde el menú lateral
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
