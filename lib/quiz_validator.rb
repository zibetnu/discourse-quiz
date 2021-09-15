# frozen_string_literal: true

module DiscourseQuiz
  class QuizValidator

    def initialize(post)
      @post = post
    end

    def validate_quiz
      extracted_quizzes = DiscourseQuiz::QuizParser::extract_quizzes(@post)

      if extracted_quizzes.count == 0
        return false
      end

      if extracted_quizzes.count > 1
        @post.errors.add(:base, I18n.t("discourse_quiz.errors.models.quiz.only_one_quiz"))
        return false
      end

      if !@post.is_first_post?
        @post.errors.add(:base, I18n.t("discourse_quiz.errors.models.quiz.must_be_in_first_post"))
        false
      end
    end
  end
end
