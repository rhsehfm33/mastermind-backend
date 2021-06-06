const express = require('express');
const router = express.Router();
const Board = require('../models/board');
const List = require('../models/list');
const Card = require('../models/card');

// 카드 create
router.post('/', async (req, res, next) => {
	const userId = req.user.id;
	let { title, listId, pos } = req.body;

	if (!title) {
		res.status(400).end('no title');
	}
	if (!listId) {
		res.status(400).end('no listId');
	}

	// 카드 생성
	const card = new Card({
		title: title,
		pos: pos,
		listId: listId,
		userId: userId
	});
	await card.save();

	// 리스트와 연결
	const list = await List.findById(listId);
	list.addCard(card);

	res.status(201).json({ item: card });
});

//카드 수정(UPDATE)
router.put('/:id', async (req, res, next) => {
	const { id } = req.params;
	let body = req.body;

	if (!id) {
		return res.status(400).json({ error: 'no id' });
	};

	let card = await Card.findById(id);
	if (!card) {
		return res.status(404).json({ error: 'no card' });
	};

	// 각각의 property 에 대해서 그 값들을 udpate함
	Object.keys(body).forEach(key => {
		let value = body[key];
		if (typeof value === 'string') {
			value = value.trim();
		};
		if (key === 'description' || value) {
			card[key] = value;
		};
	})

	await card.save();

	res.json({ item: card });
});

// 요청된 카드 삭제
router.delete('/:id', async (req, res, next) => {
	const { id } = req.params;
	if (!id) {
		return res.status(400).json({ error: 'no id' });
	}

	targetCard = await Card.findById(id);
	if (!targetCard) {
		return res.status(404).json({ error: 'no card' });
	}

	targetCard.remove();

	res.status(204).end();
});

module.exports = router;