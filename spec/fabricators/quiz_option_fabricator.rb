# frozen_string_literal: true

Fabricator(:quiz_option, from: 'QuizOption') do
  quiz_question
  text "Option 1"
  position 1
end
