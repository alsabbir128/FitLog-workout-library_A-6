export type Workout = {
  id: string
  name: string
  category: string[]
  equipment: string
  difficulty: string
  sets: number
  reps: string
  duration: number
  calories: number
  rating: number
  image: string
  description: string
  instructions: string[]
}

const workoutImages: Record<string, string> = {
  'Barbell Bench Press': '/images/workout-bench-press.png',
  'Pull-Up': '/images/workout-pullup.png',
  'Back Squat': '/images/workout-back-squat.png',
  'Overhead Press': '/images/workout-overhead-press.png',
  'Bicep Curl': '/images/workout-bicep-curl.png',
  'Dumbbell Bicep Curl': '/images/workout-bicep-curl.png',
  Burpee: '/images/workout-burpee.png',
  'Kettlebell Swing': '/images/workout-kettlebell-swing.png',
  'Tricep Pushdown': '/images/workout-tricep-pushdown.png',
  'Hollow-Body Plank': '/images/workout-hollow-plank.png',
  'Dumbbell Kick Curl': '/images/workout-kick-curl.png',
  'Conventional Deadlift': '/images/workout-deadlift.png',
  'Push-Up': '/images/workout-pushup.png',
  'Walking Lunge': '/images/workout-walking-lunge.png',
  'Russian Twist': '/images/workout-russian-twist.png',
}

export const fallbackWorkouts: Workout[] = [
  ['Barbell Bench Press',['CHEST','ARMS'],'Barbell, Bench','Intermediate',4,'6-8',25,180,4.8],['Pull-Up',['BACK','ARMS'],'Pull-up Bar','Advanced',4,'6-10',20,140,4.9],['Back Squat',['LEGS','GLUTES'],'Barbell, Rack','Advanced',4,'6-8',30,240,4.8],['Overhead Press',['SHOULDERS','ARMS'],'Barbell','Intermediate',3,'8-10',20,150,4.7],['Bicep Curl',['ARMS'],'Dumbbells','Beginner',3,'10-12',15,90,4.6],['Tricep Pushdown',['ARMS'],'Cable Machine','Beginner',3,'10-12',15,85,4.7],['Hollow-Body Plank',['CORE'],'Bodyweight','Intermediate',3,'30 sec',12,70,4.5],['Dumbbell Kick Curl',['ARMS'],'Dumbbells','Beginner',3,'10-12',15,90,4.6],['Conventional Deadlift',['BACK','LEGS'],'Barbell','Advanced',4,'5-6',28,260,4.9],['Push-Up',['CHEST','ARMS'],'Bodyweight','Beginner',3,'12-15',12,80,4.5],['Walking Lunge',['LEGS','GLUTES'],'Dumbbells','Intermediate',3,'10 / leg',18,130,4.7],['Russian Twist',['CORE'],'Medicine Ball','Intermediate',3,'16-20',14,95,4.6],
].map((x, i) => ({id: String(i+1), name:x[0] as string, category:x[1] as string[], equipment:x[2] as string, difficulty:x[3] as string, sets:x[4] as number, reps:x[5] as string, duration:x[6] as number, calories:x[7] as number, rating:x[8] as number, image: workoutImages[x[0] as string] ?? '/images/workout-strength.png', description:'A focused movement built to develop strength, control, and repeatable training progress.', instructions:['Set your stance and prepare the equipment with control.','Brace your core and move through a steady range of motion.','Keep your form consistent through every repetition.','Return slowly, breathe, and reset before the next rep.']}))

export function normalizeWorkouts(data: unknown): Workout[] {
  if (!Array.isArray(data)) return fallbackWorkouts

  const normalized = data.map((item, index) => {
    if (Array.isArray(item)) {
      const [name, category, equipment, difficulty, sets, reps, duration, calories, rating] = item
      return {
        ...fallbackWorkouts[index % fallbackWorkouts.length],
        id: String(index + 1),
        name: typeof name === 'string' ? name : `Workout ${index + 1}`,
        category: Array.isArray(category) ? category.filter((value): value is string => typeof value === 'string') : [],
        equipment: typeof equipment === 'string' ? equipment : 'Bodyweight',
        difficulty: typeof difficulty === 'string' ? difficulty : 'Intermediate',
        sets: Number(sets) || 3,
        reps: typeof reps === 'string' ? reps : '8-12',
        duration: Number(duration) || 15,
        calories: Number(calories) || 100,
        rating: Number(rating) || 4.5,
      }
    }

    if (!item || typeof item !== 'object') return null
    const workout = item as Partial<Workout>
    return {
      ...fallbackWorkouts[index % fallbackWorkouts.length],
      ...workout,
      id: String(workout.id ?? index + 1),
      image: workout.image && workoutImages[workout.name] ? workoutImages[workout.name] : fallbackWorkouts[index % fallbackWorkouts.length].image,
      category: Array.isArray(workout.category) ? workout.category.filter((value): value is string => typeof value === 'string') : [],
    }
  }).filter((workout): workout is Workout => Boolean(workout))

  return normalized.length ? normalized : fallbackWorkouts
}

export async function getWorkouts() {
  try {
    const response = await fetch('https://api.abcz.workers.dev/api/fitlog', { next: { revalidate: 300 } })
    if (!response.ok) throw new Error('API unavailable')
    return normalizeWorkouts(await response.json())
  } catch { return fallbackWorkouts }
}

export function findWorkout(id: string) { return fallbackWorkouts.find((workout) => workout.id === id) ?? fallbackWorkouts[0] }
