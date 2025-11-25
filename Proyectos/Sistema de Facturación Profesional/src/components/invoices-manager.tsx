import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';
import { invoicesAPI } from '../lib/api';
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Download,
  Send,
  CreditCard,
  FileText,
  DollarSign,
  Calendar,
  Globe,
  Building2,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDate, calculateDaysOverdue } from '../lib/formatters';
import { CURRENCIES, PAYMENT_TERMS } from '../lib/constants';
import type { Invoice, Currency } from '../types';
import { useInvoices } from '../hooks/useInvoices';
import { useClients } from '../hooks/useClients';
import { useProjects } from '../hooks/useProjects';

/* Mock data - comentado, ahora usa API
const mockInvoices: Invoice[] = [
  {
    id: 'WY-INV-2024-001',
    invoiceNumber: 'WY-INV-2024-001',
    invoiceDate: new Date('2024-10-01'),
    dueDate: new Date('2024-10-31'),
    clientId: '1',
    clientEmail: 'maria@techcorp.com',
    clientAddress: '123 Tech Street, Silicon Valley, CA',
    taxIdClient: '12-3456789',
    jurisdiction: 'USA',
    currency: 'USD',
    subtotal: 15750,
    taxRate: 4, // Wyoming sales tax
    taxAmount: 630,
    discount: 0,
    total: 16380,
    status: 'paid',
    paidDate: new Date('2024-10-15'),
    paymentMethod: 'Bank Transfer',
    items: [
      { description: 'Backend Development - IoT System', hours: 120, rate: 85, amount: 10200 },
      { description: 'IoT Solutions - Sensor Integration', hours: 60, rate: 95, amount: 5700 },
      { description: 'Technical Consulting', hours: 0, rate: 0, amount: -150 }
    ],
    notes: 'Invoice for IoT agricultural system development - Phase 1',
    paymentTerms: 30,
    sentDate: '2024-10-01',
    language: 'en',
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-10-15')
  },
  {
    id: 'WY-INV-2024-002',
    invoiceNumber: 'WY-INV-2024-002',
    invoiceDate: new Date('2024-10-03'),
    dueDate: new Date('2024-10-18'),
    clientId: '2',
    clientEmail: 'contact@startup.com',
    clientAddress: '456 Innovation Ave, San Francisco, CA',
    taxIdClient: '98-7654321',
    jurisdiction: 'USA',
    currency: 'USD',
    subtotal: 7350,
    taxRate: 4,
    taxAmount: 294,
    discount: 0,
    total: 7644,
    status: 'pending',
    paymentMethod: undefined,
    items: [
      { description: 'AI/ML Development - Recommendation Model', hours: 48, rate: 100, amount: 4800 },
      { description: 'Frontend Development - AI Integration', hours: 34, rate: 75, amount: 2550 }
    ],
    notes: 'E-commerce AI platform development - Milestone 1',
    paymentTerms: 15,
    sentDate: '2024-10-03',
    language: 'en',
    createdAt: new Date('2024-10-03'),
    updatedAt: new Date('2024-10-03')
  },
  {
    id: 'WY-INV-2024-003',
    invoiceNumber: 'WY-INV-2024-003',
    invoiceDate: new Date('2024-09-28'),
    dueDate: new Date('2024-10-28'),
    clientId: '3',
    clientEmail: 'ana@digitalindustries.com',
    clientAddress: '789 Business Park, Austin, TX',
    taxIdClient: '45-1234567',
    jurisdiction: 'USA',
    currency: 'USD',
    subtotal: 18500,
    taxRate: 0, // Out of state, no nexus
    taxAmount: 0,
    discount: 0,
    total: 18500,
    status: 'overdue',
    paymentMethod: undefined,
    items: [
      { description: 'Analysis and Consulting - Banking App', hours: 32, rate: 350, amount: 11200 },
      { description: 'Technical Documentation', hours: 35, rate: 200, amount: 7000 },
      { description: 'Project Management', hours: 15, rate: 180, amount: 300 }
    ],
    notes: 'Professional services for banking application development',
    paymentTerms: 30,
    sentDate: '2024-09-28',
    language: 'en',
    createdAt: new Date('2024-09-28'),
    updatedAt: new Date('2024-09-28')
  },
  {
    id: 'WY-INV-2024-004',
    invoiceNumber: 'WY-INV-2024-004',
    invoiceDate: new Date('2024-10-05'),
    dueDate: new Date('2024-11-04'),
    clientId: '4',
    clientEmail: 'contact@globalsolutions.com',
    clientAddress: '321 Broadway, New York, NY',
    taxIdClient: '98-7654321',
    jurisdiction: 'USA',
    currency: 'USD',
    subtotal: 22100,
    taxRate: 0, // Out of state, no nexus
    taxAmount: 0,
    discount: 1100,
    total: 21000,
    status: 'sent',
    paymentMethod: undefined,
    items: [
      { description: 'Frontend Development - Dashboard', hours: 80, rate: 75, amount: 6000 },
      { description: 'Backend API Development', hours: 140, rate: 85, amount: 11900 },
      { description: 'Project Management', hours: 42, rate: 100, amount: 4200 }
    ],
    notes: 'Development services - Q4 2024',
    paymentTerms: 30,
    sentDate: '2024-10-05',
    language: 'en',
    createdAt: new Date('2024-10-05'),
    updatedAt: new Date('2024-10-05')
  }
];
*/

