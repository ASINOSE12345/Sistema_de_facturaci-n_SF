import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Building2, 
  Globe, 
  Phone, 
  Mail,
  MapPin,
  DollarSign,
  Calendar,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDate } from '../lib/formatters';
import { CURRENCIES, COUNTRIES, PAYMENT_TERMS } from '../lib/constants';
import type { Client, ClientStatus, CreateClientDTO } from '../types';
import { useClients } from '../hooks/useClients';

/* Mock data - mantener por si falla API
const mockClients: Client[] = [
  {
    id: '1',
    businessName: 'TechCorp SA',
    contactName: 'María González',
    email: 'maria@techcorp.com',
    phone: '+1-555-0123',
    country: 'Estados Unidos',
    taxId: '12-3456789',
    address: '123 Tech Street, Silicon Valley, CA',
    currency: 'USD',
    taxRate: 0,
    paymentTerms: 30,
    status: 'active',
    totalInvoiced: 125750,
    lastInvoice: '2024-10-01',
    projects: 3,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-10-01')
  },
  {
    id: '2',
    businessName: 'Startup Innovadora SL',
    contactName: 'Carlos Ruiz',
    email: 'carlos@startup.es',
    phone: '+34-600-123456',
    country: 'España',
    taxId: 'B12345678',
    address: 'Calle Innovación 45, Madrid, España',
    currency: 'EUR',
    taxRate: 21,
    paymentTerms: 15,
    status: 'active',
    totalInvoiced: 89500,
    lastInvoice: '2024-10-03',
    projects: 2,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-10-03')
  },
  {
    id: '3',
    businessName: 'Industrias Digitales SA',
    contactName: 'Ana López',
    email: 'ana@industriasdigitales.com.ar',
    phone: '+54-11-4567-8900',
    country: 'Argentina',
    taxId: '30-12345678-9',
    address: 'Av. Corrientes 1234, CABA, Argentina',
    currency: 'ARS',
    taxRate: 21,
    paymentTerms: 45,
    status: 'active',
    totalInvoiced: 2850000,
    lastInvoice: '2024-09-28',
    projects: 1,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-09-28')
  },
  {
    id: '4',
    businessName: 'México Tech Solutions',
    contactName: 'Diego Hernández',
    email: 'diego@mexicotech.mx',
    phone: '+52-55-1234-5678',
    country: 'México',
    taxId: 'RFC123456789',
    address: 'Polanco, Ciudad de México, México',
    currency: 'MXN',
    taxRate: 16,
    paymentTerms: 30,
    status: 'inactive',
    totalInvoiced: 156000,
    lastInvoice: '2024-08-15',
    projects: 0,
    createdAt: new Date('2023-12-05'),
    updatedAt: new Date('2024-08-15')
  }
];
*/

