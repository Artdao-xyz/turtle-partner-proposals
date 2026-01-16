#!/usr/bin/env node

/**
 * Script para testear la imagen de Open Graph localmente
 * 
 * Uso:
 * 1. Ejecuta el servidor: pnpm dev
 * 2. En otra terminal: node scripts/test-og-image.js
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/opengraph-image',
  method: 'GET',
};

console.log('🔍 Testing Open Graph image...\n');
console.log(`📍 URL: http://${options.hostname}:${options.port}${options.path}\n`);

const req = http.request(options, (res) => {
  console.log(`✅ Status: ${res.statusCode}`);
  console.log(`📦 Content-Type: ${res.headers['content-type']}`);
  console.log(`📏 Content-Length: ${res.headers['content-length']} bytes\n`);

  if (res.statusCode === 200) {
    console.log('✅ La imagen se generó correctamente!');
    console.log(`\n🌐 Abre en tu navegador: http://${options.hostname}:${options.port}${options.path}`);
  } else {
    console.log('❌ Error al generar la imagen');
  }
});

req.on('error', (e) => {
  console.error(`❌ Error: ${e.message}`);
  console.log('\n💡 Asegúrate de que el servidor esté corriendo: pnpm dev');
});

req.end();
