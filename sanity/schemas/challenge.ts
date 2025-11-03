import { defineType, defineField } from "sanity";
import { v4 as uuidv4 } from "uuid";

export const challenge = defineType({
  name: "challenge",
  title: "Challenge",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      validation: (Rule) => Rule.required(),
      options: {
        source: () => uuidv4(),
        slugify: (input: string) => input,
        maxLength: 96,
      },
    }),
    defineField({
      name: "subject",
      title: "Subject",
      type: "string",
      options: {
        list: [
          { title: "Italiano", value: "Italiano" },
          { title: "Matematica", value: "Matematica" },
          { title: "Inglese", value: "Inglese" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "grade",
      title: "Grade",
      type: "number",
      options: {
        list: [1, 2, 3, 4, 5],
      },
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: "difficulty",
      title: "Difficulty",
      type: "string",
      options: {
        list: [
          { title: "Facile", value: "Facile" },
          { title: "Medio", value: "Medio" },
          { title: "Difficile", value: "Difficile" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Multiple Choice", value: "multiple-choice" },
          { title: "True/False", value: "true-false" },
          { title: "Fill in the Blank", value: "fill-blank" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "question",
      title: "Question",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "options",
      title: "Options",
      type: "array",
      of: [{ type: "string" }],
      hidden: ({ document }) => document?.type === "fill-blank",
      validation: (Rule) =>
        Rule.custom((options, context) => {
          const type = (context.document as any)?.type;
          if (type === "fill-blank") return true;
          if (!options || options.length < 2) {
            return "Multiple choice and true/false questions need at least 2 options";
          }
          return true;
        }),
    }),
    defineField({
      name: "correctAnswer",
      title: "Correct Answer",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "points",
      title: "Points",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(100),
      initialValue: 10,
    }),
    defineField({
      name: "explanation",
      title: "Explanation",
      type: "text",
      description: "Optional explanation shown after answering",
    }),
    defineField({
      name: "hint",
      title: "Hint",
      type: "text",
      description: "Optional hint for students",
    }),
    defineField({
      name: "media",
      title: "Media",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "type", type: "string", options: { list: ["image", "audio"] } },
            { name: "asset", type: "image" },
            { name: "alt", type: "string", title: "Alt text" },
          ],
        },
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "isPublished",
      title: "Published",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "subject",
      difficulty: "difficulty",
      grade: "grade",
    },
    prepare({ title, subtitle, difficulty, grade }) {
      return {
        title: title,
        subtitle: `${subtitle} - Grade ${grade} - ${difficulty}`,
      };
    },
  },
});