# frozen_string_literal: true
module DiscourseQuiz
  class QuizAttempt < ActiveRecord::Base
    self.table_name = "quiz_attempts"
    belongs_to :user
    belongs_to :quiz
    has_many :question_responses, class_name: "QuizQuestionResponse", dependent: :destroy
  end
end
