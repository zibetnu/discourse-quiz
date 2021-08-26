# frozen_string_literal: true
class QuizQuestion < ActiveRecord::Base
  belongs_to :quiz
  has_many :quiz_options
  has_many :quiz_question_responses
  enum format: [ :multiple_choice, :true_false ]
end
