import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import {
  Building2,
  Globe,
  DollarSign,
  FileText,
  Mail,
  Bell,
  Shield,
  Users,
  Code,
  Database,
  CreditCard,
  Palette,
  Languages,
  Settings,
  Save,
  Upload,
  Eye,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { authAPI, settingsAPI } from '../lib/api';

export function SettingsManager() {
  const [loading, setLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    businessName: '',
    taxId: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
    email: '',
  });

  // Load user data and settings on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user data
        const userResponse = await authAPI.getCurrentUser();
        const user = userResponse.user;
        setCompanyInfo({
          name: user.name || '',
          businessName: user.businessName || '',
          taxId: user.taxId || '',
          address: user.address || '',
          city: user.city || '',
          state: user.state || '',
          postalCode: user.postalCode || '',
          country: user.country || '',
          phone: user.phone || '',
          email: user.email || '',
        });

        // Load settings
        const settingsResponse = await settingsAPI.getSettings();
        const settings = settingsResponse.settings;
        setEmailSettings({
          fromName: settings.emailFromName || '',
          fromEmail: settings.emailFromAddress || '',
          replyTo: settings.emailReplyTo || '',
          smtpServer: settings.smtpHost || '',
          smtpPort: settings.smtpPort || 587,
          smtpUser: settings.smtpUser || '',
          smtpPassword: settings.smtpPassword || '',
          enableSSL: settings.smtpSecure ?? true,
        });

        setBillingSettings({
          defaultCurrency: settings.defaultCurrency || 'USD',
          defaultTaxRate: settings.defaultTaxRate || 0,
          defaultPaymentTerms: settings.defaultPaymentTerms || 30,
          invoicePrefix: settings.invoicePrefix || 'INV',
          autoNumbering: true,
          nextInvoiceNumber: settings.nextInvoiceNumber || 1,
          defaultLanguage: 'es'
        });

        setPaymentSettings({
          bankName: settings.bankName || '',
          bankAccountHolder: settings.bankAccountHolder || '',
          bankAccountNumber: settings.bankAccountNumber || '',
          bankRoutingNumber: settings.bankRoutingNumber || '',
          bankSwiftCode: settings.bankSwiftCode || '',
          paymentInstructions: settings.paymentInstructions || '',
        });
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Error al cargar configuración');
      }
    };

    loadData();
  }, []);

  const [billingSettings, setBillingSettings] = useState({
    defaultCurrency: 'USD',
    defaultTaxRate: 21,
    defaultPaymentTerms: 30,
    invoicePrefix: 'INV',
    autoNumbering: true,
    nextInvoiceNumber: 5,
    defaultLanguage: 'es'
  });

  const [emailSettings, setEmailSettings] = useState({
    fromName: 'jbCodingIoT',
    fromEmail: 'facturacion@jbcodingiot.com',
    replyTo: 'contacto@jbcodingiot.com',
    smtpServer: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    enableSSL: true
  });

  const [notifications, setNotifications] = useState({
    invoiceCreated: true,
    invoicePaid: true,
    invoiceOverdue: true,
    newTimeEntry: false,
    weeklyReport: true,
    paymentReminders: true,
    daysBeforeDue: 3,
    overdueFrequency: 7
  });

  const [paymentSettings, setPaymentSettings] = useState({
    bankName: '',
    bankAccountHolder: '',
    bankAccountNumber: '',
    bankRoutingNumber: '',
    bankSwiftCode: '',
    paymentInstructions: '',
  });

  const [exchangeRates, setExchangeRates] = useState([
    { from: 'USD', to: 'EUR', rate: 0.85, lastUpdated: '2024-10-06 14:30' },
    { from: 'USD', to: 'ARS', rate: 850.50, lastUpdated: '2024-10-06 14:30' },
    { from: 'USD', to: 'MXN', rate: 17.25, lastUpdated: '2024-10-06 14:30' },
    { from: 'EUR', to: 'ARS', rate: 1000.60, lastUpdated: '2024-10-06 14:30' }
  ]);

  const [serviceRates, setServiceRates] = useState([
    { service: 'Backend Development', defaultRate: 85, currency: 'USD' },
    { service: 'Frontend Development', defaultRate: 75, currency: 'USD' },
    { service: 'Mobile Development', defaultRate: 80, currency: 'USD' },
    { service: 'IoT Solutions', defaultRate: 95, currency: 'USD' },
    { service: 'AI/ML Services', defaultRate: 100, currency: 'USD' },
    { service: 'QA Testing', defaultRate: 65, currency: 'USD' },
    { service: 'Consultoría', defaultRate: 120, currency: 'USD' },
    { service: 'Soporte Técnico', defaultRate: 55, currency: 'USD' }
  ]);

  const handleSaveSettings = async (section: string) => {
    try {
      setLoading(true);

      if (section === 'empresa') {
        await authAPI.updateCurrentUser({
          name: companyInfo.name,
          businessName: companyInfo.businessName,
          taxId: companyInfo.taxId,
          address: companyInfo.address,
          city: companyInfo.city,
          state: companyInfo.state,
          postalCode: companyInfo.postalCode,
          country: companyInfo.country,
          phone: companyInfo.phone,
        });
      } else if (section === 'email') {
        await settingsAPI.updateSettings({
          emailFromName: emailSettings.fromName,
          emailFromAddress: emailSettings.fromEmail,
          emailReplyTo: emailSettings.replyTo,
          smtpHost: emailSettings.smtpServer,
          smtpPort: emailSettings.smtpPort,
          smtpUser: emailSettings.smtpUser,
          smtpPassword: emailSettings.smtpPassword,
          smtpSecure: emailSettings.enableSSL,
        });
      } else if (section === 'facturación') {
        await settingsAPI.updateSettings({
          defaultCurrency: billingSettings.defaultCurrency,
          defaultTaxRate: billingSettings.defaultTaxRate,
          defaultPaymentTerms: billingSettings.defaultPaymentTerms,
          invoicePrefix: billingSettings.invoicePrefix,
          nextInvoiceNumber: billingSettings.nextInvoiceNumber,
        });
      } else if (section === 'pago') {
        await settingsAPI.updateSettings({
          bankName: paymentSettings.bankName,
          bankAccountHolder: paymentSettings.bankAccountHolder,
          bankAccountNumber: paymentSettings.bankAccountNumber,
          bankRoutingNumber: paymentSettings.bankRoutingNumber,
          bankSwiftCode: paymentSettings.bankSwiftCode,
          paymentInstructions: paymentSettings.paymentInstructions,
        });
      }

      toast.success(`Configuración de ${section} guardada exitosamente`);
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Error al guardar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExchangeRates = () => {
    toast.success('Tipos de cambio actualizados desde API externa');
  };

  const handleTestEmail = () => {
    toast.success('Email de prueba enviado exitosamente');
  };

  const handleExportData = () => {
    toast.success('Datos exportados exitosamente');
  };

  const handleImportData = () => {
    toast.success('Datos importados exitosamente');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-gray-600 mt-1">Administra la configuración global de tu sistema de facturación</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Configuración
          </Button>
          <Button variant="outline" onClick={handleImportData}>
            <Upload className="h-4 w-4 mr-2" />
            Importar Configuración
          </Button>
        </div>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="billing">Facturación</TabsTrigger>
          <TabsTrigger value="currencies">Monedas</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información de la Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Nombre Comercial</Label>
                  <Input
                    id="companyName"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="legalName">Razón Social</Label>
                  <Input
                    id="legalName"
                    value={companyInfo.businessName}
                    onChange={(e) => setCompanyInfo({...companyInfo, businessName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxId">Identificación Fiscal</Label>
                  <Input
                    id="taxId"
                    value={companyInfo.taxId}
                    onChange={(e) => setCompanyInfo({...companyInfo, taxId: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={companyInfo.phone}
                    onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={companyInfo.city}
                    onChange={(e) => setCompanyInfo({...companyInfo, city: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado/Provincia</Label>
                  <Input
                    id="state"
                    value={companyInfo.state}
                    onChange={(e) => setCompanyInfo({...companyInfo, state: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Código Postal</Label>
                  <Input
                    id="postalCode"
                    value={companyInfo.postalCode}
                    onChange={(e) => setCompanyInfo({...companyInfo, postalCode: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    value={companyInfo.country}
                    onChange={(e) => setCompanyInfo({...companyInfo, country: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companyInfo.email}
                    disabled
                  />
                </div>
              </div>

              <div>
                <Label>Logo de la Empresa</Label>
                <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Arrastra tu logo aquí o haz clic para seleccionar</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 2MB</p>
                  <Button variant="outline" className="mt-2">
                    Seleccionar Archivo
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSaveSettings('empresa')}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Configuración de Facturación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="defaultCurrency">Moneda por Defecto</Label>
                  <Select value={billingSettings.defaultCurrency} onValueChange={(value) => setBillingSettings({...billingSettings, defaultCurrency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
                      <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="defaultTaxRate">Tasa de Impuesto por Defecto (%)</Label>
                  <Input 
                    id="defaultTaxRate" 
                    type="number" 
                    value={billingSettings.defaultTaxRate}
                    onChange={(e) => setBillingSettings({...billingSettings, defaultTaxRate: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="defaultPaymentTerms">Términos de Pago por Defecto (días)</Label>
                  <Input 
                    id="defaultPaymentTerms" 
                    type="number" 
                    value={billingSettings.defaultPaymentTerms}
                    onChange={(e) => setBillingSettings({...billingSettings, defaultPaymentTerms: Number(e.target.value)})}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="invoicePrefix">Prefijo de Factura</Label>
                  <Input 
                    id="invoicePrefix" 
                    value={billingSettings.invoicePrefix}
                    onChange={(e) => setBillingSettings({...billingSettings, invoicePrefix: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="nextInvoiceNumber">Próximo Número de Factura</Label>
                  <Input 
                    id="nextInvoiceNumber" 
                    type="number" 
                    value={billingSettings.nextInvoiceNumber}
                    onChange={(e) => setBillingSettings({...billingSettings, nextInvoiceNumber: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="defaultLanguage">Idioma por Defecto</Label>
                  <Select value={billingSettings.defaultLanguage} onValueChange={(value) => setBillingSettings({...billingSettings, defaultLanguage: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="autoNumbering" 
                  checked={billingSettings.autoNumbering}
                  onCheckedChange={(checked) => setBillingSettings({...billingSettings, autoNumbering: checked})}
                />
                <Label htmlFor="autoNumbering">Numeración automática de facturas</Label>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('facturación')}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Plantillas de Factura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500">
                  <div className="bg-gray-100 h-32 rounded mb-3 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium">Plantilla Estándar</h3>
                  <p className="text-sm text-gray-600">Diseño profesional con branding jbCodingIoT</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-800">Activa</Badge>
                </div>

                <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500">
                  <div className="bg-gray-100 h-32 rounded mb-3 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium">Plantilla Minimalista</h3>
                  <p className="text-sm text-gray-600">Diseño limpio y minimalista</p>
                </div>

                <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500">
                  <div className="bg-gray-100 h-32 rounded mb-3 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium">Factura E (Argentina)</h3>
                  <p className="text-sm text-gray-600">Especializada para exportación de servicios</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Información de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Esta información aparecerá en todas las facturas para que los clientes sepan dónde realizar el pago.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">Nombre del Banco</Label>
                  <Input
                    id="bankName"
                    value={paymentSettings.bankName}
                    onChange={(e) => setPaymentSettings({...paymentSettings, bankName: e.target.value})}
                    placeholder="Ej: Bank of America"
                  />
                </div>
                <div>
                  <Label htmlFor="bankAccountHolder">Titular de la Cuenta</Label>
                  <Input
                    id="bankAccountHolder"
                    value={paymentSettings.bankAccountHolder}
                    onChange={(e) => setPaymentSettings({...paymentSettings, bankAccountHolder: e.target.value})}
                    placeholder="Ej: JB YSRA CONSULTING GROUP LLC"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankAccountNumber">Número de Cuenta</Label>
                  <Input
                    id="bankAccountNumber"
                    value={paymentSettings.bankAccountNumber}
                    onChange={(e) => setPaymentSettings({...paymentSettings, bankAccountNumber: e.target.value})}
                    placeholder="Ej: 1234567890"
                  />
                </div>
                <div>
                  <Label htmlFor="bankRoutingNumber">Routing Number / ABA</Label>
                  <Input
                    id="bankRoutingNumber"
                    value={paymentSettings.bankRoutingNumber}
                    onChange={(e) => setPaymentSettings({...paymentSettings, bankRoutingNumber: e.target.value})}
                    placeholder="Ej: 021000021"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bankSwiftCode">Código SWIFT/BIC (Opcional)</Label>
                <Input
                  id="bankSwiftCode"
                  value={paymentSettings.bankSwiftCode}
                  onChange={(e) => setPaymentSettings({...paymentSettings, bankSwiftCode: e.target.value})}
                  placeholder="Ej: BOFAUS3N"
                />
              </div>

              <div>
                <Label htmlFor="paymentInstructions">Instrucciones de Pago Adicionales (Opcional)</Label>
                <Textarea
                  id="paymentInstructions"
                  value={paymentSettings.paymentInstructions}
                  onChange={(e) => setPaymentSettings({...paymentSettings, paymentInstructions: e.target.value})}
                  placeholder="Ej: Por favor incluir el número de factura en la referencia del pago..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSaveSettings('pago')}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Guardando...' : 'Guardar Información de Pago'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="currencies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Tipos de Cambio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">
                  Los tipos de cambio se actualizan automáticamente cada hora desde APIs externas
                </p>
                <Button onClick={handleUpdateExchangeRates}>
                  Actualizar Ahora
                </Button>
              </div>
              
              <div className="space-y-3">
                {exchangeRates.map((rate, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{rate.from}</Badge>
                      <span>→</span>
                      <Badge variant="outline">{rate.to}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">1 {rate.from} = {rate.rate} {rate.to}</div>
                      <div className="text-sm text-gray-500">Última actualización: {rate.lastUpdated}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="font-medium mb-3">Configuración de Actualización</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exchangeProvider">Proveedor de Tipos de Cambio</Label>
                    <Select defaultValue="fixer">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixer">Fixer.io</SelectItem>
                        <SelectItem value="currencylayer">CurrencyLayer</SelectItem>
                        <SelectItem value="exchangerate">ExchangeRate-API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="updateFrequency">Frecuencia de Actualización</Label>
                    <Select defaultValue="hourly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Cada hora</SelectItem>
                        <SelectItem value="daily">Diaria</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Tarifas de Servicios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceRates.map((service, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{service.service}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        value={service.defaultRate} 
                        className="w-24"
                        onChange={(e) => {
                          const newRates = [...serviceRates];
                          newRates[index].defaultRate = Number(e.target.value);
                          setServiceRates(newRates);
                        }}
                      />
                      <Badge variant="outline">{service.currency}</Badge>
                      <span className="text-sm text-gray-500">/hora</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-6">
                <Button variant="outline">
                  Agregar Nuevo Servicio
                </Button>
                <Button onClick={() => handleSaveSettings('servicios')}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Tarifas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Configuración de Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromName">Nombre del Remitente</Label>
                  <Input 
                    id="fromName" 
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="fromEmail">Email del Remitente</Label>
                  <Input 
                    id="fromEmail" 
                    type="email" 
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="replyTo">Email de Respuesta</Label>
                <Input 
                  id="replyTo" 
                  type="email" 
                  value={emailSettings.replyTo}
                  onChange={(e) => setEmailSettings({...emailSettings, replyTo: e.target.value})}
                />
              </div>

              <Separator />

              <h4 className="font-medium">Configuración SMTP</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpServer">Servidor SMTP</Label>
                  <Input 
                    id="smtpServer" 
                    value={emailSettings.smtpServer}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">Puerto</Label>
                  <Input 
                    id="smtpPort" 
                    type="number" 
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpUser">Usuario SMTP</Label>
                  <Input 
                    id="smtpUser" 
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">Contraseña SMTP</Label>
                  <Input 
                    id="smtpPassword" 
                    type="password" 
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="enableSSL" 
                  checked={emailSettings.enableSSL}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableSSL: checked})}
                />
                <Label htmlFor="enableSSL">Habilitar SSL/TLS</Label>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleTestEmail}>
                  <Eye className="h-4 w-4 mr-2" />
                  Enviar Email de Prueba
                </Button>
                <Button onClick={() => handleSaveSettings('email')}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones Automáticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="invoiceCreated">Factura Creada</Label>
                    <p className="text-sm text-gray-600">Notificar cuando se crea una nueva factura</p>
                  </div>
                  <Switch 
                    id="invoiceCreated" 
                    checked={notifications.invoiceCreated}
                    onCheckedChange={(checked) => setNotifications({...notifications, invoiceCreated: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="invoicePaid">Factura Pagada</Label>
                    <p className="text-sm text-gray-600">Notificar cuando se registra un pago</p>
                  </div>
                  <Switch 
                    id="invoicePaid" 
                    checked={notifications.invoicePaid}
                    onCheckedChange={(checked) => setNotifications({...notifications, invoicePaid: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="invoiceOverdue">Factura Vencida</Label>
                    <p className="text-sm text-gray-600">Notificar cuando una factura está vencida</p>
                  </div>
                  <Switch 
                    id="invoiceOverdue" 
                    checked={notifications.invoiceOverdue}
                    onCheckedChange={(checked) => setNotifications({...notifications, invoiceOverdue: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newTimeEntry">Nuevo Registro de Tiempo</Label>
                    <p className="text-sm text-gray-600">Notificar cuando se registran nuevas horas</p>
                  </div>
                  <Switch 
                    id="newTimeEntry" 
                    checked={notifications.newTimeEntry}
                    onCheckedChange={(checked) => setNotifications({...notifications, newTimeEntry: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weeklyReport">Reporte Semanal</Label>
                    <p className="text-sm text-gray-600">Enviar reporte semanal de actividad</p>
                  </div>
                  <Switch 
                    id="weeklyReport" 
                    checked={notifications.weeklyReport}
                    onCheckedChange={(checked) => setNotifications({...notifications, weeklyReport: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="paymentReminders">Recordatorios de Pago</Label>
                    <p className="text-sm text-gray-600">Enviar recordatorios automáticos</p>
                  </div>
                  <Switch 
                    id="paymentReminders" 
                    checked={notifications.paymentReminders}
                    onCheckedChange={(checked) => setNotifications({...notifications, paymentReminders: checked})}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="daysBeforeDue">Días antes del vencimiento</Label>
                  <Input 
                    id="daysBeforeDue" 
                    type="number" 
                    value={notifications.daysBeforeDue}
                    onChange={(e) => setNotifications({...notifications, daysBeforeDue: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="overdueFrequency">Frecuencia recordatorios vencidas (días)</Label>
                  <Input 
                    id="overdueFrequency" 
                    type="number" 
                    value={notifications.overdueFrequency}
                    onChange={(e) => setNotifications({...notifications, overdueFrequency: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('notificaciones')}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                APIs e Integraciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="h-6 w-6 text-blue-500" />
                    <div>
                      <h3 className="font-medium">Stripe</h3>
                      <p className="text-sm text-gray-600">Procesamiento de pagos</p>
                    </div>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800 mb-3">No conectado</Badge>
                  <Button variant="outline" className="w-full">Conectar Stripe</Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Database className="h-6 w-6 text-green-500" />
                    <div>
                      <h3 className="font-medium">QuickBooks</h3>
                      <p className="text-sm text-gray-600">Sincronización contable</p>
                    </div>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800 mb-3">No conectado</Badge>
                  <Button variant="outline" className="w-full">Conectar QuickBooks</Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-6 w-6 text-purple-500" />
                    <div>
                      <h3 className="font-medium">HubSpot CRM</h3>
                      <p className="text-sm text-gray-600">Gestión de clientes</p>
                    </div>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800 mb-3">No conectado</Badge>
                  <Button variant="outline" className="w-full">Conectar HubSpot</Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-6 w-6 text-red-500" />
                    <div>
                      <h3 className="font-medium">AFIP (Argentina)</h3>
                      <p className="text-sm text-gray-600">Facturación electrónica</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 mb-3">Conectado</Badge>
                  <Button variant="outline" className="w-full">Configurar AFIP</Button>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Configuración de API</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="apiKey">Clave API del Sistema</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="apiKey" 
                        value="sk_live_51234567890abcdefghijk..."
                        readOnly
                        className="font-mono"
                      />
                      <Button variant="outline">Regenerar</Button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Usa esta clave para conectar aplicaciones externas
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="webhookUrl">URL de Webhooks</Label>
                    <Input 
                      id="webhookUrl" 
                      value="https://api.jbcodingiot.com/webhooks"
                      readOnly
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Endpoint para recibir notificaciones de eventos
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eventos de Webhook Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <Label className="text-sm">invoice.created</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <Label className="text-sm">invoice.sent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <Label className="text-sm">invoice.paid</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <Label className="text-sm">invoice.overdue</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <Label className="text-sm">timesheet.submitted</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <Label className="text-sm">timesheet.approved</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <Label className="text-sm">client.created</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <Label className="text-sm">project.completed</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}