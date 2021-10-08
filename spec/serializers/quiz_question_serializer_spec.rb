# frozen_string_literal: true

require "rails_helper"
require_relative "../fabricators/quiz_fabricator"
require_relative "../sample_quiz.rb"

describe DiscourseQuiz::QuizQuestionSerializer do
  it "hides answers" do
    post = Fabricate(:post, raw: SAMPLE_QUIZ)
    quiz = DiscourseQuiz::Quiz.sync_from_post(post)
    json = DiscourseQuiz::QuizQuestionSerializer.new(quiz.questions[0], scope: Guardian.new).as_json
    expect(json[:quiz_question].key?(:text)).to eq(true)
    expect(json[:quiz_question].key?(:answer)).to eq(false)
  end
end
