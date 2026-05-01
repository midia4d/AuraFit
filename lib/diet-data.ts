// Diet plans for AuraFi

export interface Meal {
  name: string
  nameEN: string
  calories: number
  protein: number
  carbs: number
  fats: number
  foods: string[]
  foodsEN: string[]
}

export interface DietPlan {
  id: string
  goal: 'bulking' | 'cutting' | 'definition' | 'maintenance'
  name: string
  nameEN: string
  totalCalories: number
  protein: number
  carbs: number
  fats: number
  isPremium: boolean
  meals: {
    breakfast: Meal
    snack1: Meal
    lunch: Meal
    snack2: Meal
    dinner: Meal
    snack3: Meal
  }
}

export const dietPlans: DietPlan[] = [
  // BULKING PLAN
  {
    id: 'bulking-basic',
    goal: 'bulking',
    name: 'Ganho de Massa - Básico',
    nameEN: 'Muscle Gain - Basic',
    totalCalories: 3200,
    protein: 200,
    carbs: 400,
    fats: 90,
    isPremium: false,
    meals: {
      breakfast: {
        name: 'Café da Manhã',
        nameEN: 'Breakfast',
        calories: 650,
        protein: 35,
        carbs: 80,
        fats: 18,
        foods: ['4 ovos mexidos', '2 fatias de pão integral', '1 banana', '200ml de leite', '1 colher de pasta de amendoim'],
        foodsEN: ['4 scrambled eggs', '2 slices whole wheat bread', '1 banana', '200ml milk', '1 tbsp peanut butter']
      },
      snack1: {
        name: 'Lanche da Manhã',
        nameEN: 'Morning Snack',
        calories: 400,
        protein: 30,
        carbs: 45,
        fats: 10,
        foods: ['Whey protein 30g', '1 maçã', '30g de aveia'],
        foodsEN: ['30g whey protein', '1 apple', '30g oats']
      },
      lunch: {
        name: 'Almoço',
        nameEN: 'Lunch',
        calories: 900,
        protein: 60,
        carbs: 100,
        fats: 25,
        foods: ['200g frango grelhado', '150g arroz integral', '100g batata doce', 'Salada verde', '1 colher de azeite'],
        foodsEN: ['200g grilled chicken', '150g brown rice', '100g sweet potato', 'Green salad', '1 tbsp olive oil']
      },
      snack2: {
        name: 'Lanche da Tarde',
        nameEN: 'Afternoon Snack',
        calories: 450,
        protein: 25,
        carbs: 50,
        fats: 12,
        foods: ['Sanduíche natural (peito de peru, queijo)', '1 iogurte grego'],
        foodsEN: ['Natural sandwich (turkey breast, cheese)', '1 Greek yogurt']
      },
      dinner: {
        name: 'Jantar',
        nameEN: 'Dinner',
        calories: 750,
        protein: 50,
        carbs: 90,
        fats: 20,
        foods: ['180g carne vermelha magra', '120g arroz integral', 'Brócolis no vapor', 'Salada'],
        foodsEN: ['180g lean red meat', '120g brown rice', 'Steamed broccoli', 'Salad']
      },
      snack3: {
        name: 'Ceia',
        nameEN: 'Evening Snack',
        calories: 300,
        protein: 25,
        carbs: 15,
        fats: 15,
        foods: ['Caseína 30g', '10 amêndoas'],
        foodsEN: ['30g casein', '10 almonds']
      }
    }
  },

  // CUTTING PLAN
  {
    id: 'cutting-basic',
    goal: 'cutting',
    name: 'Perda de Peso - Básico',
    nameEN: 'Weight Loss - Basic',
    totalCalories: 2000,
    protein: 170,
    carbs: 150,
    fats: 60,
    isPremium: false,
    meals: {
      breakfast: {
        name: 'Café da Manhã',
        nameEN: 'Breakfast',
        calories: 400,
        protein: 30,
        carbs: 35,
        fats: 12,
        foods: ['3 claras + 1 ovo inteiro', '2 fatias de pão integral light', 'Café preto'],
        foodsEN: ['3 egg whites + 1 whole egg', '2 slices light whole wheat bread', 'Black coffee']
      },
      snack1: {
        name: 'Lanche da Manhã',
        nameEN: 'Morning Snack',
        calories: 250,
        protein: 25,
        carbs: 20,
        fats: 8,
        foods: ['Whey protein 25g', '1 maçã pequena'],
        foodsEN: ['25g whey protein', '1 small apple']
      },
      lunch: {
        name: 'Almoço',
        nameEN: 'Lunch',
        calories: 550,
        protein: 45,
        carbs: 50,
        fats: 15,
        foods: ['150g frango grelhado', '80g arroz integral', 'Salada abundante', 'Legumes cozidos'],
        foodsEN: ['150g grilled chicken', '80g brown rice', 'Abundant salad', 'Cooked vegetables']
      },
      snack2: {
        name: 'Lanche da Tarde',
        nameEN: 'Afternoon Snack',
        calories: 250,
        protein: 20,
        carbs: 15,
        fats: 10,
        foods: ['1 iogurte grego 0% gordura', '10 amêndoas'],
        foodsEN: ['1 fat-free Greek yogurt', '10 almonds']
      },
      dinner: {
        name: 'Jantar',
        nameEN: 'Dinner',
        calories: 500,
        protein: 45,
        carbs: 30,
        fats: 15,
        foods: ['150g peixe grelhado', 'Salada verde grande', 'Legumes grelhados'],
        foodsEN: ['150g grilled fish', 'Large green salad', 'Grilled vegetables']
      },
      snack3: {
        name: 'Ceia',
        nameEN: 'Evening Snack',
        calories: 200,
        protein: 25,
        carbs: 5,
        fats: 8,
        foods: ['Caseína 25g', 'Chá verde'],
        foodsEN: ['25g casein', 'Green tea']
      }
    }
  },

  // DEFINITION PLAN
  {
    id: 'definition-basic',
    goal: 'definition',
    name: 'Definição Muscular - Básico',
    nameEN: 'Muscle Definition - Basic',
    totalCalories: 2400,
    protein: 180,
    carbs: 200,
    fats: 70,
    isPremium: false,
    meals: {
      breakfast: {
        name: 'Café da Manhã',
        nameEN: 'Breakfast',
        calories: 480,
        protein: 35,
        carbs: 45,
        fats: 14,
        foods: ['3 ovos mexidos', '2 fatias pão integral', '1 fatia queijo branco', 'Café'],
        foodsEN: ['3 scrambled eggs', '2 slices whole wheat bread', '1 slice white cheese', 'Coffee']
      },
      snack1: {
        name: 'Lanche da Manhã',
        nameEN: 'Morning Snack',
        calories: 300,
        protein: 25,
        carbs: 30,
        fats: 8,
        foods: ['Whey protein 25g', '30g aveia', '1 banana pequena'],
        foodsEN: ['25g whey protein', '30g oats', '1 small banana']
      },
      lunch: {
        name: 'Almoço',
        nameEN: 'Lunch',
        calories: 700,
        protein: 50,
        carbs: 70,
        fats: 20,
        foods: ['180g frango', '100g arroz integral', '80g batata doce', 'Salada', 'Legumes'],
        foodsEN: ['180g chicken', '100g brown rice', '80g sweet potato', 'Salad', 'Vegetables']
      },
      snack2: {
        name: 'Lanche da Tarde',
        nameEN: 'Afternoon Snack',
        calories: 350,
        protein: 25,
        carbs: 30,
        fats: 12,
        foods: ['1 iogurte grego', '1 fruta', '15 amêndoas'],
        foodsEN: ['1 Greek yogurt', '1 fruit', '15 almonds']
      },
      dinner: {
        name: 'Jantar',
        nameEN: 'Dinner',
        calories: 550,
        protein: 45,
        carbs: 45,
        fats: 16,
        foods: ['150g carne magra', '80g arroz', 'Salada grande', 'Brócolis'],
        foodsEN: ['150g lean meat', '80g rice', 'Large salad', 'Broccoli']
      },
      snack3: {
        name: 'Ceia',
        nameEN: 'Evening Snack',
        calories: 250,
        protein: 25,
        carbs: 10,
        fats: 10,
        foods: ['Caseína 25g', '5 castanhas'],
        foodsEN: ['25g casein', '5 cashews']
      }
    }
  },

  // PREMIUM PLANS
  {
    id: 'bulking-premium',
    goal: 'bulking',
    name: 'Ganho de Massa - Premium',
    nameEN: 'Muscle Gain - Premium',
    totalCalories: 3800,
    protein: 240,
    carbs: 480,
    fats: 105,
    isPremium: true,
    meals: {
      breakfast: {
        name: 'Café da Manhã Premium',
        nameEN: 'Premium Breakfast',
        calories: 800,
        protein: 45,
        carbs: 95,
        fats: 22,
        foods: ['5 ovos (3 inteiros + 2 claras)', '3 fatias pão integral', '1 banana', '250ml leite', '2 colheres pasta amendoim'],
        foodsEN: ['5 eggs (3 whole + 2 whites)', '3 slices whole wheat bread', '1 banana', '250ml milk', '2 tbsp peanut butter']
      },
      snack1: {
        name: 'Lanche da Manhã',
        nameEN: 'Morning Snack',
        calories: 500,
        protein: 35,
        carbs: 55,
        fats: 12,
        foods: ['Whey protein isolado 35g', '50g aveia', '1 maçã', '10g mel'],
        foodsEN: ['35g whey protein isolate', '50g oats', '1 apple', '10g honey']
      },
      lunch: {
        name: 'Almoço',
        nameEN: 'Lunch',
        calories: 1100,
        protein: 70,
        carbs: 130,
        fats: 30,
        foods: ['250g frango ou carne', '180g arroz integral', '150g batata doce', 'Salada', 'Abacate'],
        foodsEN: ['250g chicken or beef', '180g brown rice', '150g sweet potato', 'Salad', 'Avocado']
      },
      snack2: {
        name: 'Lanche da Tarde',
        nameEN: 'Afternoon Snack',
        calories: 550,
        protein: 30,
        carbs: 60,
        fats: 15,
        foods: ['Sanduíche completo', '1 iogurte grego', '1 fruta'],
        foodsEN: ['Complete sandwich', '1 Greek yogurt', '1 fruit']
      },
      dinner: {
        name: 'Jantar',
        nameEN: 'Dinner',
        calories: 950,
        protein: 60,
        carbs: 110,
        fats: 25,
        foods: ['220g salmão ou carne', '150g arroz', '100g batata', 'Salada', 'Legumes variados'],
        foodsEN: ['220g salmon or beef', '150g rice', '100g potato', 'Salad', 'Varied vegetables']
      },
      snack3: {
        name: 'Ceia',
        nameEN: 'Evening Snack',
        calories: 400,
        protein: 30,
        carbs: 20,
        fats: 18,
        foods: ['Caseína 30g', '15 amêndoas', '1 colher pasta amendoim'],
        foodsEN: ['30g casein', '15 almonds', '1 tbsp peanut butter']
      }
    }
  },

  {
    id: 'cutting-premium',
    goal: 'cutting',
    name: 'Perda de Peso - Premium',
    nameEN: 'Weight Loss - Premium',
    totalCalories: 1700,
    protein: 180,
    carbs: 100,
    fats: 55,
    isPremium: true,
    meals: {
      breakfast: {
        name: 'Café da Manhã',
        nameEN: 'Breakfast',
        calories: 350,
        protein: 35,
        carbs: 25,
        fats: 10,
        foods: ['4 claras + 1 ovo', '1 fatia pão integral', 'Café preto', 'Vegetais'],
        foodsEN: ['4 egg whites + 1 whole egg', '1 slice whole wheat bread', 'Black coffee', 'Vegetables']
      },
      snack1: {
        name: 'Lanche da Manhã',
        nameEN: 'Morning Snack',
        calories: 220,
        protein: 30,
        carbs: 12,
        fats: 7,
        foods: ['Whey isolado 30g', 'Frutas vermelhas 50g'],
        foodsEN: ['30g whey isolate', '50g berries']
      },
      lunch: {
        name: 'Almoço',
        nameEN: 'Lunch',
        calories: 450,
        protein: 50,
        carbs: 35,
        fats: 12,
        foods: ['180g frango ou peixe', '60g arroz integral', 'Salada grande', 'Legumes à vontade'],
        foodsEN: ['180g chicken or fish', '60g brown rice', 'Large salad', 'Unlimited vegetables']
      },
      snack2: {
        name: 'Lanche da Tarde',
        nameEN: 'Afternoon Snack',
        calories: 200,
        protein: 20,
        carbs: 10,
        fats: 9,
        foods: ['Iogurte grego 0%', '8 amêndoas'],
        foodsEN: ['0% Greek yogurt', '8 almonds']
      },
      dinner: {
        name: 'Jantar',
        nameEN: 'Dinner',
        calories: 400,
        protein: 45,
        carbs: 18,
        fats: 14,
        foods: ['150g proteína magra', 'Salada verde grande', 'Legumes grelhados', 'Azeite moderado'],
        foodsEN: ['150g lean protein', 'Large green salad', 'Grilled vegetables', 'Moderate olive oil']
      },
      snack3: {
        name: 'Ceia',
        nameEN: 'Evening Snack',
        calories: 180,
        protein: 25,
        carbs: 5,
        fats: 7,
        foods: ['Caseína 25g', 'Chá verde'],
        foodsEN: ['25g casein', 'Green tea']
      }
    }
  }
]

export function getDietPlanByGoal(goal: string, premium: boolean = false): DietPlan | undefined {
  const plans = dietPlans.filter((p: any) => p.goal === goal && p.isPremium === premium)
  return plans?.[0]
}

export function getAllDietPlans(): DietPlan[] {
  return dietPlans
}
