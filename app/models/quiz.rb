# frozen_string_literal: true

module DiscourseQuiz
  class Quiz < ActiveRecord::Base
    self.table_name = "quizzes"
    has_many :questions, class_name: "QuizQuestion", dependent: :destroy
    has_many :attempts, class_name: "QuizAttempt", dependent: :destroy
    belongs_to :post

    def self.upsert_from_post(post)
      quizzes = DiscourseQuiz::QuizParser.extract_quizzes(post)
      if quizzes.present?
        quiz_data = quizzes.first
        quiz_data[:title] = quiz_data[:title] || post.topic.title
        quiz = post.quiz || DiscourseQuiz::Quiz.new(post: post, title: quiz_data[:title])

        # Validate that the quiz can be edited
        unless quiz.attempts.length == 0
          raise RuntimeError.new("Cannot edit quiz with existing attempts")
        end

        # Set quiz attributes
        quiz.update(
          quiz_data.slice(
            :time_limit, :max_attempts, :is_open, :title, :open_at, :close_at
          )
        )

        # Clear existing quiz questions (if any)
        unless quiz.questions.length == 0
          quiz.questions = []
        end

        # Create questions
        quiz.questions.build(quiz_data[:questions])

        # Save quiz
        quiz.save!
        quiz
      end
    end
  end
end
