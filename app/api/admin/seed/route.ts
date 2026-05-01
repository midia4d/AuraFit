import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase-service'

// Import current hardcoded data
import { exercises } from '@/lib/exercises-data'
import { dietPlans } from '@/lib/diet-data'

export async function POST() {
  try {
    // 1. Seed Exercises
    const flatExercises = exercises.map(ex => ({
      id: ex.id,
      name: ex.name,
      name_en: ex.nameEN,
      muscle_group: ex.muscleGroup,
      muscles_worked: ex.musclesWorked,
      muscles_worked_en: ex.musclesWorkedEN,
      description: ex.description,
      description_en: ex.descriptionEN,
      difficulty: ex.difficulty,
      image_url: ex.image,
      is_active: true
    }))

    await supabaseService.from('exercises').delete().neq('id', 'placeholder')
    const { error: exErr } = await supabaseService.from('exercises').insert(flatExercises)
    if (exErr) throw exErr

    // 2. Seed Diet Plans & Meals
    const dietPlansToSeed = dietPlans

    let dietsInserted = 0
    let mealsInserted = 0

    await supabaseService.from('diet_plans').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    for (let j = 0; j < dietPlansToSeed.length; j++) {
      const d = dietPlansToSeed[j]
      
      // Insert plan
      const { data: plan, error: planErr } = await supabaseService.from('diet_plans').insert({
        name: d.name,
        name_en: d.nameEN,
        goal: d.goal,
        total_calories: d.totalCalories,
        protein_g: d.protein,
        carbs_g: d.carbs,
        fats_g: d.fats,
        is_premium: d.isPremium,
        is_active: true
      }).select().single()

      if (planErr) throw planErr
      dietsInserted++

      const mealsToInsert = []
      let i = 0
      for (const t of Object.keys(d.meals)) {
        const mealType = t as keyof typeof d.meals
        const meal = d.meals[mealType]
        if (!meal) continue

        mealsToInsert.push({
          plan_id: plan.id,
          meal_type: mealType,
          name: meal.name,
          name_en: meal.nameEN || meal.name,
          calories: meal.calories,
          protein_g: meal.protein,
          carbs_g: meal.carbs,
          fats_g: meal.fats,
          foods: meal.foods,
          foods_en: meal.foodsEN || meal.foods,
          sort_order: i++
        })
      }

      if (mealsToInsert.length > 0) {
        await supabaseService.from('diet_meals').delete().eq('plan_id', plan.id)
        const { error: mealsErr } = await supabaseService.from('diet_meals').insert(mealsToInsert)
        if (mealsErr) throw mealsErr
        mealsInserted += mealsToInsert.length
      }
    }

    return NextResponse.json({ 
      success: true, 
      migrated: { 
        exercises: flatExercises.length, 
        dietPlans: dietsInserted, 
        meals: mealsInserted 
      } 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
