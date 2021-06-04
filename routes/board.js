const express = require('express');
const router = express.Router();
const Board = require('../models/board');
const List = require('../models/board');

// create board
router.post('/', async (req, res, next) => {
  const userId = req.user.id;
  const title = req.body.title;
  
  try {
    const newBoard = new Board({
      title: title,
      userId: userId,
      // default board setting
      List: [
        { title: "Todo", pos: 65535, boardId: board.id },
        { title: "Doing", pos: 65535 * 2, boardId: board.id },
        { title: "Done", pos: 65535 * 4, boardId: board.id },
      ],
    });
    await newBoard.save();
    res.status(201).json({ item: board })
  } catch (err) {
    console.log("err" + err);
    res.status(500).send(err);
  }
});

router.get('/', (req, res, next) => {

})

module.exports = router;