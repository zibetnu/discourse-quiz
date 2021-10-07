import { createWidget } from "discourse/widgets/widget";
import hbs from "discourse/widgets/hbs-compiler";

export default createWidget("quiz-options", {
  tagName: "div.quiz-options",

  buildKey: () => "quiz-options",

  transform(attrs) {
    return {
      content: this._buildContent(attrs),
      onChange: (item) => this.sendWidgetAction(item.id, item.param),
      options: {},
    };
  },

  template: hbs`
    {{attach
      widget="widget-dropdown"
      attrs=(hash
        id="quiz-options"
        icon="ellipsis-h"
        label="discourse_quiz.widget.more"
        content=this.transformed.content
        onChange=this.transformed.onChange
        options=this.transformed.options
      )
    }}
  `,

  _buildContent(attrs) {
    const content = [];
    // Edit
    content.push({
      id: "edit",
      icon: "pencil-alt",
      label: "discourse_quiz.widget.edit",
    });
    // Preview
    content.push({
      id: "preview",
      icon: "far-eye",
      label: "discourse_quiz.widget.preview",
    });

    // Close / Open
    if (attrs.model.is_open) {
      // Close
      content.push({
        id: "close",
        icon: "lock",
        label: "discourse_quiz.widget.close",
      });
    } else {
      // Open
      content.push({
        id: "open",
        icon: "unlock",
        label: "discourse_quiz.widget.open",
      });
    }

    // Delete
    content.push({
      id: "delete",
      icon: "trash-alt",
      label: "discourse_quiz.widget.delete",
    });
    return content;
  },
});
