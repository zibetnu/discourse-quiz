# frozen_string_literal: true
class CreateQuizTables < ActiveRecord::Migration[6.1]
  def change
    create_table :quizzes do |t|
      t.text :title, null: false
      t.integer :time_limit, null: true
      t.integer :max_attempts, null: true
      t.boolean :is_open, null: false, default: false
      t.timestamp :open_at, null: true
      t.timestamp :close_at, null: true
      t.timestamps
    end

    create_table :quiz_questions do |t|
      t.text :text, null: false
      t.integer :format, null: false, default: 0
      t.text :options, array: true, null: true
      t.text :answer, null: false
    end

    create_table :quiz_attempts do |t|
      t.timestamp :finished_at, null: true
      t.timestamp :started_at, null: false
    end

    create_table :quiz_question_responses do |t|
      t.text :answer, null: false
      t.timestamps
    end
  end
end
