import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
  Calendar,
  Euro,
  Loader2
} from 'lucide-react';
import { invoicesAPI, clientsAPI } from '../lib/api';

interface DashboardStats {
  totalClients: number;
  totalInvoices: number;
  totalRevenue: number;
  pendingAmount: number;
  recentInvoices: any[];
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    pendingAmount: 0,
    recentInvoices: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch clients and invoices in parallel
      const [clientsData, invoicesData] = await Promise.all([
        clientsAPI.getAll(),
        invoicesAPI.getAll()
      ]);

      // Calculate stats from real data
      // Normalizar estados a mayúsculas para comparación
      const normalizeStatus = (status: string) => (status || '').toUpperCase();
      
      const totalRevenue = invoicesData
        .filter((inv: any) => normalizeStatus(inv.status) === 'PAID')
        .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);

      const pendingAmount = invoicesData
        .filter((inv: any) => {
          const status = normalizeStatus(inv.status);
          return ['SENT', 'PENDING', 'OVERDUE', 'DRAFT'].includes(status);
        })
        .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);
      
      // Total facturado (todas las facturas, independientemente del estado)
      const totalInvoiced = invoicesData
        .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);

      // Get 5 most recent invoices
      const recentInvoices = invoicesData
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      setStats({
        totalClients: clientsData.length,
        totalInvoices: invoicesData.length,
        totalRevenue: totalRevenue, // Solo facturas pagadas
        pendingAmount,
        recentInvoices
      });
      
      // Log para debugging
      console.log('Dashboard stats:', {
        totalClients: clientsData.length,
        totalInvoices: invoicesData.length,
        totalRevenue,
        totalInvoiced,
        pendingAmount,
        invoices: invoicesData.map((inv: any) => ({
          number: inv.invoiceNumber,
          total: inv.total,
          status: inv.status,
          currency: inv.currency
        }))
      });
    } catch (err: any) {
      console.error('Error loading dashboard:', err);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = (status || '').toUpperCase();
    switch (normalizedStatus) {
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SENT': return 'bg-blue-100 text-blue-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'ACTIVE': return 'bg-blue-100 text-blue-800'; // Para facturas activas
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const normalizedStatus = (status || '').toUpperCase();
    switch (normalizedStatus) {
      case 'PAID': return 'Pagada';
      case 'PENDING': return 'Pendiente';
      case 'SENT': return 'Enviada';
      case 'OVERDUE': return 'Vencida';
      case 'DRAFT': return 'Borrador';
      case 'ACTIVE': return 'Activa';
      default: return status;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumen ejecutivo - Datos reales</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Última actualización: {new Date().toLocaleDateString('es-ES')}</span>
        </div>
      </div>

      {/* KPI Cards - DATOS REALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facturado</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              Facturas pagadas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              Total de clientes registrados
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facturas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvoices}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              Todas las facturas emitidas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendiente de Cobro</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.pendingAmount)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3 mr-1 text-orange-500" />
              Enviadas y pendientes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices - DATOS REALES */}
      <Card>
        <CardHeader>
          <CardTitle>Facturas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentInvoices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No hay facturas todavía</p>
              <p className="text-sm mt-1">Crea tu primera factura para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentInvoices.map((invoice: any) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Cliente ID: {invoice.clientId.substring(0, 8)}...
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Creada: {formatDate(invoice.createdAt)}
                      {invoice.dueDate && ` • Vence: ${formatDate(invoice.dueDate)}`}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-semibold text-lg">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </div>
                    <Badge className={`${getStatusColor(invoice.status)} mt-2`}>
                      {getStatusLabel(invoice.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">
                Dashboard con Datos Reales
              </h3>
              <p className="text-sm text-blue-800">
                Este dashboard muestra información actualizada desde la base de datos PostgreSQL.
                Los datos se refrescan automáticamente al cargar la página.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
