# frozen_string_literal: true

module DiscourseQuiz
  class QuizzesController < ApplicationController
    def show
      # Details for a quiz
      @quiz = DiscourseQuiz::Quiz.find(params[:quiz_id])
      render json: DiscourseQuiz::QuizSerializer.new(@quiz, scope: guardian).as_json
    end

    def update
      # Mark a quiz as "open" or "closed"
      ## all other updates are made via the :post_prcess_cooked event handler
      params.require(:quiz)
      @quiz = DiscourseQuiz::Quiz.find(params[:quiz_id])
      @quiz.is_open = params[:quiz][:is_open]
      @quiz.save!
      render json: DiscourseQuiz::QuizSerializer.new(@quiz, scope: guardian).as_json
    end

    def destroy
      # Destroy a quiz
    end
  end
end
