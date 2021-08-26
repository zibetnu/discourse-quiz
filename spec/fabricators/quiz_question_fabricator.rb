# frozen_string_literal: true

Fabricator(:quiz_question, from: 'QuizQuestion') do
  quiz
  raw "How far is the Earth from the Sun?"
  cooked "How far is the Earth from the Sun?"
  position 1
end
