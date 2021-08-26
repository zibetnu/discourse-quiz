# frozen_string_literal: true

Fabricator(:quiz_question_response, from: 'QuizQuestionResponse') do
  quiz_attempt
  quiz_question
end
