# frozen_string_literal: true
class QuizQuestion < ActiveRecord::Base
  enum format: [ :multiple_choice, :true_false ]

  def options
    if self.multiple_choice?
      raise RuntimeError.new("Can't find options for this question, as it doesn't have an id") unless self.id?
      options = QuizOption.where(quiz_question_id: self.id).order(:position)
    else
      options = QuizOption.where(id: [1, 2]).order(:position)
    end
    options
  end
end
