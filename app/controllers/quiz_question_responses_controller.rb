# frozen_string_literal: true

class DiscourseQuiz::QuizQuestionResponsesController < ::ApplicationController
  def create
    quiz_question_response = DiscourseQuiz::QuizQuestionResponse.new(
      quiz_question_response_params
    )

    quiz_question_response.save!

    render json: DiscourseQuiz::QuizQuestionResponseSerializer.new(
      quiz_question_response
    ).as_json
  end

  def index
    quiz_attempt = DiscourseQuiz::QuizAttempt.find(params[:attempt_id])

    render json: ActiveModel::ArraySerializer.new(
      quiz_attempt.question_responses,
      each_serializer: DiscourseQuiz::QuizQuestionResponseSerializer
    ).as_json
  end

  private

  def quiz_question_response_params
    params.require(:quiz_question_response).permit(
                                                   :answer,
                                                   :quiz_attempt_id,
                                                   :quiz_question_id)
  end
end