export function ClientsManager() {
  // Conectar con API real
  const {
    clients,
    loading: apiLoading,
    error: apiError,
    createClient: createClientAPI,
    updateClient: updateClientAPI,
    deleteClient: deleteClientAPI,
  } = useClients();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const filteredClients = clients.filter(client =>
    client.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    
    // Debug logging - ver qué datos está capturando el formulario
    console.log('🔍 FORM - Raw FormData:');
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    const clientData: CreateClientDTO = {
      businessName: formData.get('businessName') as string,
      contactName: formData.get('contactName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || undefined,
      taxId: formData.get('taxId') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string || undefined,
      state: formData.get('state') as string || undefined,
      postalCode: formData.get('postalCode') as string || undefined,
      country: formData.get('country') as string || 'US',
      currency: (formData.get('currency') as any) || 'USD',
      taxRate: parseFloat(formData.get('taxRate') as string) || 0,
      paymentTerms: parseInt(formData.get('paymentTerms') as string) || 30,
    };
    
    // Debug logging - ver qué datos se están enviando
    console.log('🔍 FORM - Processed clientData:', JSON.stringify(clientData, null, 2));
    
    try {
      setFormLoading(true);
      await createClientAPI(clientData);
      toast.success('Cliente creado exitosamente');
      setIsCreateDialogOpen(false);
      e.currentTarget.reset();
    } catch (err: any) {
      toast.error(err.message || 'Error al crear cliente');
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setIsViewDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditDialogOpen(true);
  };

  const handleUpdateClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedClient) return;
    
    const formData = new FormData(e.currentTarget);
    const clientData: Partial<Client> = {
      businessName: formData.get('businessName') as string,
      contactName: formData.get('contactName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || undefined,
      taxId: formData.get('taxId') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string || undefined,
      state: formData.get('state') as string || undefined,
      postalCode: formData.get('postalCode') as string || undefined,
      country: formData.get('country') as string || 'US',
      currency: (formData.get('currency') as any) || 'USD',
      taxRate: parseFloat(formData.get('taxRate') as string) || 0,
      paymentTerms: parseInt(formData.get('paymentTerms') as string) || 30,
    };
    
    try {
      setFormLoading(true);
      await updateClientAPI(selectedClient.id, clientData);
      toast.success('Cliente actualizado exitosamente');
      setIsEditDialogOpen(false);
      setSelectedClient(null);
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar cliente');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-600 mt-1">Administra tu base de clientes global</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto w-[90vw]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Complete la información del cliente para agregarlo a su base de datos.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateClient} className="space-y-6 p-2">
              <div className="w-full space-y-6">
                
                {/* Información Básica - Siempre visible */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Información Básica</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">Razón Social *</Label>
                      <Input id="businessName" name="businessName" placeholder="Nombre de la empresa" required />
                    </div>
                    <div>
                      <Label htmlFor="contactName">Contacto Principal *</Label>
                      <Input id="contactName" name="contactName" placeholder="Nombre del contacto" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" placeholder="contacto@empresa.com" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" name="phone" placeholder="+1-307-555-0123" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Dirección *</Label>
                    <Textarea id="address" name="address" placeholder="Dirección completa de la empresa" required />
                  </div>
                </div>

                {/* Datos Fiscales - Siempre visible */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Datos Fiscales</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">País *</Label>
                      <select name="country" id="country" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" defaultValue="US">
                        {COUNTRIES.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="taxId">Identificación Fiscal (EIN) *</Label>
                      <Input id="taxId" name="taxId" placeholder="12-3456789" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ciudad</Label>
                      <Input id="city" name="city" placeholder="Cheyenne" />
                    </div>
                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Input id="state" name="state" placeholder="WY" defaultValue="WY" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Código Postal</Label>
                    <Input id="postalCode" name="postalCode" placeholder="82001" />
                  </div>
                </div>

                {/* Condiciones - Siempre visible */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Condiciones</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currency">Moneda de Facturación *</Label>
                      <select name="currency" id="currency" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" defaultValue="USD">
                        {CURRENCIES.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="taxRate">Tasa de Impuesto (%)</Label>
                      <Input id="taxRate" name="taxRate" type="number" placeholder="0" min="0" max="100" defaultValue="0" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="paymentTerms">Términos de Pago (días)</Label>
                    <select name="paymentTerms" id="paymentTerms" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" defaultValue="30">
                      {PAYMENT_TERMS.map((term) => (
                        <option key={term.value} value={term.value}>
                          {term.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? 'Creando...' : 'Crear Cliente'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Error Alert */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          <strong>Error:</strong> {apiError}
        </div>
      )}

      {/* Loading State */}
      {apiLoading && clients.length === 0 && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando clientes...</p>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, empresa o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por país" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los países</SelectItem>
                <SelectItem value="US">Estados Unidos</SelectItem>
                <SelectItem value="ES">España</SelectItem>
                <SelectItem value="AR">Argentina</SelectItem>
                <SelectItem value="MX">México</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>País/Moneda</TableHead>
                <TableHead>Total Facturado</TableHead>
                <TableHead>Última Factura</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{client.businessName}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {client.taxId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{client.contactName}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span>{client.country}</span>
                      <Badge variant="outline">{client.currency}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {formatCurrency(client.totalInvoiced, client.currency)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {client.projects} proyecto(s)
                    </div>
                  </TableCell>
                  <TableCell>
                    {client.lastInvoice ? formatDate(client.lastInvoice) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={client.status} type="client" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewClient(client)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditClient(client)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Client Details Modal */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto w-[92vw]">
          <DialogHeader>
            <DialogTitle>Detalles del Cliente</DialogTitle>
            <DialogDescription>
              Información completa y historial del cliente seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información General</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{selectedClient.businessName}</div>
                        <div className="text-sm text-gray-500">{selectedClient.taxId}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{selectedClient.contactName}</div>
                        <div className="text-sm text-gray-500">{selectedClient.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{selectedClient.phone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <span className="text-sm">{selectedClient.address}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Configuración Fiscal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">País:</span>
                      <span className="font-medium">{selectedClient.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Moneda:</span>
                      <Badge variant="outline">{selectedClient.currency}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tasa de Impuesto:</span>
                      <span className="font-medium">{selectedClient.taxRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Términos de Pago:</span>
                      <span className="font-medium">{selectedClient.paymentTerms} días</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <StatusBadge status={selectedClient.status} type="client" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumen Financiero</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(selectedClient.totalInvoiced, selectedClient.currency)}
                      </div>
                      <div className="text-sm text-gray-600">Total Facturado</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">{selectedClient.projects}</div>
                      <div className="text-sm text-gray-600">Proyectos Activos</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600">{selectedClient.lastInvoice}</div>
                      <div className="text-sm text-gray-600">Última Factura</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Client Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto w-[90vw]">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Modifica la información del cliente seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <form onSubmit={handleUpdateClient} className="space-y-6 p-2">
              <div className="w-full space-y-6">
                
                {/* Información Básica - Siempre visible */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Información Básica</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-businessName">Razón Social *</Label>
                      <Input 
                        id="edit-businessName" 
                        name="businessName" 
                        placeholder="Nombre de la empresa" 
                        defaultValue={selectedClient.businessName}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-contactName">Contacto Principal *</Label>
                      <Input 
                        id="edit-contactName" 
                        name="contactName" 
                        placeholder="Nombre del contacto" 
                        defaultValue={selectedClient.contactName}
                        required 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-email">Email *</Label>
                      <Input 
                        id="edit-email" 
                        name="email" 
                        type="email" 
                        placeholder="contacto@empresa.com" 
                        defaultValue={selectedClient.email}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-phone">Teléfono</Label>
                      <Input 
                        id="edit-phone" 
                        name="phone" 
                        placeholder="+1-307-555-0123" 
                        defaultValue={selectedClient.phone || ''}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-address">Dirección *</Label>
                    <Textarea 
                      id="edit-address" 
                      name="address" 
                      placeholder="Dirección completa de la empresa" 
                      defaultValue={selectedClient.address}
                      required 
                    />
                  </div>
                </div>

                {/* Datos Fiscales - Siempre visible */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Datos Fiscales</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-country">País *</Label>
                      <select 
                        name="country" 
                        id="edit-country" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" 
                        defaultValue={selectedClient.country}
                      >
                        {COUNTRIES.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="edit-taxId">Identificación Fiscal (EIN) *</Label>
                      <Input 
                        id="edit-taxId" 
                        name="taxId" 
                        placeholder="12-3456789" 
                        defaultValue={selectedClient.taxId}
                        required 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-city">Ciudad</Label>
                      <Input 
                        id="edit-city" 
                        name="city" 
                        placeholder="Cheyenne" 
                        defaultValue={selectedClient.city || ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-state">Estado</Label>
                      <Input 
                        id="edit-state" 
                        name="state" 
                        placeholder="WY" 
                        defaultValue={selectedClient.state || ''}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-postalCode">Código Postal</Label>
                    <Input 
                      id="edit-postalCode" 
                      name="postalCode" 
                      placeholder="82001" 
                      defaultValue={selectedClient.postalCode || ''}
                    />
                  </div>
                </div>

                {/* Condiciones - Siempre visible */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Condiciones</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-currency">Moneda de Facturación *</Label>
                      <select 
                        name="currency" 
                        id="edit-currency" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" 
                        defaultValue={selectedClient.currency}
                      >
                        {CURRENCIES.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="edit-taxRate">Tasa de Impuesto (%)</Label>
                      <Input 
                        id="edit-taxRate" 
                        name="taxRate" 
                        type="number" 
                        placeholder="0" 
                        min="0" 
                        max="100" 
                        defaultValue={selectedClient.taxRate}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-paymentTerms">Términos de Pago (días)</Label>
                    <select 
                      name="paymentTerms" 
                      id="edit-paymentTerms" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" 
                      defaultValue={selectedClient.paymentTerms}
                    >
                      {PAYMENT_TERMS.map((term) => (
                        <option key={term.value} value={term.value}>
                          {term.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? 'Actualizando...' : 'Actualizar Cliente'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}