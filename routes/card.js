const express = require("express");
const router = express.Router();
const List = require("../models/list");
const Card = require("../models/card");

// 카드 create
router.post("/", async (req, res, next) => {
  const userId = req.user.id;
  let { title, listId, pos } = req.body;

  if (!title) {
    res.status(400).end("no title");
  }
  if (!listId) {
    res.status(400).end("no listId");
  }

  // 카드 생성
  const card = await Card.create({
    title: title,
    pos: pos,
    listId: listId,
    userId: userId,
  });

  // 리스트와 연결
  const list = await List.findById(listId);
  list.addCard(card);

  res.status(201).json({ item: card });
});

//카드 읽기(READ)
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "no id" });
  }

  const card = await Card.findById(id);

  res.json({ item: card });
});

//카드 수정(UPDATE)
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;

  if (!id) {
    return res.status(400).json({ error: "no id" });
  }

  let card = await Card.findById(id);
  if (!card) {
    return res.status(404).json({ error: "no card" });
  }

  // 기존에 리스트에 있던 카드 제거
  const { listId } = await Card.findById(id);
  const prvList = await List.findById(listId);
  prvList.cards.pull({ _id: card._id });
  prvList.save();

  // 각각의 property 에 대해서 그 값들을 udpate함
  Object.keys(body).forEach((key) => {
    let value = body[key];
    if (typeof value === "string") {
      value = value.trim();
    }
    if (key === "description" || value) {
      card[key] = value;
    }
  });
  card.save();

  // 카드를 넣으려는 리스트에 update한 카드 추가
  const curList = await List.findById(card.listId);
  curList.cards.push({ _id: card._id });
  curList.save();

  res.json({ item: card });
});

// 요청된 카드 삭제
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "no id" });
  }

  targetCard = await Card.findById(id);
  if (!targetCard) {
    return res.status(404).json({ error: "no card" });
  }

  targetCard.remove();

  res.status(204).end();
});

module.exports = router;
