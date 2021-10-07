# frozen_string_literal: true
module DiscourseQuiz
  class QuizQuestion < ActiveRecord::Base
    self.table_name = "quiz_questions"
    belongs_to :quiz
    has_many :responses, class_name: "QuizQuestionResponse", dependent: :destroy
    enum format: [ :multiple_choice, :true_false ]
  end
end
