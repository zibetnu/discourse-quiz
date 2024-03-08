class DiscourseQuiz::QuizAttemptSerializer < ApplicationSerializer
    attributes :id, :user_id, :quiz_id, :started_at, :finished_at
end
