import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  Plus,
  Search,
  Edit,
  Eye,
  Calendar,
  DollarSign,
  Clock,
  Users,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FolderOpen,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge } from './StatusBadge';
import { formatCurrency } from '../lib/formatters';
import { CURRENCIES } from '../lib/constants';
import type { Project, Currency } from '../types';
import { useProjects } from '../hooks/useProjects';
import { useClients } from '../hooks/useClients';

/* Mock data - comentado, ahora usa API
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Sistema IoT Agrícola',
    clientId: '1',
    description: 'Desarrollo de plataforma IoT para monitoreo de cultivos',
    status: 'in_progress',
    priority: 'high',
    startDate: new Date('2024-08-01'),
    endDate: new Date('2024-12-15'),
    budget: 85000,
    budgetSpent: 65750,
    currency: 'USD',
    hoursEstimated: 680,
    hoursLogged: 520,
    progress: 85,
    team: ['Juan Pérez', 'Ana García', 'Carlos López'],
    services: [
      { type: 'Backend Development', rate: 85, hours: 240 },
      { type: 'IoT Solutions', rate: 95, hours: 180 },
      { type: 'Frontend Development', rate: 75, hours: 100 }
    ],
    milestones: [
      { name: 'Análisis y Diseño', status: 'completed', date: '2024-08-30', budget: 15000 },
      { name: 'MVP Development', status: 'completed', date: '2024-10-01', budget: 35000 },
      { name: 'Testing & Integration', status: 'in_progress', date: '2024-11-15', budget: 20000 },
      { name: 'Deployment', status: 'pending', date: '2024-12-15', budget: 15000 }
    ],
    createdAt: new Date('2024-08-01'),
    updatedAt: new Date('2024-10-12')
  },
  {
    id: '2',
    name: 'E-commerce AI Platform',
    clientId: '2',
    description: 'Plataforma de e-commerce con recomendaciones de IA',
    status: 'in_progress',
    priority: 'medium',
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-11-30'),
    budget: 45000,
    budgetSpent: 27000,
    currency: 'USD',
    hoursEstimated: 360,
    hoursLogged: 216,
    progress: 60,
    team: ['María Rodríguez', 'David Silva'],
    services: [
      { type: 'AI/ML Services', rate: 100, hours: 120 },
      { type: 'Backend Development', rate: 85, hours: 140 },
      { type: 'Frontend Development', rate: 75, hours: 100 }
    ],
    milestones: [
      { name: 'AI Model Development', status: 'completed', date: '2024-09-30', budget: 18000 },
      { name: 'Platform Development', status: 'in_progress', date: '2024-10-31', budget: 20000 },
      { name: 'Integration & Testing', status: 'pending', date: '2024-11-30', budget: 7000 }
    ],
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-10-12')
  },
  {
    id: '3',
    name: 'Mobile Banking App',
    clientId: '3',
    description: 'Aplicación móvil para servicios bancarios',
    status: 'planning',
    priority: 'high',
    startDate: new Date('2024-11-01'),
    endDate: new Date('2025-03-15'),
    budget: 120000,
    budgetSpent: 0,
    currency: 'USD',
    hoursEstimated: 960,
    hoursLogged: 0,
    progress: 5,
    team: ['Roberto Martínez', 'Laura Torres', 'Pablo Herrera'],
    services: [
      { type: 'Backend Development', rate: 85, hours: 400 },
      { type: 'Frontend Development', rate: 75, hours: 300 },
      { type: 'Mobile Development', rate: 80, hours: 260 }
    ],
    milestones: [
      { name: 'Discovery & Planning', status: 'in_progress', date: '2024-11-15', budget: 20000 },
      { name: 'Core Development', status: 'pending', date: '2025-01-31', budget: 60000 },
      { name: 'Security & Compliance', status: 'pending', date: '2025-02-28', budget: 25000 },
      { name: 'Testing & Launch', status: 'pending', date: '2025-03-15', budget: 15000 }
    ],
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01')
  }
];
*/

