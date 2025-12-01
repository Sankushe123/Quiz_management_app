// /quiz/quiz-result/page.js
import QuizResult from '@/components/quiz/QuizResult'
import React, { Suspense } from 'react'

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizResult />
    </Suspense>
  )
}

export default Page
