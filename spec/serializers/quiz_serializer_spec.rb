# frozen_string_literal: true

require "rails_helper"
require_relative "../fabricators/quiz_fabricator"
require_relative "../sample_quiz.rb"

describe DiscourseQuiz::QuizSerializer do
  it "hides questions" do
    quiz = Fabricate(:quiz)
    user = Fabricate(:user)
    json = DiscourseQuiz::QuizSerializer.new(quiz, scope: Guardian.new(user)).as_json
    expect(json[:quiz].key?(:questions)).to eq(false)
  end
end
