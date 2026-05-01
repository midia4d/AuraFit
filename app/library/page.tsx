'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'
import { exercises } from '@/lib/exercises-data'
import Image from 'next/image'

export default function LibraryPage() {
  const { t, language } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredExercises, setFilteredExercises] = useState(exercises)
  const [selectedExercise, setSelectedExercise] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = exercises.filter((ex: any) => 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.nameEN.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.musclesWorked.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredExercises(filtered)
    } else {
      setFilteredExercises(exercises)
    }
  }, [searchTerm])

  if (!mounted) return null

  if (selectedExercise) {
    return (
      <div className="min-h-screen bg-black pb-24 md:pb-8 md:pt-20">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <button
            onClick={() => setSelectedExercise(null)}
            className="mb-6 text-[#39FF14] hover:text-[#2FD10F] font-bold"
          >
            ← {t('common.back')}
          </button>

          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-900 mb-6">
            <Image
              src={selectedExercise.image}
              alt={language === 'pt-BR' ? selectedExercise.name : selectedExercise.nameEN}
              fill
              className="object-cover"
            />
          </div>

          <Card className="bg-gray-900 border-gray-700 p-6">
            <h1 className="text-3xl font-black mb-2">
              {language === 'pt-BR' ? selectedExercise.name : selectedExercise.nameEN}
            </h1>
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold">
                {t(`workouts.muscleGroups.${selectedExercise.muscleGroup}`)}
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-xs font-bold">
                {t(`library.difficultyLevels.${selectedExercise.difficulty}`)}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2">{t('library.musclesWorked')}</h2>
              <p className="text-gray-300">
                {language === 'pt-BR' ? selectedExercise.musclesWorked : selectedExercise.musclesWorkedEN}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">{t('library.howTo')}</h2>
              <p className="text-gray-300 leading-relaxed">
                {language === 'pt-BR' ? selectedExercise.description : selectedExercise.descriptionEN}
              </p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-8 md:pt-20">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <h1 className="text-3xl font-black mb-6">{t('library.title')}</h1>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder={t('library.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700"
          />
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((exercise: any) => (
            <Card
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise)}
              className="bg-gray-900 border-gray-700 overflow-hidden cursor-pointer hover:border-[#39FF14] transition-all duration-300 hover:scale-105"
            >
              <div className="relative w-full aspect-[4/3] bg-gray-800">
                <Image
                  src={exercise.image}
                  alt={language === 'pt-BR' ? exercise.name : exercise.nameEN}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">
                  {language === 'pt-BR' ? exercise.name : exercise.nameEN}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold">
                    {t(`workouts.muscleGroups.${exercise.muscleGroup}`)}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-gray-800 text-gray-400 text-xs">
                    {t(`library.difficultyLevels.${exercise.difficulty}`)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <p className="text-gray-400 text-center py-12">
            {language === 'pt-BR' ? 'Nenhum exercício encontrado' : 'No exercises found'}
          </p>
        )}
      </div>
    </div>
  )
}
