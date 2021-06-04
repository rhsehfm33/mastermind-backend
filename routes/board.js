const express = require('express');
const router = express.Router();
const Board = require('../models/board');
const List = require('../models/list');
const Card = require('../models/card');

// create board
router.post('/', async (req, res, next) => {
  const userId = req.user.id;
  const title = req.body.title;
  
  try {
    const newBoard = new Board({
      title: title,
      userId: userId,
    });

    // default board setting
    const todoList = await List.create({ title: "Todo", pos: 65535, boardId: newBoard.id });
    const doingList = await List.create({ title: "doingList", pos: 65535 * 2, boardId: newBoard.id });
    const doneList = await List.create({ title: "doneList", pos: 65535 * 4, boardId: newBoard.id });
    newBoard.lists.push(todoList, doingList, doneList);
    const saveBoard = await newBoard.save();

    res.status(201).json({ item: saveBoard });
  } catch (err) {
    console.log("err" + err);
    res.status(500).send(err);
  }
});

// get boards about requested user
router.get('/', async (req, res, next) => {
  const userId = req.user.id;
  const list = await Board.find({userId: userId});
  res.json({ list });
});


// get all the information about requested board
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  let item = await Board.findById(id);
  if (!item) {
    return res.status(404).end();
  }

  await item.populate({
    path: 'lists',
    populate: { path: 'cards'},
  }).execPopulate();

  

  // show the list ordered by the position from top to bottom
  if (item.lists) {
    item.lists.sort((a, b) => a.pos - b.pos)
    item.lists.forEach(list => {
      if (list.cards) {
        list.cards.sort((a, b) => a.pos - b.pos)
      }
    });
  }

  console.log("item log", item);

  res.json({ item });
});

// change the board title
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  let body = req.body;

  let board = await Board.findById(id);

  if (!board) {
    return res.status(404).end();
  }

  // change each property of requested board
  Object.keys(body).forEach(key => {
    let value = body[key];
    if (typeof value === 'string') {
      value = value.trim();
    }
    if (!value) {
      return;
    }
    board[key] = value;
  });

  await board.save();

  res.json({ item: board });
});


// delete the requested board
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  await Board.findByIdAndRemove(id);
  res.status(204).end();
});

module.exports = router;