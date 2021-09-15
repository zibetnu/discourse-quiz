# frozen_string_literal: true

module DiscourseQuiz
  class Quiz < ActiveRecord::Base
    has_many :quiz_questions, dependent: :destroy
    has_many :quiz_attempts, dependent: :destroy
    belongs_to :post

    def self.upsert_from_post(post)
      quizzes = DiscourseQuiz::QuizParser.extract_quizzes(post)
      if quizzes.present?
        quiz_data = quizzes.first
        quiz = post.quiz || DiscourseQuiz::Quiz.new(post: post)
        # Validate that the quiz is editable and doesn't have any existing attempts
        unless quiz.is_editable
          raise RuntimeError.new("Quiz is not editable")
        end
        unless quiz.quiz_attempts.length == 0
          raise RuntimeError.new("Cannot edit quiz with existing attempts")
        end
        # Set quiz attributes
        quiz.update(
          quiz_data.slice(
            :time_limit, :max_attempts_allowed, :is_open,
            :is_editable, :open_at, :close_at
          )
        )

        # Clear existing quiz questions (if any)
        unless quiz.quiz_questions.length == 0
          quiz.quiz_questions = []
        end

        # Create questions
        quiz.quiz_questions.build(quiz_data[:questions])

        # Save quiz
        quiz.save!
        quiz
      end
    end
  end
end
