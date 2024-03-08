# frozen_string_literal: true

class DiscourseQuiz::QuizAttemptsController < ::ApplicationController
  before_action :ensure_logged_in

  def create
    quiz_attempt = DiscourseQuiz::QuizAttempt.new(quiz_attempt_params)

    quiz_attempt.save!

    render json: DiscourseQuiz::QuizAttemptSerializer.new(
      quiz_attempt
    ).as_json
  end

  def index
    attempt = DiscourseQuiz::QuizAttempt.find(params[:id])

    render json: DiscourseQuiz::QuizAttemptSerializer.new(
      quiz_attempt
    ).as_json
  end

  def update
    attempt = DiscourseQuiz::QuizAttempt.find(params[:id])

    attempt.update!(quiz_attempt_params)

    render json: DiscourseQuiz::QuizAttemptSerializer.new(
      quiz_attempt
    ).as_json
  end

  private

  def quiz_attempt_params
    params.require(:quiz_attempt).permit(
                                         :user_id,
                                         :quiz_id,
                                         :started_at,
                                         :finished_at)
  end
end
