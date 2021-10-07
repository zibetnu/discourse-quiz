# frozen_string_literal: true

module DiscourseQuiz
  class QuizQuestionsController < ApplicationController
    def index
      # Questions for a quiz
      @quiz = DiscourseQuiz::Quiz.find(params[:quiz_id])
      raise Discourse::InvalidAccess unless (guardian.can_act_on_quiz?(@quiz) || @quiz.is_open)
      render json: ActiveModel::ArraySerializer.new(@quiz.questions, each_serializer: DiscourseQuiz::QuizQuestionSerializer, scope: guardian).as_json
    end
  end
end
