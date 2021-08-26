# frozen_string_literal: true
class QuizQuestionResponseValidator < ActiveModel::Validator
  def validate(record)
    if record.quiz_question.true_false?
      unless ["t", "f"].include? record.answer
        record.errors.add :base, "True/False answers must either be true or false"
      end
    elsif record.quiz_question.multiple_choice?
      valid_option_ids = record.quiz_question.quiz_options.map { |option| option.id }
      unless valid_option_ids.include? record.answer.to_i
        record.errors.add :base, "Answer '#{record.answer}' is not a valid option for this question"			end
    end
  end
end

class QuizQuestionResponse < ActiveRecord::Base
  belongs_to :quiz_attempt
  belongs_to :quiz_question

  validates_with QuizQuestionResponseValidator
end