export function InvoicesManager() {
  // Conectar con API real
  const {
    invoices,
    loading: apiLoading,
    error: apiError,
    createInvoice: createInvoiceAPI,
    sendInvoice: sendInvoiceAPI,
    markAsPaid: markAsPaidAPI,
  } = useInvoices();
  
  const { clients } = useClients();
  const { projects, fetchProjectsByClient } = useProjects();

  const [searchTerm, setSearchTerm] = useState('');
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  // Estados para el formulario de crear factura
  const [newInvoice, setNewInvoice] = useState({
    clientId: '',
    projectId: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 días
    currency: 'USD' as Currency,
    items: [{ description: '', quantity: 1, unitPrice: 0, taxable: false }],
    discount: 0,
    notes: ''
  });

  const filteredInvoices = invoices.filter(invoice =>
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cargar proyectos cuando se selecciona un cliente
  useEffect(() => {
    const loadProjects = async () => {
      if (newInvoice.clientId) {
        try {
          const clientProjects = await fetchProjectsByClient(newInvoice.clientId);
          setAvailableProjects(clientProjects);
        } catch (error) {
          console.error('Error loading projects:', error);
          setAvailableProjects([]);
        }
      } else {
        setAvailableProjects([]);
        setNewInvoice(prev => ({ ...prev, projectId: '' }));
      }
    };

    loadProjects();
  }, [newInvoice.clientId, fetchProjectsByClient]);

  // Funciones para manejar items de la factura
  const addInvoiceItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, taxable: false }]
    }));
  };

  const removeInvoiceItem = (index: number) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateSubtotal = () => {
    return newInvoice.items.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = newInvoice.discount || 0;
    return subtotal - discount;
  };

  const handleCreateInvoice = async () => {
    try {
      setFormLoading(true);
      
      const invoiceData = {
        clientId: newInvoice.clientId,
        projectId: newInvoice.projectId || null,
        invoiceDate: newInvoice.invoiceDate,
        dueDate: newInvoice.dueDate,
        currency: newInvoice.currency,
        jurisdiction: 'USA' as const, // Wyoming MVP - siempre USA
        items: newInvoice.items
          .filter(item => item.description.trim() !== '')
          .map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.quantity * item.unitPrice
          })),
        discount: newInvoice.discount,
        notes: newInvoice.notes,
        subtotal: calculateSubtotal(),
        total: calculateTotal()
      };

      await createInvoiceAPI(invoiceData);
      toast.success('Factura creada exitosamente');
      setIsCreateDialogOpen(false);
      
      // Reset form
      setNewInvoice({
        clientId: '',
        projectId: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currency: 'USD' as Currency,
        items: [{ description: '', quantity: 1, unitPrice: 0, taxable: false }],
        discount: 0,
        notes: ''
      });
    } catch (err: any) {
      toast.error(err.message || 'Error al crear factura');
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'sent':
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };


  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewDialogOpen(true);
  };

  const handlePreviewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPreviewDialogOpen(true);
  };

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      setFormLoading(true);
      await sendInvoiceAPI(invoiceId);
      toast.success('Factura enviada exitosamente');
    } catch (err: any) {
      toast.error(err.message || 'Error al enviar factura');
    } finally {
      setFormLoading(false);
    }
  };

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      setFormLoading(true);
      await markAsPaidAPI(invoiceId);
      toast.success('Factura marcada como pagada');
    } catch (err: any) {
      toast.error(err.message || 'Error al marcar como pagada');
    } finally {
      setFormLoading(false);
    }
  };


  const totalPending = invoices
    .filter(inv => inv.status === 'pending' || inv.status === 'sent')
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalOverdue = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalPaid = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const invoicesThisMonth = invoices.filter(inv => {
    const invoiceDate = new Date(inv.invoiceDate);
    const now = new Date();
    return invoiceDate.getMonth() === now.getMonth() && 
           invoiceDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Facturas</h1>
          <p className="text-gray-600 mt-1">Crea, envía y gestiona facturas multi-moneda</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Factura
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] sm:max-w-4xl lg:max-w-5xl max-h-[90vh] overflow-y-auto w-full">
            <DialogHeader>
              <DialogTitle>Crear Nueva Factura</DialogTitle>
              <DialogDescription>
                Complete los campos necesarios para crear una nueva factura para su cliente.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 p-2">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Información Básica</TabsTrigger>
                  <TabsTrigger value="items">Items/Servicios</TabsTrigger>
                  <TabsTrigger value="config">Configuración</TabsTrigger>
                  <TabsTrigger value="preview">Vista Previa</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client">Cliente *</Label>
                      <Select 
                        value={newInvoice.clientId} 
                        onValueChange={(value) => setNewInvoice(prev => ({ ...prev, clientId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.businessName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Moneda *</Label>
                      <Select 
                        value={newInvoice.currency} 
                        onValueChange={(value) => setNewInvoice(prev => ({ ...prev, currency: value as Currency }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar moneda" />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoiceDate">Fecha de Factura *</Label>
                      <Input 
                        id="invoiceDate" 
                        type="date" 
                        value={newInvoice.invoiceDate}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, invoiceDate: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Fecha de Vencimiento *</Label>
                      <Input 
                        id="dueDate" 
                        type="date" 
                        value={newInvoice.dueDate}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentTerms">Términos de Pago</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Días" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_TERMS.map((term) => (
                            <SelectItem key={term.value} value={term.value.toString()}>
                              {term.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project">Proyecto (Opcional)</Label>
                    <Select
                      value={newInvoice.projectId}
                      onValueChange={(value) => setNewInvoice(prev => ({ ...prev, projectId: value }))}
                      disabled={!newInvoice.clientId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={newInvoice.clientId ? "Seleccionar proyecto" : "Primero selecciona un cliente"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProjects.length === 0 ? (
                          <SelectItem value="" disabled>
                            {newInvoice.clientId ? "No hay proyectos disponibles" : "Selecciona un cliente primero"}
                          </SelectItem>
                        ) : (
                          availableProjects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas de la Factura</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Información adicional sobre los servicios..." 
                      value={newInvoice.notes}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="items" className="space-y-4 mt-4">
                  <div>
                    <Label>Items/Servicios de la Factura</Label>
                    <div className="border rounded-lg p-4 space-y-4 mt-2">
                      <div className="grid grid-cols-12 gap-2 md:gap-4 text-sm font-medium text-gray-600">
                        <span className="col-span-12 md:col-span-4">Descripción</span>
                        <span className="col-span-6 md:col-span-2 text-center">Cantidad/Horas</span>
                        <span className="col-span-6 md:col-span-2 text-center">Precio/Tarifa</span>
                        <span className="col-span-6 md:col-span-2 text-center">Subtotal</span>
                        <span className="col-span-6 md:col-span-2 text-center">Acciones</span>
                      </div>
                      
                      {newInvoice.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 md:gap-4">
                          <div className="col-span-12 md:col-span-4">
                            <Textarea 
                              placeholder="Descripción del servicio" 
                              rows={2}
                              value={item.description}
                              onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                              className="w-full"
                            />
                          </div>
                          <div className="col-span-6 md:col-span-2">
                            <Input 
                              type="number" 
                              placeholder="0" 
                              step="0.25"
                              value={item.quantity}
                              onChange={(e) => updateInvoiceItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                              className="w-full"
                            />
                          </div>
                          <div className="col-span-6 md:col-span-2">
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateInvoiceItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="w-full"
                            />
                          </div>
                          <div className="col-span-6 md:col-span-2">
                            <Input 
                              readOnly 
                              placeholder="$0.00" 
                              className="bg-gray-50 w-full"
                              value={formatCurrency(item.quantity * item.unitPrice, newInvoice.currency)}
                            />
                          </div>
                          <div className="col-span-6 md:col-span-2 flex gap-1 justify-center">
                            {newInvoice.items.length > 1 && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => removeInvoiceItem(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            {index === newInvoice.items.length - 1 && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={addInvoiceItem}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}

                      <div className="space-y-2 pt-2 border-t">
                        <div className="text-sm font-medium">O importar desde timesheet aprobado:</div>
                        <Button variant="outline" className="w-full">
                          <Clock className="h-4 w-4 mr-2" />
                          Importar Horas Aprobadas
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="config" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tasa de Impuesto (%)</Label>
                      <Input 
                        id="taxRate" 
                        type="number" 
                        placeholder="0" 
                        min="0" 
                        max="100" 
                        step="0.01"
                        value={newInvoice.taxRate || 0}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount">Descuento</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="number" 
                          placeholder="0" 
                          step="0.01" 
                          className="flex-1"
                          value={newInvoice.discount || 0}
                          onChange={(e) => setNewInvoice(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                        />
                        <Select>
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="%" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percent">%</SelectItem>
                            <SelectItem value="fixed">Fijo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma de la Factura</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template">Plantilla</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar plantilla" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Estándar jbCodingIoT</SelectItem>
                          <SelectItem value="minimal">Minimalista</SelectItem>
                          <SelectItem value="detailed">Detallada</SelectItem>
                          <SelectItem value="export">Factura E (Argentina)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Opciones Adicionales</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="autoSend" className="rounded" />
                        <Label htmlFor="autoSend" className="text-sm">Enviar automáticamente por email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="paymentLink" className="rounded" />
                        <Label htmlFor="paymentLink" className="text-sm">Incluir enlace de pago</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="recurring" className="rounded" />
                        <Label htmlFor="recurring" className="text-sm">Factura recurrente</Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4 mt-4">
                  <div className="border rounded-lg p-6 bg-white min-h-[300px]">
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold">Vista Previa de la Factura</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{formatCurrency(calculateSubtotal(), newInvoice.currency)}</span>
                        </div>
                        {newInvoice.discount > 0 && (
                          <div className="flex justify-between text-red-600">
                            <span>Descuento:</span>
                            <span>-{formatCurrency(newInvoice.discount, newInvoice.currency)}</span>
                          </div>
                        )}
                        {newInvoice.taxRate > 0 && (
                          <div className="flex justify-between">
                            <span>Impuesto ({newInvoice.taxRate}%):</span>
                            <span>{formatCurrency(calculateSubtotal() * (newInvoice.taxRate / 100), newInvoice.currency)}</span>
                          </div>
                        )}
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>{formatCurrency(calculateTotal(), newInvoice.currency)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {newInvoice.items.length > 0 && newInvoice.items.some(item => item.description.trim() !== '') && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Items:</h4>
                          <div className="space-y-1">
                            {newInvoice.items.filter(item => item.description.trim() !== '').map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.description}</span>
                                <span>{formatCurrency(item.quantity * item.unitPrice, newInvoice.currency)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t mt-6">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="w-full sm:w-auto">
                  Cancelar
                </Button>
                <Button variant="outline" className="w-full sm:w-auto">
                  Guardar Borrador
                </Button>
                <Button onClick={handleCreateInvoice} disabled={formLoading} className="w-full sm:w-auto">
                  {formLoading ? 'Creando...' : 'Crear y Enviar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Error Alert */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {apiError}
        </div>
      )}

      {/* Loading State */}
      {apiLoading && invoices.length === 0 && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando facturas...</p>
        </div>
      )}

      {/* Summary Cards - Con datos reales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendiente</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatCurrency(totalPending, 'USD')}</div>
            <div className="text-xs text-muted-foreground">
              {invoices.filter(i => i.status === 'pending' || i.status === 'sent').length} facturas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Vencidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalOverdue, 'USD')}</div>
            <div className="text-xs text-muted-foreground">
              {invoices.filter(i => i.status === 'overdue').length} vencidas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagado Este Mes</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid, 'USD')}</div>
            <div className="text-xs text-muted-foreground">
              {invoices.filter(i => i.status === 'paid').length} pagadas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Este Mes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoicesThisMonth}</div>
            <div className="text-xs text-muted-foreground">
              {invoices.filter(i => i.status === 'pending' || i.status === 'sent').length} pendientes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por número, cliente o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="draft">Borradores</SelectItem>
                <SelectItem value="sent">Enviadas</SelectItem>
                <SelectItem value="paid">Pagadas</SelectItem>
                <SelectItem value="overdue">Vencidas</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por moneda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las monedas</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="ARS">ARS</SelectItem>
                <SelectItem value="MXN">MXN</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Facturas ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factura</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.id}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {invoice.currency}
                        {invoice.isExportInvoice && (
                          <Badge variant="outline" className="text-xs">E</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.client?.businessName || invoice.client?.contactName || 'Cliente no encontrado'}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {invoice.clientEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Emitida: {formatDate(invoice.invoiceDate)}</div>
                      <div className={`${invoice.status === 'overdue' ? 'text-red-600' : ''}`}>
                        Vence: {formatDate(invoice.dueDate)}
                        {invoice.status === 'overdue' && (
                          <span className="ml-1">({calculateDaysOverdue(invoice.dueDate)} días)</span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {formatCurrency(invoice.total, invoice.currency)}
                      </div>
                      {invoice.taxAmount > 0 && (
                        <div className="text-sm text-gray-500">
                          + {formatCurrency(invoice.taxAmount, invoice.currency)} imp.
                        </div>
                      )}
                      {invoice.discount > 0 && (
                        <div className="text-sm text-green-600">
                          - {formatCurrency(invoice.discount, invoice.currency)} desc.
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(invoice.status)}
                      <StatusBadge status={invoice.status} type="invoice" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handlePreviewInvoice(invoice)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          try {
                            toast.success('Descargando PDF...');
                            await invoicesAPI.downloadPDF(invoice.id);
                          } catch (error) {
                            toast.error('Error al descargar PDF');
                            console.error('PDF download error:', error);
                          }
                        }}
                        title="Descargar PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {(invoice.status === 'draft' || invoice.status === 'pending') && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSendInvoice(invoice.id)}
                        disabled={formLoading}
                        title="Enviar factura"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      )}
                      {(invoice.status === 'sent' || invoice.status === 'overdue' || invoice.status === 'pending') && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMarkAsPaid(invoice.id)}
                          disabled={formLoading}
                          title="Marcar como pagada"
                        >
                          <CreditCard className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice Details Modal */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto w-[calc(98vw+10px)]">
          <DialogHeader>
            <DialogTitle>Detalles de Factura</DialogTitle>
            <DialogDescription>
              Información completa de la factura seleccionada y opciones de gestión.
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información de Factura</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Número:</span>
                      <span className="font-medium">{selectedInvoice.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span>{formatDate(selectedInvoice.invoiceDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vencimiento:</span>
                      <span>{formatDate(selectedInvoice.dueDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Moneda:</span>
                      <Badge variant="outline">{selectedInvoice.currency}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <StatusBadge status={selectedInvoice.status} type="invoice" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información del Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-gray-600 text-sm">Cliente</div>
                      <div className="font-medium">{selectedInvoice.client?.businessName || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm">Email</div>
                      <div>{selectedInvoice.client?.email || selectedInvoice.clientEmail || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm">Identificación Fiscal</div>
                      <div>{selectedInvoice.client?.taxId || selectedInvoice.taxId || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm">Dirección</div>
                      <div className="text-sm">{selectedInvoice.client?.address || selectedInvoice.clientAddress || 'N/A'}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Items de Factura</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Cantidad/Horas</TableHead>
                        <TableHead>Tarifa</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.hours > 0 ? `${item.hours}h` : '-'}</TableCell>
                          <TableCell>
                            {item.rate > 0 ? formatCurrency(item.rate, selectedInvoice.currency) : '-'}
                          </TableCell>
                          <TableCell>{formatCurrency(item.amount, selectedInvoice.currency)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(selectedInvoice.subtotal, selectedInvoice.currency)}</span>
                    </div>
                    {selectedInvoice.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Descuento:</span>
                        <span>-{formatCurrency(selectedInvoice.discount, selectedInvoice.currency)}</span>
                      </div>
                    )}
                    {selectedInvoice.taxAmount > 0 && (
                      <div className="flex justify-between">
                        <span>Impuestos ({selectedInvoice.taxRate}%):</span>
                        <span>{formatCurrency(selectedInvoice.taxAmount, selectedInvoice.currency)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedInvoice.total, selectedInvoice.currency)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedInvoice.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{selectedInvoice.notes}</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicar
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      toast.success('Descargando PDF...');
                      await invoicesAPI.downloadPDF(selectedInvoice.id);
                    } catch (error) {
                      toast.error('Error al descargar PDF');
                      console.error('PDF download error:', error);
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </Button>
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Enlace Público
                </Button>
                {selectedInvoice.status !== 'paid' && (
                  <Button onClick={() => handleMarkAsPaid(selectedInvoice.id)}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Marcar como Pagada
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Preview Modal */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto w-[calc(98vw+10px)]">
          <DialogHeader>
            <DialogTitle>Vista Previa de Factura</DialogTitle>
            <DialogDescription>
              Vista previa de cómo se verá la factura antes de enviarla al cliente.
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="bg-white p-8 border rounded-lg">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-600 rounded-lg p-2">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-blue-600">jbCodingIoT</h1>
                      <p className="text-gray-600">Desarrollo de Software & Servicios Digitales</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Buenos Aires, Argentina</p>
                    <p>contacto@jbcodingiot.com</p>
                    <p>+54 11 1234-5678</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedInvoice.language === 'en' ? 'INVOICE' : 'FACTURA'}
                    {selectedInvoice.isExportInvoice && ' E'}
                  </h2>
                  <p className="text-gray-600">{selectedInvoice.invoiceNumber}</p>
                  <p className="text-gray-600">{formatDate(selectedInvoice.invoiceDate)}</p>
                </div>
              </div>

              {/* Client Info */}
              <div className="mb-8">
                <h3 className="font-semibold mb-2">
                  {selectedInvoice.language === 'en' ? 'Bill To:' : 'Facturar a:'}
                </h3>
                <div className="text-gray-700">
                  <p className="font-medium">{selectedInvoice.client}</p>
                  <p>{selectedInvoice.taxId}</p>
                  <p>{selectedInvoice.clientAddress}</p>
                  <p>{selectedInvoice.clientEmail}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {selectedInvoice.language === 'en' ? 'Description' : 'Descripción'}
                      </TableHead>
                      <TableHead>
                        {selectedInvoice.language === 'en' ? 'Hours' : 'Horas'}
                      </TableHead>
                      <TableHead>
                        {selectedInvoice.language === 'en' ? 'Rate' : 'Tarifa'}
                      </TableHead>
                      <TableHead>
                        {selectedInvoice.language === 'en' ? 'Amount' : 'Importe'}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.hours > 0 ? `${item.hours}h` : '-'}</TableCell>
                        <TableCell>
                          {item.rate > 0 ? formatCurrency(item.rate, selectedInvoice.currency) : '-'}
                        </TableCell>
                        <TableCell>{formatCurrency(item.amount, selectedInvoice.currency)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Totals */}
                <div className="mt-6 max-w-sm ml-auto">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{selectedInvoice.language === 'en' ? 'Subtotal:' : 'Subtotal:'}</span>
                      <span>{formatCurrency(selectedInvoice.subtotal, selectedInvoice.currency)}</span>
                    </div>
                    {selectedInvoice.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>{selectedInvoice.language === 'en' ? 'Discount:' : 'Descuento:'}</span>
                        <span>-{formatCurrency(selectedInvoice.discount, selectedInvoice.currency)}</span>
                      </div>
                    )}
                    {selectedInvoice.taxAmount > 0 && (
                      <div className="flex justify-between">
                        <span>
                          {selectedInvoice.language === 'en' ? 'Tax' : 'Impuestos'} ({selectedInvoice.taxRate}%):
                        </span>
                        <span>{formatCurrency(selectedInvoice.taxAmount, selectedInvoice.currency)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>{selectedInvoice.language === 'en' ? 'Total:' : 'Total:'}</span>
                      <span>{formatCurrency(selectedInvoice.total, selectedInvoice.currency)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes and Terms */}
              <div className="space-y-4 text-sm text-gray-600">
                {selectedInvoice.notes && (
                  <div>
                    <h4 className="font-semibold mb-1">
                      {selectedInvoice.language === 'en' ? 'Notes:' : 'Notas:'}
                    </h4>
                    <p>{selectedInvoice.notes}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold mb-1">
                    {selectedInvoice.language === 'en' ? 'Payment Terms:' : 'Términos de Pago:'}
                  </h4>
                  <p>
                    {selectedInvoice.language === 'en' 
                      ? `Payment due within ${selectedInvoice.paymentTerms} days`
                      : `Pago requerido en ${selectedInvoice.paymentTerms} días`
                    }
                  </p>
                </div>

                {selectedInvoice.isExportInvoice && (
                  <div className="mt-6 p-3 bg-blue-50 rounded">
                    <p className="text-xs">
                      <strong>FACTURA E:</strong> Exportación de servicios profesionales de desarrollo de software. 
                      Exenta de IVA según Art. 7° inc. a) Ley de IVA.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}