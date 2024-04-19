# frozen_string_literal: true

require 'rails_helper'
require_relative "../sample_quiz.rb"
require_relative "../fabricators/quiz_fabricator.rb"

describe DiscourseQuiz::QuizzesController do
  describe "#show" do
    it "returns successful response" do
      quiz = Fabricate(:quiz)
      get "/quizzes/#{quiz.id}.json"
      expect(response.status).to eq(200)
    end
    it "returns 404 for non-existant quiz" do
      get "/quizzes/1234.json"
      expect(response.status).to eq(404)
    end
  end
  describe "#update" do
    it "updates quiz" do
      quiz = Fabricate(:quiz)
      expect(quiz.is_open).to eq(false)
      put "/quizzes/#{quiz.id}.json", params: { "quiz[is_open]" => true }
      expect(response.status).to eq(200)
      quiz = DiscourseQuiz::Quiz.find(quiz.id)
      expect(quiz.is_open).to eq(true)
    end
  end
end
