const express = require('express');
const router = express.Router();
const Board = require('../models/board');
const List = require('../models/list');
const Card = require('../models/card');

// 리스트 create
router.post('/', async (req, res, next) => {
	const userId = req.user.id;
  let { title, boardId, pos } = req.body;

  if (!title) {
		res.status(400).end('no title');
	}
  if (!boardId) {
		res.status(400).end('no boardId');
	}
  if (!pos){
		res.status(400).end('no pos');
	}

	// 리스트 생성
  const list = new List({
		title: title,
		pos: pos,
		boardId: boardId,
		userId: userId
	});
  await list.save();

	// 보드와 연결
	const board = await Board.findById(boardId);
	board.addList(list);

  res.status(201).json({ item: list });
});

// 리스트 수정(UPDATE)
router.put('/:id', async (req, res, next) => {
  const {id} = req.params;
  let body = req.body;

  if (!id) {
		return res.status(400).json({error: 'no id'});
	}

  let list = await List.findById(id);
  if (!list) {
		return res.status(404).json({error: 'no list'});
	}

	// 각각의 property 에 대해서 그 값들을 udpate함
  Object.keys(body).forEach(key => {
    let value = body[key];
    if (typeof value === 'string') {
			value = value.trim();
		};
    if (!value) {
			return;
		}
    list[key] = value;
  })

  await list.save();

  res.json({ item: list });
});


// 요청된 리스트 삭제
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
		return res.status(400).json({ error: 'no id' });
	}

	targetList = await List.findById(id);
	if (!targetList) {
		return res.status(404).json({error: 'no list'});
	}

	targetList.remove();

  res.status(204).end()
});

module.exports = router;