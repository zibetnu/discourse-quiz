# frozen_string_literal: true
class Quiz < ActiveRecord::Base
  has_many :quiz_questions, dependent: :destroy
  belongs_to :post
end
