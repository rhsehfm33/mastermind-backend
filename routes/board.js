const express = require("express");
const router = express.Router();
const Board = require("../models/board");
const List = require("../models/list");

// 보드 생성
router.post("/", async (req, res, next) => {
  const userId = req.user.id;
  const title = req.body.title;

  try {
    const newBoard = new Board({
      title: title,
      userId: userId,
    });

    // 기본적인 보드의 리스트 세팅
    const todoList = await List.create({
      title: "Todo",
      pos: 65535,
      boardId: newBoard.id,
    });
    const doingList = await List.create({
      title: "doingList",
      pos: 65535 * 2,
      boardId: newBoard.id,
    });
    const doneList = await List.create({
      title: "doneList",
      pos: 65535 * 4,
      boardId: newBoard.id,
    });
    
    newBoard.lists.push(todoList, doingList, doneList);
    const saveBoard = await newBoard.save();

    res.status(201).json({ item: saveBoard });
  } catch (err) {
    console.log("err" + err);
    res.status(500).send(err);
  }
});

// 요청된 사용자에 대한 보드 정보를 응답함
router.get("/", async (req, res, next) => {
  const userId = req.user.id;
  const list = await Board.find({ userId: userId });
  res.json({ list });
});

// 요청된 보드에 대한 모든 정보를 응답함
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  let item = await Board.findById(id);
  if (!item) {
    return res.status(404).end();
  }

  await item
    .populate({
      path: "lists",
      populate: { path: "cards" },
    })
    .execPopulate();

  // 리스트를 왼쪽에서부터 오른쪽으로 정렬해 보여주기 위해 사용
  if (item.lists) {
    item.lists.sort((a, b) => a.pos - b.pos);
    item.lists.forEach((list) => {
      if (list.cards) {
        list.cards.sort((a, b) => a.pos - b.pos);
      }
    });
  }

  res.json({ item });
});

// 보드 수정(UPDATE)
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  let body = req.body;

  let board = await Board.findById(id);

  if (!board) {
    return res.status(404).end();
  }

  // 각각의 property에 대해서 그 값들을 update함
  Object.keys(body).forEach((key) => {
    let value = body[key];
    if (typeof value === "string") {
      value = value.trim();
    }
    if (value) {
      board[key] = value;
    }
  });

  await board.save();

  res.json({ item: board });
});

// 요청된 보드를 삭제
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "no id" });
  }

  targetBoard = await Board.findById(id);
  if (!targetBoard) {
    return res.status(404).json({ error: "no board" });
  }

  targetBoard.remove();

  res.status(204).end();
});

module.exports = router;
