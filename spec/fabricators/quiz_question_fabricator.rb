# frozen_string_literal: true

Fabricator(:quiz_question, from: 'DiscourseQuiz::QuizQuestion') do
  quiz
  text "How far is the Earth from the Sun?"
  options ["Option 1", "Option 2"]
  answer 0
end
