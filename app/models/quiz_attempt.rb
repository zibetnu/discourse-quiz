# frozen_string_literal: true
module DiscourseQuiz
  class QuizAttempt < ActiveRecord::Base
    belongs_to :user
    belongs_to :quiz
  end
end
