// Exercise database for AuraFi
export interface Exercise {
  id: string
  name: string
  nameEN: string
  muscleGroup: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'abs' | 'cardio'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  image: string
  description: string
  descriptionEN: string
  musclesWorked: string
  musclesWorkedEN: string
}

export const exercises: Exercise[] = [
  // CHEST
  {
    id: 'barbell-bench-press',
    name: 'Supino Reto com Barra',
    nameEN: 'Barbell Bench Press',
    muscleGroup: 'chest',
    difficulty: 'intermediate',
    image: 'https://cdn.abacus.ai/images/fc871ffc-3a54-4f69-a3c4-e34a9dd2e565.png',
    description: 'Deite-se no banco reto, segure a barra com pegada ligeiramente mais larga que os ombros. Desça controladamente até o peito e empurre explosivamente.',
    descriptionEN: 'Lie on flat bench, grip bar slightly wider than shoulders. Lower controlled to chest and push explosively.',
    musclesWorked: 'Peitoral maior, tríceps, deltoides anterior',
    musclesWorkedEN: 'Pectoralis major, triceps, anterior deltoid'
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Supino Inclinado com Halteres',
    nameEN: 'Incline Dumbbell Press',
    muscleGroup: 'chest',
    difficulty: 'intermediate',
    image: 'https://cdn.abacus.ai/images/9bef082a-89fd-4cc6-b312-1c48ad266011.png',
    description: 'No banco inclinado (30-45°), empurre os halteres para cima mantendo controle total do movimento.',
    descriptionEN: 'On incline bench (30-45°), press dumbbells up maintaining full control.',
    musclesWorked: 'Peitoral superior, deltoides anterior, tríceps',
    musclesWorkedEN: 'Upper pectoralis, anterior deltoid, triceps'
  },
  {
    id: 'cable-chest-fly',
    name: 'Crucifixo no Cross Over',
    nameEN: 'Cable Chest Fly',
    muscleGroup: 'chest',
    difficulty: 'intermediate',
    image: 'https://cdn.abacus.ai/images/87452a59-815d-4976-9d78-0d7d7b9e3aea.png',
    description: 'Com os cabos na altura do peito, traga as mãos juntas à frente mantendo ligeira flexão nos cotovelos.',
    descriptionEN: 'With cables at chest height, bring hands together keeping slight bend in elbows.',
    musclesWorked: 'Peitoral maior (porção média)',
    musclesWorkedEN: 'Pectoralis major (middle portion)'
  },
  {
    id: 'push-ups',
    name: 'Flexões',
    nameEN: 'Push-ups',
    muscleGroup: 'chest',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/1be5ef08-306d-496b-843f-cab457907f47.png',
    description: 'Corpo em prancha, desça até quase tocar o chão e empurre de volta. Mantenha core contraído.',
    descriptionEN: 'Body in plank, lower until almost touching floor and push back. Keep core engaged.',
    musclesWorked: 'Peitoral, tríceps, core',
    musclesWorkedEN: 'Pectoralis, triceps, core'
  },
  {
    id: 'decline-barbell-press',
    name: 'Supino Declinado',
    nameEN: 'Decline Barbell Press',
    muscleGroup: 'chest',
    difficulty: 'advanced',
    image: 'https://cdn.abacus.ai/images/7a4a15f4-bf51-4327-a4ed-6bda09653c32.png',
    description: 'No banco declinado, empurre a barra focando na porção inferior do peitoral.',
    descriptionEN: 'On decline bench, press bar focusing on lower chest.',
    musclesWorked: 'Peitoral inferior, tríceps',
    musclesWorkedEN: 'Lower pectoralis, triceps'
  },

  // BACK
  {
    id: 'deadlift',
    name: 'Levantamento Terra',
    nameEN: 'Deadlift',
    muscleGroup: 'back',
    difficulty: 'advanced',
    image: 'https://cdn.abacus.ai/images/bfccfd10-99fe-4562-bbbf-4334efb1af75.png',
    description: 'Posicione-se com barra próxima às canelas, costas retas, levante empurrando o chão com os pés.',
    descriptionEN: 'Position with bar close to shins, straight back, lift by pushing floor with feet.',
    musclesWorked: 'Costas completas, glúteos, posterior de pernas',
    musclesWorkedEN: 'Full back, glutes, hamstrings'
  },
  {
    id: 'barbell-bent-over-row',
    name: 'Remada Curvada com Barra',
    nameEN: 'Barbell Bent Over Row',
    muscleGroup: 'back',
    difficulty: 'intermediate',
    image: 'https://cdn.abacus.ai/images/bf3d5352-1781-4f9b-ba06-e5d096be132f.png',
    description: 'Incline o tronco, puxe a barra em direção ao abdômen contraindo as escápulas.',
    descriptionEN: 'Lean torso, pull bar toward abdomen squeezing shoulder blades.',
    musclesWorked: 'Latíssimo do dorso, trapézio, bíceps',
    musclesWorkedEN: 'Latissimus dorsi, trapezius, biceps'
  },
  {
    id: 'pull-ups',
    name: 'Barra Fixa',
    nameEN: 'Pull-ups',
    muscleGroup: 'back',
    difficulty: 'advanced',
    image: 'https://cdn.abacus.ai/images/e8de5c49-bbf6-4477-857e-242a039de10e.png',
    description: 'Suspenda-se na barra e puxe até o queixo passar a barra. Desça controladamente.',
    descriptionEN: 'Hang from bar and pull until chin clears bar. Lower controlled.',
    musclesWorked: 'Latíssimo do dorso, bíceps, core',
    musclesWorkedEN: 'Latissimus dorsi, biceps, core'
  },
  {
    id: 'lat-pulldown',
    name: 'Puxada na Frente',
    nameEN: 'Lat Pulldown',
    muscleGroup: 'back',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/d5dc015b-0c2a-4d77-965a-be728870d221.png',
    description: 'Sentado na máquina, puxe a barra até a parte superior do peito contraindo as costas.',
    descriptionEN: 'Seated at machine, pull bar to upper chest squeezing back.',
    musclesWorked: 'Latíssimo do dorso, trapézio médio',
    musclesWorkedEN: 'Latissimus dorsi, middle trapezius'
  },
  {
    id: 'seated-cable-row',
    name: 'Remada Sentada no Cabo',
    nameEN: 'Seated Cable Row',
    muscleGroup: 'back',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/ad3cb63a-3c85-46e7-a7a5-f5267e706263.png',
    description: 'Sentado, puxe o cabo em direção ao abdômen mantendo o tronco ereto.',
    descriptionEN: 'Seated, pull cable toward abdomen keeping torso upright.',
    musclesWorked: 'Trapézio médio, romboide, latíssimo',
    musclesWorkedEN: 'Middle trapezius, rhomboids, latissimus'
  },
  {
    id: 't-bar-row',
    name: 'Remada Cavalinho',
    nameEN: 'T-Bar Row',
    muscleGroup: 'back',
    difficulty: 'intermediate',
    image: 'https://cdn.abacus.ai/images/b826a18c-1163-4dae-9896-74ae7d8982a7.png',
    description: 'Posicionado sobre a barra T, puxe em direção ao peito com explosão.',
    descriptionEN: 'Positioned over T-bar, pull toward chest explosively.',
    musclesWorked: 'Latíssimo, trapézio, romboide',
    musclesWorkedEN: 'Latissimus, trapezius, rhomboids'
  },
  {
    id: 'single-arm-dumbbell-row',
    name: 'Remada Unilateral com Halter',
    nameEN: 'Single Arm Dumbbell Row',
    muscleGroup: 'back',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/c49657af-c7bf-422c-8625-ed8c8680a2c6.png',
    description: 'Apoiado no banco, puxe o halter em direção ao quadril contraindo o latíssimo.',
    descriptionEN: 'Supported on bench, pull dumbbell toward hip squeezing lat.',
    musclesWorked: 'Latíssimo do dorso unilateral',
    musclesWorkedEN: 'Unilateral latissimus dorsi'
  },
  {
    id: 'face-pulls',
    name: 'Puxada de Corda para Face',
    nameEN: 'Face Pulls',
    muscleGroup: 'back',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/d4499f69-1c19-455a-b2a4-ee38b09ab857.png',
    description: 'Puxe a corda em direção à face abrindo os cotovelos para os lados.',
    descriptionEN: 'Pull rope toward face opening elbows to sides.',
    musclesWorked: 'Deltoide posterior, trapézio',
    musclesWorkedEN: 'Posterior deltoid, trapezius'
  },

  // LEGS
  {
    id: 'barbell-squat',
    name: 'Agachamento com Barra',
    nameEN: 'Barbell Squat',
    muscleGroup: 'legs',
    difficulty: 'advanced',
    image: 'https://cdn.abacus.ai/images/30b34a39-d1ec-49b6-bf3e-2a5219b08f19.png',
    description: 'Barra nas costas, desça até quebrar o paralelo e empurre com força pelos calcanhares.',
    descriptionEN: 'Bar on back, descend until breaking parallel and push through heels.',
    musclesWorked: 'Quadríceps, glúteos, posterior',
    musclesWorkedEN: 'Quadriceps, glutes, hamstrings'
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    nameEN: 'Leg Press',
    muscleGroup: 'legs',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/a176d255-83b8-4de9-8a38-b4886261abd0.png',
    description: 'Na máquina, empurre a plataforma com os pés na largura dos ombros.',
    descriptionEN: 'In machine, push platform with feet shoulder-width apart.',
    musclesWorked: 'Quadríceps, glúteos',
    musclesWorkedEN: 'Quadriceps, glutes'
  },
  {
    id: 'romanian-deadlift',
    name: 'Levantamento Terra Romeno',
    nameEN: 'Romanian Deadlift',
    muscleGroup: 'legs',
    difficulty: 'intermediate',
    image: 'https://cdn.abacus.ai/images/4c3195f5-66ca-46c1-b8c4-8bcb3cb097d6.png',
    description: 'Com leve flexão nos joelhos, desça a barra próximo às pernas sentindo alongamento no posterior.',
    descriptionEN: 'With slight knee bend, lower bar close to legs feeling hamstring stretch.',
    musclesWorked: 'Posterior de perna, glúteos, lombar',
    musclesWorkedEN: 'Hamstrings, glutes, lower back'
  },
  {
    id: 'leg-extension',
    name: 'Cadeira Extensora',
    nameEN: 'Leg Extension',
    muscleGroup: 'legs',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/510311ae-0609-453e-ba64-35f38fb853f3.png',
    description: 'Sentado na máquina, estenda as pernas contraindo o quadríceps no topo.',
    descriptionEN: 'Seated at machine, extend legs squeezing quadriceps at top.',
    musclesWorked: 'Quadríceps',
    musclesWorkedEN: 'Quadriceps'
  },
  {
    id: 'leg-curl',
    name: 'Mesa Flexora',
    nameEN: 'Leg Curl',
    muscleGroup: 'legs',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/fb9e22f2-aab8-4c73-9ab7-de66c5f94b58.png',
    description: 'Deitado na máquina, flexione as pernas trazendo os calcanhares em direção aos glúteos.',
    descriptionEN: 'Lying at machine, curl legs bringing heels toward glutes.',
    musclesWorked: 'Posterior de perna',
    musclesWorkedEN: 'Hamstrings'
  },
  {
    id: 'walking-lunges',
    name: 'Afundo Caminhando',
    nameEN: 'Walking Lunges',
    muscleGroup: 'legs',
    difficulty: 'intermediate',
    image: 'https://cdn.abacus.ai/images/41b663ae-5b1e-4380-94ba-922c1eb0968d.png',
    description: 'Dê passos largos alternando as pernas, descendo até o joelho quase tocar o chão.',
    descriptionEN: 'Take large steps alternating legs, descending until knee almost touches floor.',
    musclesWorked: 'Quadríceps, glúteos, equilíbrio',
    musclesWorkedEN: 'Quadriceps, glutes, balance'
  },
  {
    id: 'calf-raises',
    name: 'Elevação de Panturrilha',
    nameEN: 'Calf Raises',
    muscleGroup: 'legs',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/06339b42-b068-4c76-a4b9-1caee2dc21f7.png',
    description: 'Na máquina ou em pé, eleve-se na ponta dos pés contraindo a panturrilha.',
    descriptionEN: 'On machine or standing, rise on toes squeezing calves.',
    musclesWorked: 'Gastrocnêmio, sóleo',
    musclesWorkedEN: 'Gastrocnemius, soleus'
  },
  {
    id: 'hip-thrusts',
    name: 'Elevação de Quadril',
    nameEN: 'Hip Thrusts',
    muscleGroup: 'legs',
    difficulty: 'intermediate',
    image: 'https://cdn.abacus.ai/images/c8530659-5fcc-4ec9-a01c-1600034cd03a.png',
    description: 'Costas apoiadas no banco, empurre o quadril para cima contraindo os glúteos.',
    descriptionEN: 'Back supported on bench, thrust hips up squeezing glutes.',
    musclesWorked: 'Glúteos, posterior',
    musclesWorkedEN: 'Glutes, hamstrings'
  },

  // SHOULDERS
  {
    id: 'overhead-press',
    name: 'Desenvolvimento Militar',
    nameEN: 'Overhead Press',
    muscleGroup: 'shoulders',
    difficulty: 'intermediate',
    image: 'https://cdn.abacus.ai/images/0a6b4465-9ae2-4d97-8b7f-0ade29613edc.png',
    description: 'Empurre a barra ou halteres acima da cabeça mantendo o core estável.',
    descriptionEN: 'Press bar or dumbbells overhead keeping core stable.',
    musclesWorked: 'Deltoide anterior e médio, tríceps',
    musclesWorkedEN: 'Anterior and middle deltoid, triceps'
  },
  {
    id: 'lateral-raises',
    name: 'Elevação Lateral',
    nameEN: 'Lateral Raises',
    muscleGroup: 'shoulders',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/10ac7e64-f090-4e39-848b-be177197d51d.png',
    description: 'Eleve os halteres lateralmente até a altura dos ombros com ligeira flexão nos cotovelos.',
    descriptionEN: 'Raise dumbbells laterally to shoulder height with slight elbow bend.',
    musclesWorked: 'Deltoide médio',
    musclesWorkedEN: 'Middle deltoid'
  },
  {
    id: 'front-raises',
    name: 'Elevação Frontal',
    nameEN: 'Front Raises',
    muscleGroup: 'shoulders',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/e0097169-3429-431b-853f-faee491777ef.png',
    description: 'Eleve os halteres à frente até a altura dos ombros alternadamente ou juntos.',
    descriptionEN: 'Raise dumbbells front to shoulder height alternately or together.',
    musclesWorked: 'Deltoide anterior',
    musclesWorkedEN: 'Anterior deltoid'
  },
  {
    id: 'rear-delt-fly',
    name: 'Crucifixo Inverso',
    nameEN: 'Rear Delt Fly',
    muscleGroup: 'shoulders',
    difficulty: 'intermediate',
    image: 'https://cdn.abacus.ai/images/9df43ed7-d9e0-475d-a7a8-0ec5b34a32bd.png',
    description: 'Inclinado à frente, abra os halteres lateralmente focando no deltoide posterior.',
    descriptionEN: 'Bent forward, open dumbbells laterally focusing on rear delts.',
    musclesWorked: 'Deltoide posterior',
    musclesWorkedEN: 'Posterior deltoid'
  },

  // ARMS
  {
    id: 'barbell-curl',
    name: 'Rosca Direta',
    nameEN: 'Barbell Curl',
    muscleGroup: 'arms',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/ba7a34ad-500f-4473-8af9-06db18760373.png',
    description: 'Em pé, flexione os cotovelos trazendo a barra em direção aos ombros.',
    descriptionEN: 'Standing, flex elbows bringing bar toward shoulders.',
    musclesWorked: 'Bíceps braquial',
    musclesWorkedEN: 'Biceps brachii'
  },
  {
    id: 'hammer-curl',
    name: 'Rosca Martelo',
    nameEN: 'Hammer Curl',
    muscleGroup: 'arms',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/20781dfe-3e9c-4b18-9493-ad318118eb91.png',
    description: 'Flexione os cotovelos com pegada neutra (palmas se olhando).',
    descriptionEN: 'Flex elbows with neutral grip (palms facing each other).',
    musclesWorked: 'Bíceps, braquiorradial',
    musclesWorkedEN: 'Biceps, brachioradialis'
  },
  {
    id: 'tricep-pushdown',
    name: 'Tríceps no Pulley',
    nameEN: 'Tricep Pushdown',
    muscleGroup: 'arms',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/42f1d757-7af7-4a78-9b8d-0ec15768695c.png',
    description: 'Empurre a barra ou corda para baixo mantendo os cotovelos fixos.',
    descriptionEN: 'Push bar or rope down keeping elbows fixed.',
    musclesWorked: 'Tríceps braquial',
    musclesWorkedEN: 'Triceps brachii'
  },
  {
    id: 'skull-crushers',
    name: 'Tríceps Testa',
    nameEN: 'Skull Crushers',
    muscleGroup: 'arms',
    difficulty: 'intermediate',
    image: 'https://cdn.abacus.ai/images/2cd0406b-b679-4447-8cf2-aa3a9428696b.png',
    description: 'Deitado, flexione os cotovelos trazendo a barra próximo à testa e estenda.',
    descriptionEN: 'Lying down, flex elbows bringing bar near forehead and extend.',
    musclesWorked: 'Tríceps (cabeça longa)',
    musclesWorkedEN: 'Triceps (long head)'
  },
  {
    id: 'chest-dips',
    name: 'Paralelas para Peito',
    nameEN: 'Chest Dips',
    muscleGroup: 'arms',
    difficulty: 'advanced',
    image: 'https://cdn.abacus.ai/images/ee405e65-37ad-4413-960f-c3a4857790d5.png',
    description: 'Nas paralelas, incline o tronco à frente e desça até sentir alongamento no peito.',
    descriptionEN: 'On parallel bars, lean torso forward and descend until chest stretch.',
    musclesWorked: 'Peitoral inferior, tríceps',
    musclesWorkedEN: 'Lower pectoralis, triceps'
  },

  // ABS
  {
    id: 'plank',
    name: 'Prancha',
    nameEN: 'Plank',
    muscleGroup: 'abs',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/c4b5613a-1055-4150-93d2-aca20d92f3ab.png',
    description: 'Mantenha o corpo reto apoiado nos antebraços e pés, contraindo o abdômen.',
    descriptionEN: 'Keep body straight supported on forearms and feet, engaging abs.',
    musclesWorked: 'Core completo, estabilizadores',
    musclesWorkedEN: 'Full core, stabilizers'
  },
  {
    id: 'crunches',
    name: 'Abdominais',
    nameEN: 'Crunches',
    muscleGroup: 'abs',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/3ba215ce-73a3-4535-b874-d314180c3eba.png',
    description: 'Deitado, eleve o tronco contraindo o abdômen sem puxar o pescoço.',
    descriptionEN: 'Lying down, lift torso contracting abs without pulling neck.',
    musclesWorked: 'Reto abdominal',
    musclesWorkedEN: 'Rectus abdominis'
  },
  {
    id: 'russian-twists',
    name: 'Twist Russo',
    nameEN: 'Russian Twists',
    muscleGroup: 'abs',
    difficulty: 'intermediate',
    image: 'https://cdn.abacus.ai/images/aeb78b6f-c093-4266-b6be-d35d4536348e.png',
    description: 'Sentado com pés elevados, gire o tronco de um lado para o outro.',
    descriptionEN: 'Seated with feet elevated, rotate torso from side to side.',
    musclesWorked: 'Oblíquos, reto abdominal',
    musclesWorkedEN: 'Obliques, rectus abdominis'
  },
  {
    id: 'hanging-leg-raises',
    name: 'Elevação de Pernas Suspensa',
    nameEN: 'Hanging Leg Raises',
    muscleGroup: 'abs',
    difficulty: 'advanced',
    image: 'https://cdn.abacus.ai/images/8da8619a-0026-43cc-95e7-43e1d29b2715.png',
    description: 'Pendurado na barra, eleve as pernas mantendo-as estendidas ou flexionadas.',
    descriptionEN: 'Hanging from bar, raise legs keeping them extended or bent.',
    musclesWorked: 'Reto abdominal inferior, flexores do quadril',
    musclesWorkedEN: 'Lower rectus abdominis, hip flexors'
  },
  {
    id: 'bicycle-crunches',
    name: 'Bicicleta no Ar',
    nameEN: 'Bicycle Crunches',
    muscleGroup: 'abs',
    difficulty: 'intermediate',
    image: 'https://cdn.abacus.ai/images/e4fc6180-4dc3-47ab-9bb5-30a48e718bf1.png',
    description: 'Alterne cotovelo com joelho oposto em movimento de pedalada.',
    descriptionEN: 'Alternate elbow with opposite knee in pedaling motion.',
    musclesWorked: 'Oblíquos, reto abdominal',
    musclesWorkedEN: 'Obliques, rectus abdominis'
  },
  {
    id: 'cable-woodchoppers',
    name: 'Lenhador no Cabo',
    nameEN: 'Cable Woodchoppers',
    muscleGroup: 'abs',
    difficulty: 'intermediate',
    image: 'https://cdn.abacus.ai/images/d994c5db-60e4-4fca-8cd4-5bc86401e46b.png',
    description: 'Puxe o cabo diagonalmente do alto para baixo em movimento de rotação.',
    descriptionEN: 'Pull cable diagonally from high to low in rotating motion.',
    musclesWorked: 'Oblíquos, core rotacional',
    musclesWorkedEN: 'Obliques, rotational core'
  },

  // CARDIO
  {
    id: 'treadmill-running',
    name: 'Corrida na Esteira',
    nameEN: 'Treadmill Running',
    muscleGroup: 'cardio',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/aec5688e-2f80-42cc-ac7a-d8e31377e10d.png',
    description: 'Mantenha ritmo constante ajustando velocidade e inclinação conforme condicionamento.',
    descriptionEN: 'Maintain steady pace adjusting speed and incline based on fitness.',
    musclesWorked: 'Sistema cardiovascular, pernas',
    musclesWorkedEN: 'Cardiovascular system, legs'
  },
  {
    id: 'stationary-bike',
    name: 'Bicicleta Ergométrica',
    nameEN: 'Stationary Bike',
    muscleGroup: 'cardio',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/9e370415-e19b-4067-8552-a267a7f1b43d.png',
    description: 'Pedale com resistência moderada mantendo frequência cardíaca elevada.',
    descriptionEN: 'Pedal with moderate resistance maintaining elevated heart rate.',
    musclesWorked: 'Sistema cardiovascular, quadríceps',
    musclesWorkedEN: 'Cardiovascular system, quadriceps'
  },
  {
    id: 'battle-ropes',
    name: 'Cordas Navais',
    nameEN: 'Battle Ropes',
    muscleGroup: 'cardio',
    difficulty: 'intermediate',
    image: 'https://cdn.abacus.ai/images/161cfc06-deb8-4928-a88f-80b80881b177.png',
    description: 'Movimente as cordas vigorosamente em padrões variados mantendo intensidade alta.',
    descriptionEN: 'Move ropes vigorously in varied patterns maintaining high intensity.',
    musclesWorked: 'Corpo inteiro, cardio',
    musclesWorkedEN: 'Full body, cardio'
  },
  {
    id: 'box-jumps',
    name: 'Saltos no Caixote',
    nameEN: 'Box Jumps',
    muscleGroup: 'cardio',
    difficulty: 'advanced',
    image: 'https://cdn.abacus.ai/images/51d0afdd-1b49-44ac-98ef-ea471851876f.png',
    description: 'Salte explosivamente para cima do caixote e desça controladamente.',
    descriptionEN: 'Jump explosively onto box and step down controlled.',
    musclesWorked: 'Explosão, pernas, cardio',
    musclesWorkedEN: 'Power, legs, cardio'
  },
  {
    id: 'burpees',
    name: 'Burpees',
    nameEN: 'Burpees',
    muscleGroup: 'cardio',
    difficulty: 'intermediate',
    image: 'https://cdn.abacus.ai/images/aba02707-1752-4cec-b85c-6ab8afb7984a.png',
    description: 'Agache, apoie as mãos, chute as pernas para trás, flexão, volte e salte.',
    descriptionEN: 'Squat, place hands, kick legs back, push-up, return and jump.',
    musclesWorked: 'Corpo inteiro, resistência',
    musclesWorkedEN: 'Full body, endurance'
  },
  {
    id: 'kettlebell-swings',
    name: 'Balanço com Kettlebell',
    nameEN: 'Kettlebell Swings',
    muscleGroup: 'cardio',
    difficulty: 'intermediate',
    image: 'https://cdn.abacus.ai/images/aead11a6-63a6-48a4-97b6-d59db59ae7d0.png',
    description: 'Balance o kettlebell entre as pernas e empurre explosivamente com o quadril.',
    descriptionEN: 'Swing kettlebell between legs and thrust explosively with hips.',
    musclesWorked: 'Posterior, glúteos, cardio',
    musclesWorkedEN: 'Hamstrings, glutes, cardio'
  },
  {
    id: 'farmers-walk',
    name: 'Caminhada do Fazendeiro',
    nameEN: 'Farmers Walk',
    muscleGroup: 'cardio',
    difficulty: 'intermediate',
    image: 'https://cdn.abacus.ai/images/852bd24b-8c19-4ecd-baaf-e0c6a273943f.png',
    description: 'Caminhe segurando pesos pesados nas mãos mantendo postura ereta.',
    descriptionEN: 'Walk holding heavy weights in hands maintaining upright posture.',
    musclesWorked: 'Pegada, core, trapézio, resistência',
    musclesWorkedEN: 'Grip, core, trapezius, endurance'
  },
  {
    id: 'mountain-climbers',
    name: 'Escaladores',
    nameEN: 'Mountain Climbers',
    muscleGroup: 'cardio',
    difficulty: 'beginner',
    image: 'https://cdn.abacus.ai/images/3ed84504-ab2f-4a29-94eb-7b3a45ca9511.png',
    description: 'Em posição de prancha, alterne trazendo os joelhos em direção ao peito rapidamente.',
    descriptionEN: 'In plank position, alternate bringing knees toward chest quickly.',
    musclesWorked: 'Core, cardio, corpo inteiro',
    musclesWorkedEN: 'Core, cardio, full body'
  }
]

export function getExercisesByMuscleGroup(group: string): Exercise[] {
  return exercises.filter((ex: any) => ex.muscleGroup === group)
}

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((ex: any) => ex.id === id)
}
