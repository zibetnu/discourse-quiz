# frozen_string_literal: true
class CreateQuizTables < ActiveRecord::Migration[6.1]
  def up
    create_table :quizzes do |t|
      t.integer :time_limit
      t.integer :max_attempts_allowed, default: 1
      t.boolean :is_open, null: false, default: false
      t.boolean :is_editable, null: false, default: true
      t.timestamp :open_at
      t.timestamp :close_at

      t.timestamps
    end

    create_table :quiz_questions do |t|
      t.text :raw, null: false
      t.text :cooked, null: false
      t.integer :position, null: false
      t.integer :format, null: false, default: 0

      t.timestamps
    end

    create_table :quiz_options do |t|
      t.text :text, null: false
      t.integer :position, null: false

      t.timestamps
    end

    create_table :quiz_attempts do |t|
      t.timestamp :finished_at, null: true
      t.integer :score, null: true

      t.timestamps
    end

    create_table :quiz_question_responses do |t|
      t.timestamps
    end
  end
end
