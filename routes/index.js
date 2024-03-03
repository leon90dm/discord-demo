var express = require('express');
var router = express.Router();

import {SendMessage} from './sendmsg.js';
const CHANNEL_ID = process.env.CHANNEL_ID;
const POT_ID = process.env.POT_ID

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/chat', async (req, res) => {
  const msg = req.query.msg
  console.log('query msg:'+msg)
  res.send(await SendMessage(CHANNEL_ID, `<@${POT_ID}> ${msg}`));
});

module.exports = router;
