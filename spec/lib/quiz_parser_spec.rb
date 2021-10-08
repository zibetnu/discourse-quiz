# frozen_string_literal: true

require 'rails_helper'
require_relative "../sample_quiz.rb"

describe DiscourseQuiz::QuizParser do
  describe "extract_quizzes" do
    it "parses options correctly" do
      post = Fabricate(:post, raw: SAMPLE_QUIZ)
      quizzes = DiscourseQuiz::QuizParser.extract_quizzes(post)
      expect(quizzes.length).to eq(1)
      expect(quizzes.first[:questions][2][:options].first).to eq("Option 1 has spaces in it")
      expect(quizzes.first[:questions][1][:answer]).to eq("false")
    end
  end
end
