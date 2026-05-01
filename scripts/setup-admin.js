// Script to create the initial admin user using the Supabase Service Role key
// and trigger the seed API to migrate local data.
// Run with: node scripts/setup-admin.js

const { createClient } = require('@supabase/supabase-js')
const https = require('http') // nextjs dev server runs on http

const supabaseUrl = 'https://kwkfvarmzjjpcjtxyudd.supabase.co'
const serviceKey  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3a2Z2YXJtempqcGNqdHh5dWRkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjI2MDY1OCwiZXhwIjoyMDkxODM2NjU4fQ.nZTPq-1ITqRVG55NNV0NyIrJU42sOmA1-XqrdgYdiac'

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const ADMIN_EMAIL = 'admin@aurafit.com' // You can change this later
const ADMIN_PASS  = 'AuraFit2026!'

async function run() {
  console.log('🚀 Configurando Admin e populando banco de dados...\n')

  try {
    // 1. Create Admin User
    console.log('1. Criando usuário admin...')
    const { data: user, error: createErr } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASS,
      email_confirm: true
    })

    let adminId = user?.user?.id

    if (createErr) {
      if (createErr.message.includes('already been registered')) {
        console.log('   ✓ Usuário admin já existe. Buscando ID...')
        const { data: users } = await supabase.auth.admin.listUsers()
        const existing = users.users.find(u => u.email === ADMIN_EMAIL)
        if (existing) adminId = existing.id
      } else {
        throw createErr
      }
    } else {
      console.log('   ✓ Admin auth criado.')
    }

    // 2. Insert into admin_users table
    console.log('\n2. Adicionando permissões de admin...')
    if (adminId) {
      const { error: insertErr } = await supabase.from('admin_users').upsert({
        id: adminId,
        email: ADMIN_EMAIL,
        name: 'Equipe AuraFit'
      })
      if (insertErr) throw insertErr
      console.log('   ✓ Tabela admin_users populada.')
    }

    // 3. Trigger Seed API
    console.log('\n3. Migrando 45 exercícios e 6 dietas para o Supabase...')
    console.log('   (O servidor Next.js precisa estar rodando na porta 3000)')
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/seed',
      method: 'POST'
    }

    const req = https.request(options, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        const result = JSON.parse(data)
        if (result.success) {
          console.log(`   ✓ Migração concluída!`)
          console.log(`     - Exercícios: ${result.migrated.exercises}`)
          console.log(`     - Planos: ${result.migrated.dietPlans}`)
          console.log(`     - Refeições: ${result.migrated.meals}`)
          
          console.log('\n✅ SETUP COMPLETO!')
          console.log('\n   Acesso ao painel:')
          console.log(`   [Email]: ${ADMIN_EMAIL}`)
          console.log(`   [Senha]: ${ADMIN_PASS}`)
          console.log('\n   Acesse: http://localhost:3000/admin\n')
        } else {
          console.log(`   ❌ Erro na migração: ${result.error}`)
        }
      })
    })

    req.on('error', error => {
      console.log(`   ❌ Servidor não está rodando. O script de auth funcionou, mas a migração falhou.`)
      console.log(`   ➜ Inicie o servidor (start-dev.bat) e rode "node scripts/setup-admin.js" novamente.`)
    })

    req.end()

  } catch (err) {
    console.error('\n❌ ERRO:', err)
  }
}

run()
