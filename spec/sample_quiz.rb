# frozen_string_literal: true

SAMPLE_QUIZ = <<QUIZ
This is a quiz
[quiz]
[question format="multiple_choice"]
If 4x+3 = 15, what is the value of x?
** 3
* 12
* 4
* 18
[/question]
[question format="true_false"]
Python uses semi-colons as a statement delimiter.
* True
** False
[/question]
[question format="multiple_choice"]
This is a question with longer answers
* Option 1 has spaces in it
** Option 2 has spaces in it
* Option 3 has spaces in it
[/question]
[/quiz]

This is a poll
[poll type=regular results=always chartType=bar]
* Option 1
* Option 2
[/poll]
QUIZ
# >>
