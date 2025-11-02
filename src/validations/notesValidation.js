import { Joi, Segments } from 'celebrate';
import mongoose from 'mongoose';
import { TAGS } from '../constants/tags.js';

const isObjectId = (value, helpers) => {
  if (!mongoose.isValidObjectId(value)) {
    return helpers.message('"{{#label}}" must be a valid ObjectId');
  }
  return value;
};

const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
    search: Joi.string().allow('', null).optional(),
  }),
};

const noteIdSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    noteId: Joi.string().custom(isObjectId).required(),
  }),
};

const createNoteSchema = {
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(1).required(),
    content: Joi.string().allow('').optional(),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
  }),
};

const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    noteId: Joi.string().custom(isObjectId).required(),
  }),
  [Segments.BODY]: Joi.object()
    .keys({
      title: Joi.string().min(1).optional(),
      content: Joi.string().allow('').optional(),
      tag: Joi.string()
        .valid(...TAGS)
        .optional(),
    })
    .min(1),
};

export { getAllNotesSchema, noteIdSchema, createNoteSchema, updateNoteSchema };
