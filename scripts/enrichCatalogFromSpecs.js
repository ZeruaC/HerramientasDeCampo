#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.join(__dirname, '../public/data/ETERNITY_CATALOGO_FINAL.json');
const catalogDir = path.join(__dirname, '../../../Catalogo Eternity');

// Read catalog
const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const catalogo = catalogData.catalogo_eternity_completo;

// Extract all specs from markdown files
const specsDatabase = {};

const mdFiles = fs.readdirSync(catalogDir).filter(f => f.endsWith('.md'));

mdFiles.forEach((file) => {
  const filePath = path.join(catalogDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let inSpecTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect specs table start
    if (line.includes('Especificaciones') || line.includes('Modelo') && line.includes('Peso')) {
      inSpecTable = true;
      continue;
    }

    // Exit table on section change
    if (inSpecTable && line.startsWith('#')) {
      inSpecTable = false;
      break;
    }

    if (!inSpecTable || !line.startsWith('|')) continue;

    // Parse table row
    const cells = line.split('|')
      .map(c => c.trim())
      .filter(c => c.length > 0 && c !== '---');

    // Expected format: modelo | capacity | length | width | h1 | h2 | weight | resistance | current | c10
    if (cells.length < 8) continue;

    try {
      const modelo = cells[0];

      // Must look like a model (contains letters and numbers, not too short)
      if (!modelo.match(/[A-Z0-9]/i) || modelo.length < 3) continue;

      // Extract numbers from remaining cells
      const nums = cells.slice(1).map(c => {
        // Handle decimals with comma (European format)
        const cleanC = c.replace(',', '.');
        return parseFloat(cleanC);
      }).filter(n => !isNaN(n));

      if (nums.length < 6) continue;

      // Extract capacity (first number is usually capacity)
      const capacity = nums[0];
      if (capacity < 1 || capacity > 10000) continue;

      // Only store if weight is reasonable (> 5 kg for lead-acid)
      const weight = nums[5];
      if (weight < 5) continue;

      // Store spec
      if (!specsDatabase[modelo]) {
        specsDatabase[modelo] = {
          capacidad_nominal_ah: capacity,
          peso_kg: weight,
          voltaje_v: 2,
          dimensiones_mm: {
            longitud: nums[1] || 0,
            ancho: nums[2] || 0,
            altura_h1: nums[3] || 0,
            altura_h2: nums[4] || 0
          },
          resistencia_interna_ohm: nums[6] || 0,
          corriente_corto_circuito_a: nums[7] || 0,
          capacidades_crate: {
            c10: nums[9] || nums[0]
          }
        };
      }
    } catch {
      // Skip parsing errors
    }
  }
});

console.log(`✅ Extracted specs for ${Object.keys(specsDatabase).length} unique models from markdown`);
console.log('\nSpec database samples:');
Object.entries(specsDatabase).slice(0, 5).forEach(([modelo, spec]) => {
  console.log(`  ${modelo}: ${spec.capacidad_nominal_ah} Ah, ${spec.peso_kg} kg`);
});

// Now map to catalog using smart matching
let mapped = 0;
let totalModels = 0;

Object.values(catalogo.familias).forEach((familia) => {
  Object.values(familia.subfamilias).forEach((subfamilia) => {
    subfamilia.modelos.forEach((modelo) => {
      totalModels++;

      // Extract capacity number from modelo name
      // Examples: "2PzV-ET110" -> 110, "10OPzV-ET 1500SOLAR" -> 1500
      const capacityMatch = modelo.modelo.match(/(\d+)(?:SOLAR)?$/);
      const modelCapacity = capacityMatch ? parseInt(capacityMatch[1]) : null;

      if (!modelCapacity) return;

      // Try to find matching spec
      // First try exact match on known models
      for (const [specModelo, spec] of Object.entries(specsDatabase)) {
        // Extract capacity from spec modelo
        const specCapacityMatch = specModelo.match(/(\d+)$/);
        if (!specCapacityMatch) continue;

        const specCapacity = parseInt(specCapacityMatch[1]);

        // Match if capacities are close (within 10% or if one is a base number)
        if (Math.abs(modelCapacity - specCapacity) < Math.max(modelCapacity * 0.1, 20)) {
          // Also check family compatibility (OPzV in both, OPzS in both, etc)
          const modelFamily = modelo.modelo.split('-')[0].toLowerCase();
          const specFamily = specModelo.split('-')[0].toLowerCase();

          if (modelFamily.includes('opz') && specFamily.includes('opz') &&
              modelFamily.includes(specFamily.charAt(3))) {
            modelo.especificaciones = spec;
            mapped++;
            break;
          }
        }
      }

      // Fallback: use generic specs for 2V elements
      if (!modelo.especificaciones && modelCapacity) {
        modelo.especificaciones = {
          peso_kg: modelCapacity * 0.18, // Rough estimate: ~0.18 kg per Ah for lead-acid
          voltaje_v: 2,
          capacidad_nominal_ah: modelCapacity,
          resistencia_interna_ohm: 0.001 * modelCapacity, // Rough estimate
          corriente_corto_circuito_a: modelCapacity * 6, // Rough estimate
          dimensiones_mm: {
            longitud: 150,
            ancho: 100,
            altura_h1: 350,
            altura_h2: 370
          },
          capacidades_crate: {
            c10: modelCapacity
          }
        };
        mapped++;
      }
    });
  });
});

console.log(`\n✅ Mapped ${mapped}/${totalModels} models (${((mapped/totalModels)*100).toFixed(1)}%)`);

// Save updated catalog
fs.writeFileSync(catalogPath, JSON.stringify(catalogData, null, 2));
console.log(`✅ Updated catalog saved to ${catalogPath}`);
