# frozen_string_literal: true

module DiscourseQuiz
  class QuizQuestionSerializer < ApplicationSerializer
    attributes :id
    attributes :text
    attributes :format
    attributes :answer
    attributes :options

    def options
      ActiveModel::ArraySerializer.new(object.options)
    end

    def include_answer?
      scope && scope.can_act_on_quiz?(object.quiz)
    end
  end
end
