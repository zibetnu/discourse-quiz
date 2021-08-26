# frozen_string_literal: true
class QuizAttempt < ActiveRecord::Base
  belongs_to :user
  belongs_to :quiz
end
