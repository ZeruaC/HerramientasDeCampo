import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sqmhkswgfbvfwxcdkcmi.supabase.co';
const adminKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxbWhrc3dnZmJ2Znd4Y2RrY21pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDYwMTE0NiwiZXhwIjoyMTAwMTc3MTQ2fQ.TtAm5L9xXPjBiPNhTAiKjPSDaWxW7HT4MH1LVY5Vc4c';

const supabase = createClient(supabaseUrl, adminKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function checkTables() {
  console.log('📊 Verificando tablas en Supabase...\n');

  // Check if tables exist by querying information_schema
  const { data: tables } = await supabase.rpc('get_tables', {}).catch(() => ({ data: null }));

  // Alternative: check by trying to select
  const checkTable = async (tableName) => {
    const { data, error } = await supabase
      .from(tableName)
      .select('count', { count: 'exact' })
      .limit(1);
    return !error;
  };

  const tableNames = ['profiles', 'products', 'proposals', 'prices'];
  console.log('Tablas disponibles:');
  for (const table of tableNames) {
    const exists = await checkTable(table);
    console.log(`  ${exists ? '✅' : '❌'} ${table}`);
  }

  // Show schema for prices table
  console.log('\n📋 Estructura sugerida para tabla "prices":');
  console.log(`
CREATE TABLE prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  model_name TEXT NOT NULL UNIQUE,
  currency TEXT DEFAULT 'EUR',
  price DECIMAL(10, 2),
  effective_date DATE DEFAULT CURRENT_DATE,
  valid_until DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policy: Anyone can read prices
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "prices_read" ON prices FOR SELECT USING (true);

-- Only authenticated users can insert/update
CREATE POLICY "prices_write" ON prices FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "prices_update" ON prices FOR UPDATE USING (auth.role() = 'authenticated');
  `);
}

checkTables();
