# frozen_string_literal: true
class QuizOption < ActiveRecord::Base
  belongs_to :quiz_question
end
