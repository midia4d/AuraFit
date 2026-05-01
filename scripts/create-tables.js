// Script to test and verify AuraFit Supabase connection
// Run with: node scripts/create-tables.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://kwkfvarmzjjpcjtxyudd.supabase.co'
const serviceKey  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3a2Z2YXJtempqcGNqdHh5dWRkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjI2MDY1OCwiZXhwIjoyMDkxODM2NjU4fQ.nZTPq-1ITqRVG55NNV0NyIrJU42sOmA1-XqrdgYdiac'

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false }
})

const tableNames = ['user_profiles', 'workout_logs', 'sleep_logs', 'mood_logs']

async function run () {
  console.log('🔌 AuraFit — Verificando conexão com Supabase...\n')

  let allOk = true

  for (const table of tableNames) {
    process.stdout.write(`  Checking table "${table}"... `)
    const { data, error } = await supabase.from(table).select('*').limit(1)
    if (error) {
      console.log(`✗ ${error.message}`)
      allOk = false
    } else {
      console.log('✓ OK')
    }
  }

  console.log()
  if (allOk) {
    console.log('✅ Supabase pronto! Todas as tabelas existem.')
    console.log('🌐 App running at: http://localhost:3000\n')
  } else {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 AÇÃO NECESSÁRIA: Crie as tabelas no Supabase Dashboard')
    console.log()
    console.log('1. Abra: https://supabase.com/dashboard/project/kwkfvarmzjjpcjtxyudd/sql/new')
    console.log('2. Cole o conteúdo do arquivo: prisma/supabase-schema.sql')
    console.log('3. Clique em "Run"')
    console.log('4. Execute este script novamente para verificar')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log()
    console.log('⚡ O app funciona normalmente sem o Supabase (localStorage).')
    console.log('   O Supabase apenas adiciona backup em nuvem dos dados.\n')
  }
}

run().catch(console.error)
