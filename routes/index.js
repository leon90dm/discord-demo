var express = require('express');
var router = express.Router();

const {SendMessage} =require('./sendmsg.js');
const CHANNEL_ID = process.env.CHANNEL_ID;
const POT_ID = process.env.POT_ID

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/chat', async function (req, res, next) {
  const msg = req.query.msg
  console.log('query msg:'+msg)
  var resMsg = await SendMessage(CHANNEL_ID, `<@${POT_ID}> ${msg}`);
  res.render('chat', { title: 'Chat', msg: resMsg });
});

module.exports = router;
