import React from 'react';
import { Card, CardContent } from './ui/card';
import { BarChart3, Construction } from 'lucide-react';

export function ReportsManager() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Analytics</h1>
          <p className="text-gray-600 mt-1">Análisis de rentabilidad y desempeño del negocio</p>
        </div>
      </div>

      {/* Coming Soon Card */}
      <Card className="border-2 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="bg-green-100 p-4 rounded-full mb-6">
            <Construction className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Funcionalidad en Desarrollo
          </h2>
          <p className="text-gray-600 text-center max-w-md mb-6">
            El sistema de Reportes y Analytics está planificado para una próxima versión.
            Permitirá analizar ingresos, rentabilidad y métricas clave del negocio.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg max-w-2xl w-full">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Características Planificadas:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Dashboard de ingresos con gráficos interactivos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Análisis de rentabilidad por cliente y proyecto</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Reportes de cuentas por cobrar y pagos pendientes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Cash flow projections y análisis de tendencias</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Distribución de ingresos por tipo de servicio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Exportación a Excel/PDF de todos los reportes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Comparativas año a año y mes a mes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Reportes fiscales multi-jurisdicción</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            Por ahora, puedes ver métricas básicas en el <strong>Dashboard</strong>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
