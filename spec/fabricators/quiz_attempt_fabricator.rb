# frozen_string_literal: true

Fabricator(:quiz_attempt, from: 'QuizAttempt') do
  quiz
  user
end