export function ProjectsManager() {
  // Conectar con API real
  const {
    projects,
    loading: apiLoading,
    error: apiError,
    createProject: createProjectAPI,
  } = useProjects();
  
  const { clients } = useClients();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Estado para servicios dinámicos
  const [projectServices, setProjectServices] = useState<Array<{
    type: string;
    rate: number;
    hours: number;
  }>>([]);

  // Funciones para manejar servicios
  const addService = () => {
    setProjectServices([...projectServices, { type: '', rate: 0, hours: 0 }]);
  };

  const removeService = (index: number) => {
    setProjectServices(projectServices.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: 'type' | 'rate' | 'hours', value: string | number) => {
    const updated = [...projectServices];
    updated[index] = { ...updated[index], [field]: value };
    setProjectServices(updated);
  };

  // Estados para el formulario de crear proyecto
  const [newProject, setNewProject] = useState({
    clientId: '',
    name: '',
    description: '',
    status: 'active' as const,
    priority: 'medium' as const,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 días
    budget: 0,
    currency: 'USD' as Currency,
    hoursEstimated: 0,
    team: '',
    services: '',
    milestones: []
  });

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientName = (clientId: string) => {
    const client = clients.find((c: any) => c.id === clientId);
    return client ? client.businessName : `Cliente ID: ${clientId}`;
  };

  const getMilestoneStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const calculateBurnRate = (project: any) => {
    if (project.hoursLogged === 0) return 0;
    return (project.budgetSpent / project.hoursLogged);
  };

  const handleCreateProject = async () => {
    try {
      // Validar campos requeridos
      if (!newProject.clientId) {
        toast.error('Selecciona un cliente');
        return;
      }

      if (!newProject.name.trim()) {
        toast.error('El nombre del proyecto es requerido');
        return;
      }

      // Calcular presupuesto total desde servicios
      const calculatedBudget = projectServices.reduce((sum, s) => sum + (s.rate * s.hours), 0);
      const calculatedHours = projectServices.reduce((sum, s) => sum + s.hours, 0);

      // Convertir fechas de string a Date
      const startDate = new Date(newProject.startDate);
      const endDate = new Date(newProject.endDate);

      // Incluir servicios y campos necesarios en el proyecto
      const projectData = {
        ...newProject,
        budget: calculatedBudget > 0 ? calculatedBudget : newProject.budget,
        budgetSpent: 0,
        hoursEstimated: calculatedHours > 0 ? calculatedHours : newProject.hoursEstimated,
        hoursLogged: 0,
        progress: 0,
        startDate,
        endDate,
        team: newProject.team ? newProject.team.split(',').map(t => t.trim()) : [],
        services: projectServices.length > 0 ? projectServices : [],
        milestones: [],
      };

      await createProjectAPI(projectData);
      toast.success('Proyecto creado exitosamente');
      setIsCreateDialogOpen(false);

      // Reset form
      setNewProject({
        clientId: '',
        name: '',
        description: '',
        status: 'active' as const,
        priority: 'medium' as const,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        budget: 0,
        currency: 'USD' as Currency,
        hoursEstimated: 0,
        team: '',
        services: '',
        milestones: []
      });
      setProjectServices([]);
    } catch (err: any) {
      toast.error(err.message || 'Error al crear proyecto');
    }
  };

  const handleViewProject = (project: any) => {
    setSelectedProject(project);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* API Error Alert */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          <strong>Error:</strong> {apiError}
        </div>
      )}

      {/* Loading State */}
      {apiLoading && projects.length === 0 && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando proyectos...</p>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Proyectos</h1>
          <p className="text-gray-600 mt-1">Controla el progreso y rentabilidad de tus proyectos</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto w-[90vw]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
              <DialogDescription>
                Configure los detalles del proyecto, asigne cliente y defina el alcance del trabajo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 p-2">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Información Básica</TabsTrigger>
                  <TabsTrigger value="budget">Presupuesto</TabsTrigger>
                  <TabsTrigger value="team">Equipo</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div>
                    <Label htmlFor="projectName">Nombre del Proyecto *</Label>
                    <Input 
                      id="projectName" 
                      placeholder="Ej: Sistema de Gestión Empresarial"
                      value={newProject.name}
                      onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="client">Cliente *</Label>
                    <Select 
                      value={newProject.clientId} 
                      onValueChange={(value) => setNewProject(prev => ({ ...prev, clientId: value }))}
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
                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Descripción detallada del proyecto"
                      value={newProject.description}
                      onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Fecha de Inicio</Label>
                      <Input 
                        id="startDate" 
                        type="date" 
                        value={newProject.startDate}
                        onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">Fecha de Finalización</Label>
                      <Input 
                        id="endDate" 
                        type="date" 
                        value={newProject.endDate}
                        onChange={(e) => setNewProject(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Prioridad</Label>
                      <Select
                        value={newProject.priority}
                        onValueChange={(value: 'low' | 'medium' | 'high') => setNewProject(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baja</SelectItem>
                          <SelectItem value="medium">Media</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Estado Inicial</Label>
                      <Select
                        value={newProject.status}
                        onValueChange={(value: 'active' | 'planning') => setNewProject(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planificación</SelectItem>
                          <SelectItem value="active">En Progreso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="budget" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budget">Presupuesto Total</Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="0"
                        value={newProject.budget || ''}
                        onChange={(e) => setNewProject(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                        disabled={projectServices.length > 0}
                        className={projectServices.length > 0 ? 'bg-gray-100' : ''}
                      />
                      {projectServices.length > 0 && (
                        <p className="text-xs text-blue-600 mt-1">
                          Se calcula automáticamente desde los servicios
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="currency">Moneda</Label>
                      <Select
                        value={newProject.currency}
                        onValueChange={(value: Currency) => setNewProject(prev => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar moneda" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="ARS">ARS</SelectItem>
                          <SelectItem value="MXN">MXN</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="hoursEstimated">Horas Estimadas</Label>
                    <Input
                      id="hoursEstimated"
                      type="number"
                      placeholder="0"
                      value={newProject.hoursEstimated || ''}
                      onChange={(e) => setNewProject(prev => ({ ...prev, hoursEstimated: parseFloat(e.target.value) || 0 }))}
                      disabled={projectServices.length > 0}
                      className={projectServices.length > 0 ? 'bg-gray-100' : ''}
                    />
                    {projectServices.length > 0 && (
                      <p className="text-xs text-blue-600 mt-1">
                        Se calcula automáticamente desde los servicios
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Servicios y Tarifas</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addService}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Añadir Servicio
                      </Button>
                    </div>

                    {projectServices.length > 0 && (
                      <div className="grid grid-cols-[1fr_120px_120px_40px] gap-2 text-sm font-medium text-gray-600">
                        <span>Servicio</span>
                        <span>Tarifa/Hora</span>
                        <span>Horas Est.</span>
                        <span></span>
                      </div>
                    )}

                    {projectServices.length === 0 && (
                      <div className="text-center py-6 text-gray-500 border-2 border-dashed rounded-lg">
                        <p className="text-sm">No hay servicios agregados</p>
                        <p className="text-xs mt-1">Haz clic en "Añadir Servicio" para comenzar</p>
                      </div>
                    )}

                    {projectServices.map((service, index) => (
                      <div key={index} className="grid grid-cols-[1fr_120px_120px_40px] gap-2 items-center">
                        <Select
                          value={service.type}
                          onValueChange={(value) => updateService(index, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar servicio" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="backend">Backend Development</SelectItem>
                            <SelectItem value="frontend">Frontend Development</SelectItem>
                            <SelectItem value="mobile">Mobile Development</SelectItem>
                            <SelectItem value="iot">IoT Solutions</SelectItem>
                            <SelectItem value="ai">AI/ML Services</SelectItem>
                            <SelectItem value="devops">DevOps</SelectItem>
                            <SelectItem value="qa">QA & Testing</SelectItem>
                            <SelectItem value="design">UI/UX Design</SelectItem>
                            <SelectItem value="consulting">Consulting</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="$/h"
                          value={service.rate || ''}
                          onChange={(e) => updateService(index, 'rate', parseFloat(e.target.value) || 0)}
                        />
                        <Input
                          type="number"
                          placeholder="Horas"
                          value={service.hours || ''}
                          onChange={(e) => updateService(index, 'hours', parseFloat(e.target.value) || 0)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeService(index)}
                          className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {projectServices.length > 0 && (
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Total Estimado:</span>
                          <span className="text-blue-600">
                            {projectServices.reduce((sum, s) => sum + (s.rate * s.hours), 0).toFixed(2)} {newProject.currency}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Horas Totales:</span>
                          <span>{projectServices.reduce((sum, s) => sum + s.hours, 0)}h</span>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="team" className="space-y-4">
                  <div>
                    <Label>Miembros del Equipo</Label>
                    <div className="space-y-2 mt-2">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Agregar miembro del equipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="juan">Juan Pérez - Backend Developer</SelectItem>
                          <SelectItem value="ana">Ana García - Frontend Developer</SelectItem>
                          <SelectItem value="carlos">Carlos López - IoT Specialist</SelectItem>
                          <SelectItem value="maria">María Rodríguez - AI/ML Engineer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="projectManager">Project Manager</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Asignar Project Manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="david">David Silva</SelectItem>
                        <SelectItem value="laura">Laura Torres</SelectItem>
                        <SelectItem value="roberto">Roberto Martínez</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateProject}>
                  Crear Proyecto
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards - DATOS REALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos Totales</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects?.length || 0}</div>
            <div className="text-xs text-muted-foreground">
              {projects?.filter((p: any) => p?.status === 'active')?.length || 0} activos
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${((projects || []).reduce((sum: number, p: any) => sum + (Number(p?.budget) || 0), 0) / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-muted-foreground">Multi-moneda</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Totales</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(projects || []).reduce((sum: number, p: any) => sum + (Number(p?.hoursLogged) || 0), 0)}h
            </div>
            <div className="text-xs text-muted-foreground">
              de {(projects || []).reduce((sum: number, p: any) => sum + (Number(p?.hoursEstimated) || 0), 0)}h estimadas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(projects?.length || 0) > 0
                ? Math.round((projects || []).reduce((sum: number, p: any) => sum + (Number(p?.progress) || 0), 0) / (projects?.length || 1))
                : 0}%
            </div>
            <div className="text-xs text-muted-foreground">Promedio general</div>
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
                placeholder="Buscar proyectos..."
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
                <SelectItem value="planning">Planificación</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="completed">Completados</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los clientes</SelectItem>
                {clients.map((client: any) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.businessName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Proyectos ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proyecto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Presupuesto</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-gray-500">
                        {project.description ? project.description.substring(0, 50) + '...' : 'Sin descripción'}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={project.priority} type="priority" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{getClientName(project.clientId)}</div>
                    <div className="text-sm text-gray-500">
                      {Array.isArray(project.team) ? project.team.length : 0} miembros
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{project.progress || 0}%</span>
                        <span>{project.hoursLogged || 0}h/{project.hoursEstimated || 0}h</span>
                      </div>
                      <Progress value={project.progress || 0} className="w-full" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {formatCurrency(project.budget || 0, project.currency)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Gastado: {formatCurrency(project.budgetSpent || 0, project.currency)}
                      </div>
                      <div className="text-xs text-gray-400">
                        Burn: {(project.hoursLogged || 0) > 0 ? formatCurrency(calculateBurnRate(project), project.currency) + '/h' : 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Inicio: {project.startDate instanceof Date ? project.startDate.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }) : new Date(project.startDate).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}</div>
                      <div>Fin: {project.endDate instanceof Date ? project.endDate.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }) : new Date(project.endDate).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={project.status} type="project" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewProject(project)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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

      {/* Project Details Modal */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto w-[95vw]">
          <DialogHeader>
            <DialogTitle>Detalles del Proyecto</DialogTitle>
            <DialogDescription>
              Información completa del proyecto, incluyendo progreso, equipo y métricas.
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información General</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">Proyecto</div>
                      <div className="font-medium">{selectedProject.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Cliente ID</div>
                      <div className="font-medium">{selectedProject.clientId}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Estado</div>
                      <StatusBadge status={selectedProject.status} type="project" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Prioridad</div>
                      <StatusBadge status={selectedProject.priority} type="priority" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Presupuesto</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">Total</div>
                      <div className="text-xl font-bold text-blue-600">
                        {formatCurrency(selectedProject.budget, selectedProject.currency)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Gastado</div>
                      <div className="font-medium">
                        {formatCurrency(selectedProject.budgetSpent, selectedProject.currency)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Restante</div>
                      <div className="font-medium text-green-600">
                        {formatCurrency(selectedProject.budget - selectedProject.budgetSpent, selectedProject.currency)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Burn Rate</div>
                      <div className="font-medium">
                        {formatCurrency(calculateBurnRate(selectedProject), selectedProject.currency)}/hora
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tiempo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">Horas Estimadas</div>
                      <div className="font-medium">{selectedProject.hoursEstimated}h</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Horas Registradas</div>
                      <div className="font-medium">{selectedProject.hoursLogged}h</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Progreso</div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{selectedProject.progress}%</span>
                        </div>
                        <Progress value={selectedProject.progress} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hitos del Proyecto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(selectedProject.milestones || []).length > 0 ? (
                      (selectedProject.milestones || []).map((milestone: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getMilestoneStatusIcon(milestone.status)}
                            <div>
                              <div className="font-medium">{milestone.name}</div>
                              <div className="text-sm text-gray-500">
                                Fecha objetivo: {milestone.date}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {formatCurrency(milestone.budget, selectedProject.currency)}
                            </div>
                            <div className="text-sm text-gray-500 capitalize">
                              {milestone.status === 'completed' && 'Completado'}
                              {milestone.status === 'in_progress' && 'En Progreso'}
                              {milestone.status === 'pending' && 'Pendiente'}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No hay hitos definidos
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Equipo del Proyecto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {(selectedProject.team || []).length > 0 ? (
                        (selectedProject.team || []).map((member: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>{member}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No hay miembros asignados
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Servicios y Tarifas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(selectedProject.services || []).length > 0 ? (
                        (selectedProject.services || []).map((service: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <div className="font-medium text-sm">{service.type}</div>
                              <div className="text-xs text-gray-500">{service.hours}h estimadas</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {formatCurrency(service.rate, selectedProject.currency)}/h
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No hay servicios definidos
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}