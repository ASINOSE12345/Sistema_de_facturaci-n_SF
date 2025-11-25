#!/usr/bin/env node
/**
 * Script de prueba de persistencia
 * Verifica que los datos se guarden correctamente en la base de datos
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');

const dbPath = process.env.DATABASE_URL || `file:${path.join(__dirname, '../data/invoice_system.db')}`;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbPath,
    },
  },
});

async function testPersistence() {
  console.log('🧪 PRUEBA DE PERSISTENCIA\n');
  console.log('='.repeat(60));
  
  try {
    // Conectar a BD
    await prisma.$connect();
    console.log('✅ Conexión a base de datos establecida\n');
    
    // 1. Verificar estado inicial
    console.log('📊 ESTADO INICIAL:');
    const initialProjects = await prisma.project.count();
    const initialInvoices = await prisma.invoice.count();
    const initialClients = await prisma.client.count();
    
    console.log(`   Proyectos: ${initialProjects}`);
    console.log(`   Facturas: ${initialInvoices}`);
    console.log(`   Clientes: ${initialClients}\n`);
    
    // 2. Verificar que hay al menos un cliente para crear proyecto
    const clients = await prisma.client.findMany({ take: 1 });
    if (clients.length === 0) {
      console.log('⚠️  No hay clientes en la BD. Creando cliente de prueba...\n');
      
      // Buscar un usuario
      const user = await prisma.user.findFirst();
      if (!user) {
        console.log('❌ No hay usuarios en la BD. Por favor, crea un usuario primero.');
        return;
      }
      
      // Crear cliente de prueba
      const testClient = await prisma.client.create({
        data: {
          userId: user.id,
          businessName: 'Cliente de Prueba',
          contactName: 'Contacto Prueba',
          email: 'test@example.com',
          taxId: 'TEST-123',
          address: 'Dirección de Prueba',
          country: 'US',
        },
      });
      console.log(`✅ Cliente de prueba creado: ${testClient.id}\n`);
      
      // Usar este cliente
      const clientId = testClient.id;
      const userId = user.id;
      
      // 3. Crear proyecto de prueba
      console.log('📝 CREANDO PROYECTO DE PRUEBA...');
      const testProject = await prisma.project.create({
        data: {
          userId,
          clientId,
          name: 'Proyecto de Prueba - ' + new Date().toISOString(),
          description: 'Este es un proyecto de prueba para verificar persistencia',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 días
          budget: 10000,
          currency: 'USD',
          hoursEstimated: 100,
        },
      });
      console.log(`✅ Proyecto creado: ${testProject.id}`);
      console.log(`   Nombre: ${testProject.name}`);
      console.log(`   Estado: ${testProject.status}\n`);
      
      // 4. Verificar que el proyecto se guardó
      console.log('🔍 VERIFICANDO PERSISTENCIA...');
      const savedProject = await prisma.project.findUnique({
        where: { id: testProject.id },
        include: { client: true },
      });
      
      if (savedProject) {
        console.log('✅ Proyecto encontrado en BD:');
        console.log(`   ID: ${savedProject.id}`);
        console.log(`   Nombre: ${savedProject.name}`);
        console.log(`   Cliente: ${savedProject.client.businessName}`);
        console.log(`   Creado: ${savedProject.createdAt}\n`);
      } else {
        console.log('❌ ERROR: El proyecto no se encontró en la BD\n');
        return;
      }
      
      // 5. Consultar directamente con SQLite
      console.log('🔍 VERIFICACIÓN DIRECTA EN SQLite...');
      const { execSync } = require('child_process');
      const dbFile = dbPath.replace('file:', '');
      
      try {
        const result = execSync(
          `sqlite3 "${dbFile}" "SELECT id, name, status, createdAt FROM projects WHERE id='${testProject.id}';"`,
          { encoding: 'utf-8' }
        );
        
        if (result.trim()) {
          console.log('✅ Proyecto encontrado en consulta directa SQLite:');
          console.log(`   ${result.trim()}\n`);
        } else {
          console.log('❌ ERROR: Proyecto no encontrado en consulta directa\n');
        }
      } catch (error) {
        console.log('⚠️  No se pudo ejecutar consulta directa (sqlite3 no disponible)\n');
      }
      
      // 6. Limpiar - Eliminar proyecto de prueba
      console.log('🧹 LIMPIANDO...');
      await prisma.project.delete({
        where: { id: testProject.id },
      });
      console.log('✅ Proyecto de prueba eliminado\n');
      
      // Eliminar cliente de prueba si fue creado
      if (clients.length === 0) {
        await prisma.client.delete({
          where: { id: testClient.id },
        });
        console.log('✅ Cliente de prueba eliminado\n');
      }
      
      // 7. Resultado final
      console.log('='.repeat(60));
      console.log('✅ PRUEBA COMPLETADA EXITOSAMENTE');
      console.log('✅ La persistencia está funcionando correctamente\n');
      
    } else {
      console.log('ℹ️  Ya hay datos en la BD. Para probar persistencia:');
      console.log('   1. Crea un proyecto desde la UI');
      console.log('   2. Ejecuta este script para verificar\n');
    }
    
  } catch (error) {
    console.error('❌ ERROR EN PRUEBA:');
    console.error(`   ${error.message}`);
    if (error.code) {
      console.error(`   Código: ${error.code}`);
    }
    if (error.meta) {
      console.error(`   Meta: ${JSON.stringify(error.meta)}`);
    }
    console.error('\n');
  } finally {
    await prisma.$disconnect();
  }
}

testPersistence();

