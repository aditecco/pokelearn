import { defineType, defineField } from "sanity";
import { v4 as uuidv4 } from "uuid";

export const challengeSet = defineType({
  name: "challengeSet",
  title: "Challenge Set",
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
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
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
      name: "challenges",
      title: "Challenges",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "challenge" }],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Emoji or icon name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      description: "Hex color code (e.g., #ef4444)",
      validation: (Rule) =>
        Rule.required().regex(/^#[0-9A-F]{6}$/i, {
          name: "hex color",
          invert: false,
        }),
    }),
    defineField({
      name: "estimatedMinutes",
      title: "Estimated Minutes",
      type: "number",
      description: "Estimated time to complete",
    }),
    defineField({
      name: "prerequisites",
      title: "Prerequisites",
      type: "array",
      of: [{ type: "reference", to: [{ type: "challengeSet" }] }],
      description: "Challenge sets that should be completed first",
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
      title: "name",
      subtitle: "subject",
      difficulty: "difficulty",
      icon: "icon",
    },
    prepare({ title, subtitle, difficulty, icon }) {
      return {
        title: `${icon} ${title}`,
        subtitle: `${subtitle} - ${difficulty}`,
      };
    },
  },
});