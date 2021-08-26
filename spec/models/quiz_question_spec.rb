# frozen_string_literal: true

require 'rails_helper'

describe QuizQuestion do
  describe "options" do
    it "returns 'true' and 'false' options when format='true_false'" do
      true_option = QuizOption.new(text: "True", position: 1).save
      false_option = QuizOption.new(text: "False", position: 1).save
      question = QuizQuestion.new(format: "true_false")
      options = question.options
      expect(options[0].text).to eq("True")
      expect(options[1].text).to eq("False")
    end

    it "raises error when format='multiple_choice' and id=nil" do
      question = QuizQuestion.new
      expect(question.format).to eq("multiple_choice")
      expect { question.options }.to raise_error(RuntimeError)
    end

     it "returns associated options when format='multiple_choice'" do
       post = Fabricate(:post, raw: "Test post with a quiz")
       quiz = Quiz.new(post_id: post.id)
       quiz.save
       question = QuizQuestion.new(quiz_id: quiz.id, raw: "How far is the Earth from the Sun?", cooked: "How far is the Earth from the Sun?", position: 1)
       question.save
       option1 = QuizOption.new(text: "Option 1", position: 1, quiz_question_id: question.id)
       option1.save
       option2 = QuizOption.new(text: "Option 2", position: 2, quiz_question_id: question.id)
       option2.save

       expect(question.options[0].text).to eq("Option 1")
       expect(question.options[1].text).to eq("Option 2")
     end
  end
end
