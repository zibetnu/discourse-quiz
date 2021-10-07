# frozen_string_literal: true

module DiscourseQuiz
  class QuizSerializer < ApplicationSerializer
    attribute :id
    attribute :title
    attribute :time_limit
    attribute :max_attempts
    attribute :is_open
    attribute :open_at
    attribute :close_at
    attribute :post_id
    attribute :can_act_on_quiz

    def can_act_on_quiz
      scope && scope.can_act_on_quiz?(object)
    end
  end
end
