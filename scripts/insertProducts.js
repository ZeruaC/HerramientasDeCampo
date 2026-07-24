#!/usr/bin/env node

/**
 * Script to insert all 603 products from ETERNITY_CATALOGO_FINAL.json into Supabase
 * Run: node scripts/insertProducts.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.join(__dirname, '../public/data/ETERNITY_CATALOGO_FINAL.json');

async function insertProducts() {
  try {
    // Read catalog
    console.log('📖 Reading catalog from:', catalogPath);
    const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    const catalogo = catalogData.catalogo_eternity_completo;

    console.log(`✅ Catalog loaded: ${catalogo.total_modelos} models`);

    // Extract all products
    const productos = [];
    Object.entries(catalogo.familias).forEach(([, familia]) => {
      Object.entries(familia.subfamilias).forEach(([, subfamilia]) => {
        subfamilia.modelos.forEach(modelo => {
          productos.push({
            model_name: modelo.modelo,
            familia: modelo.familia,
            subfamilia: modelo.subfamilia,
            specifications: modelo // Store entire model object as JSON
          });
        });
      });
    });

    console.log(`📦 Extracted ${productos.length} products`);

    // Generate SQL
    const sql = generateSQL(productos);

    // Save SQL to file
    const sqlPath = path.join(__dirname, '../supabase/migrations/002_insert_products.sql');
    fs.writeFileSync(sqlPath, sql);

    console.log(`✅ SQL generated at: ${sqlPath}`);
    console.log(`📝 Run this SQL in Supabase to insert all products`);
    console.log('\n' + '='.repeat(60));
    console.log('NEXT STEP: Execute the generated SQL in Supabase console');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

function generateSQL(productos) {
  const sqlLines = [
    '-- Insert 603 Eternity catalog products',
    `-- Generated: ${new Date().toISOString()}`,
    '-- Total products: ' + productos.length,
    '',
    'BEGIN;',
    ''
  ];

  productos.forEach((prod) => {
    const modelEscaped = prod.model_name.replace(/'/g, "''");
    const familiaEscaped = prod.familia.replace(/'/g, "''");
    const subfamiliaEscaped = prod.subfamilia.replace(/'/g, "''");
    const specsJSON = JSON.stringify(prod.specifications).replace(/'/g, "''");

    sqlLines.push(
      `INSERT INTO public.products (model_name, familia, subfamilia, specifications) VALUES ('${modelEscaped}', '${familiaEscaped}', '${subfamiliaEscaped}', '${specsJSON}'::jsonb) ON CONFLICT (model_name) DO NOTHING;`
    );
  });

  sqlLines.push('');
  sqlLines.push('COMMIT;');
  sqlLines.push('');
  sqlLines.push(`-- Verify: SELECT COUNT(*) FROM public.products;`);

  return sqlLines.join('\n');
}

// Run
insertProducts();
