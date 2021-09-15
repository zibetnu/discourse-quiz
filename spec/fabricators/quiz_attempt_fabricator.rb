# frozen_string_literal: true

Fabricator(:quiz_attempt, from: 'DiscourseQuiz::QuizAttempt') do
  quiz
  user
  started_at DateTime.now()
end
