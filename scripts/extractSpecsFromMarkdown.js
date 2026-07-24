#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogDir = path.join(__dirname, '../../../Catalogo Eternity');
const catalogPath = path.join(__dirname, '../public/data/ETERNITY_CATALOGO_FINAL.json');

// Read existing catalog
const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const catalogo = catalogData.catalogo_eternity_completo;

// Specs map: modelo -> specs
const specsMap = {};

// Process all markdown files
const mdFiles = fs.readdirSync(catalogDir).filter(f => f.endsWith('.md')).sort();
console.log(`📄 Found ${mdFiles.length} markdown files`);

mdFiles.forEach((file) => {
  const filePath = path.join(catalogDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract table rows - look for lines with model data
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines and headers
    if (!line || line.startsWith('|') && line.includes('---')) continue;

    // Look for lines that start with pipe and contain numbers (table data rows)
    if (!line.startsWith('|')) continue;

    // Remove pipes and split by spaces
    const cleanLine = line.replace(/\|/g, ' ').trim();
    const tokens = cleanLine.split(/\s+/).filter(t => t.length > 0);

    // Model line should have: modelo, capacity, length, width, h1, h2, weight, resistance, current, c10
    // At least 10 tokens, first one should be a model name
    if (tokens.length < 10) continue;

    const modelName = tokens[0];

    // Check if looks like a model (starts with digit or letter)
    if (!modelName.match(/^[0-9A-Z]/)) continue;

    // Try to parse numbers - need at least some to be valid floats
    const nums = tokens.slice(1).map(t => parseFloat(t)).filter(n => !isNaN(n));

    if (nums.length < 6) continue; // Need at least 6 numeric fields

    try {
      // Expected format: modelo | capacity | length | width | h1 | h2 | weight | resistance | current | c10
      const specs = {
        peso_kg: nums[5] || 0,
        voltaje_v: 2,
        capacidad_nominal_ah: nums[0] || 0,
        resistencia_interna_ohm: nums[6] || 0,
        corriente_corto_circuito_a: nums[7] || 0,
        dimensiones_mm: {
          longitud: nums[1] || 0,
          ancho: nums[2] || 0,
          altura_h1: nums[3] || 0,
          altura_h2: nums[4] || 0
        },
        capacidades_crate: {
          c10: nums[9] || nums[0]
        }
      };

      // Only store if we have meaningful weight or resistance
      if (specs.peso_kg > 0 || specs.resistencia_interna_ohm > 0) {
        specsMap[modelName] = specs;
        console.log(`  ✓ ${modelName}: ${specs.capacidad_nominal_ah} Ah, ${specs.peso_kg} kg`);
      }
    } catch {
      // Skip
    }
  }
});

console.log(`\n✅ Extracted specs for ${Object.keys(specsMap).length} models`);

// Update catalog with extracted specs
let updated = 0;
Object.values(catalogo.familias).forEach((familia) => {
  Object.values(familia.subfamilias).forEach((subfamilia) => {
    subfamilia.modelos.forEach((modelo) => {
      if (specsMap[modelo.modelo]) {
        modelo.especificaciones = specsMap[modelo.modelo];
        updated++;
      }
    });
  });
});

console.log(`🔄 Updated ${updated} models with specifications`);

// Save updated catalog
fs.writeFileSync(catalogPath, JSON.stringify(catalogData, null, 2));
console.log(`✅ Saved updated catalog`);

// Report coverage
const total = Object.values(catalogo.familias)
  .flatMap(f => Object.values(f.subfamilias))
  .flatMap(sf => sf.modelos).length;

console.log(`\n📊 Coverage: ${updated}/${total} models (${((updated/total)*100).toFixed(1)}%)`);
