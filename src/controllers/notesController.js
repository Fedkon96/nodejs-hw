import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;
    const pageNum = Number(page) || 1;
    const limit = Math.min(Math.max(Number(perPage) || 10, 5), 20);

    const filter = { userId: req.user._id };
    if (tag) filter.tag = tag;
    if (search && String(search).trim() !== '') {
      filter.$text = { $search: String(search) };
    }

    const [totalNotes, notes] = await Promise.all([
      Note.countDocuments(filter),
      Note.find(filter)
        .skip((pageNum - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
    ]);

    const totalPages = Math.ceil(totalNotes / limit) || 1;

    res.status(200).json({
      page: pageNum,
      perPage: limit,
      totalNotes,
      totalPages,
      notes,
    });
  } catch (err) {
    next(err);
  }
};

// GET /notes/:noteId
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findOne({ _id: noteId, userId: req.user._id });
    if (!note) {
      next(createHttpError(404, 'Note not found'));
      return;
    }
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

// POST /notes
export const createNote = async (req, res, next) => {
  try {
    const newNote = await Note.create({ ...req.body, userId: req.user._id });
    res.status(201).json(newNote);
  } catch (err) {
    next(err);
  }
};

// PATCH /notes/:noteId
export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const updated = await Note.findOneAndUpdate(
      { _id: noteId, userId: req.user._id },
      req.body,
      {
        new: true,
      }
    );
    if (!updated) {
      next(createHttpError(404, 'Note not found'));
      return;
    }
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /notes/:noteId
export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const deleted = await Note.findOneAndDelete({
      _id: noteId,
      userId: req.user._id,
    });
    if (!deleted) {
      next(createHttpError(404, 'Note not found'));
      return;
    }
    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
};
