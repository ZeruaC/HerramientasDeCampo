#!/usr/bin/env node

/**
 * Script para importar precios desde Excel a Supabase
 *
 * Uso:
 *   1. Prepara tu Excel con columnas: modelo, precio, moneda (opcional)
 *   2. Exporta como CSV: modelo,precio,moneda
 *   3. Coloca el CSV en: data/precios.csv
 *   4. Ejecuta: node scripts/importPricesFromExcel.js
 *
 * Ejemplo CSV:
 *   modelo,precio,moneda
 *   10OPzV-ET 1000,2500,EUR
 *   10OPzV-ET 1100,2750,EUR
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.join(__dirname, '../data/precios.csv');

const supabaseUrl = 'https://sqmhkswgfbvfwxcdkcmi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxbWhrc3dnZmJ2Znd4Y2RrY21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MDExNDYsImV4cCI6MjEwMDE3NzE0Nn0._hSDoCTVi700MtxY5MP4hDqjXSt6MhJqCbDvomIiXxY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function importPrices() {
  try {
    if (!fs.existsSync(csvPath)) {
      console.error(`❌ Archivo no encontrado: ${csvPath}`);
      console.log('\n📋 Crear archivo CSV con formato:');
      console.log('modelo,precio,moneda');
      console.log('10OPzV-ET 1000,2500,EUR');
      console.log('10OPzV-ET 1100,2750,EUR');
      process.exit(1);
    }

    console.log('📖 Leyendo precios...');
    const csvContent = fs.readFileSync(csvPath, 'utf8');

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true
    });

    console.log(`✅ ${records.length} registros encontrados\n`);

    // Preparar datos
    const prices = records.map(row => ({
      model_name: row.modelo?.trim(),
      price: parseFloat(row.precio),
      currency: (row.moneda || 'EUR').trim(),
      effective_date: new Date().toISOString().split('T')[0]
    })).filter(p => p.model_name && !isNaN(p.price));

    console.log(`📝 Insertando ${prices.length} precios en Supabase...\n`);

    // Insert en batches
    let inserted = 0;
    let failed = 0;

    for (let i = 0; i < prices.length; i += 100) {
      const batch = prices.slice(i, i + 100);

      const { data, error } = await supabase
        .from('prices')
        .upsert(batch, { onConflict: 'model_name' });

      if (error) {
        console.error(`❌ Batch ${Math.floor(i / 100) + 1} falló:`, error.message);
        failed += batch.length;
      } else {
        inserted += batch.length;
        console.log(`✅ Batch ${Math.floor(i / 100) + 1} completado (${inserted}/${prices.length})`);
      }
    }

    console.log(`\n📊 Resultado:`);
    console.log(`  ✅ Insertados: ${inserted}`);
    console.log(`  ❌ Fallidos: ${failed}`);

    // Verificar
    const { count } = await supabase
      .from('prices')
      .select('count', { count: 'exact' });

    console.log(`\n💾 Total de precios en BD: ${count || 0}`);

  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

importPrices();
