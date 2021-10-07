# frozen_string_literal: true
module DiscourseQuiz
  class QuizQuestionResponseValidator < ActiveModel::Validator
    def validate(record)
      if record.quiz_question.true_false?
        unless ["t", "f"].include? record.answer
          record.errors.add :base, "True/False answers must either be true or false"
        end
      elsif record.quiz_question.multiple_choice?
        begin
          answer = Integer(record.answer)
          if (record.answer.to_i < 0) || (record.answer.to_i >= record.quiz_question.options.length)
            record.errors.add :base, "Multiple choice answer must be a valid index of options list"
          end
        rescue
          record.errors.add :base, "Multiple choice answer must be a valid index of options list"
        end
      end
    end
  end

  class QuizQuestionResponse < ActiveRecord::Base
    self.table_name = "quiz_question_responses"
    belongs_to :quiz_attempt
    belongs_to :quiz_question

    validates_with QuizQuestionResponseValidator
  end
end
