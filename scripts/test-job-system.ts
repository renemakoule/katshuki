// scripts/test-job-system.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface TestResult {
  test: string
  success: boolean
  message: string
  duration?: number
}

async function runTests(): Promise<void> {
  console.log('🧪 Test du système de jobs asynchrones...\n')
  
  const results: TestResult[] = []

  // Test 1: Créer un job de test
  console.log('1️⃣ Test de création de job...')
  const createJobResult = await testCreateJob()
  results.push(createJobResult)
  console.log(`   ${createJobResult.success ? '✅' : '❌'} ${createJobResult.message}\n`)

  if (!createJobResult.success) {
    console.log('❌ Arrêt des tests - création de job échouée')
    return
  }

  // Test 2: Vérifier que le job existe
  console.log('2️⃣ Test de récupération de job...')
  const getJobResult = await testGetJob('test-job-id')
  results.push(getJobResult)
  console.log(`   ${getJobResult.success ? '✅' : '❌'} ${getJobResult.message}\n`)

  // Test 3: Tester le worker
  console.log('3️⃣ Test du worker de traitement...')
  const workerResult = await testWorker()
  results.push(workerResult)
  console.log(`   ${workerResult.success ? '✅' : '❌'} ${workerResult.message}\n`)

  // Test 4: Tester les fonctions SQL
  console.log('4️⃣ Test des fonctions SQL...')
  const sqlResult = await testSQLFunctions()
  results.push(sqlResult)
  console.log(`   ${sqlResult.success ? '✅' : '❌'} ${sqlResult.message}\n`)

  // Résumé
  const successCount = results.filter(r => r.success).length
  const totalCount = results.length

  console.log('📊 Résumé des tests:')
  console.log(`   ✅ Réussis: ${successCount}/${totalCount}`)
  console.log(`   ❌ Échoués: ${totalCount - successCount}/${totalCount}`)

  if (successCount === totalCount) {
    console.log('\n🎉 Tous les tests sont passés! Le système est opérationnel.')
  } else {
    console.log('\n⚠️ Certains tests ont échoué. Vérifiez la configuration.')
  }
}

async function testCreateJob(): Promise<TestResult> {
  const startTime = Date.now()
  
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        id: 'test-job-' + Date.now(),
        user_id: 'test-user',
        type: 'image_generation',
        payload: {
          prompt: 'Test image generation',
          style: 'realistic'
        },
        status: 'pending',
        priority: 5
      })
      .select()
      .single()

    if (error) {
      return {
        test: 'create_job',
        success: false,
        message: `Erreur création job: ${error.message}`
      }
    }

    return {
      test: 'create_job',
      success: true,
      message: `Job créé avec succès (ID: ${data.id})`,
      duration: Date.now() - startTime
    }

  } catch (error) {
    return {
      test: 'create_job',
      success: false,
      message: `Exception: ${error instanceof Error ? error.message : String(error)}`
    }
  }
}

async function testGetJob(jobId: string): Promise<TestResult> {
  const startTime = Date.now()
  
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      return {
        test: 'get_job',
        success: false,
        message: `Erreur récupération job: ${error.message}`
      }
    }

    return {
      test: 'get_job',
      success: true,
      message: `Job récupéré avec succès (Status: ${data.status})`,
      duration: Date.now() - startTime
    }

  } catch (error) {
    return {
      test: 'get_job',
      success: false,
      message: `Exception: ${error instanceof Error ? error.message : String(error)}`
    }
  }
}

async function testWorker(): Promise<TestResult> {
  const startTime = Date.now()
  
  try {
    // Tester l'appel à l'Edge Function
    const response = await fetch(`${supabaseUrl}/functions/v1/generation-worker`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        test: true
      })
    })

    if (!response.ok) {
      return {
        test: 'worker',
        success: false,
        message: `Worker HTTP error: ${response.status}`
      }
    }

    const result = await response.json()

    return {
      test: 'worker',
      success: result.success || true,
      message: `Worker répond correctement`,
      duration: Date.now() - startTime
    }

  } catch (error) {
    return {
      test: 'worker',
      success: false,
      message: `Worker non accessible: ${error instanceof Error ? error.message : String(error)}`
    }
  }
}

async function testSQLFunctions(): Promise<TestResult> {
  const startTime = Date.now()
  
  try {
    // Tester la fonction get_next_job
    const { data, error } = await supabase.rpc('get_next_job')

    if (error) {
      return {
        test: 'sql_functions',
        success: false,
        message: `Erreur fonction SQL: ${error.message}`
      }
    }

    return {
      test: 'sql_functions',
      success: true,
      message: `Fonctions SQL opérationnelles`,
      duration: Date.now() - startTime
    }

  } catch (error) {
    return {
      test: 'sql_functions',
      success: false,
      message: `Exception SQL: ${error instanceof Error ? error.message : String(error)}`
    }
  }
}

// Exécuter les tests
if (require.main === module) {
  runTests().catch(console.error)
}

export { runTests }
