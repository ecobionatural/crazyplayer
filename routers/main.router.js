const express = require('express');
const router = express.Router();
const fs = require('fs');


router.get('/',(req,res)=>{
	res.render(c.root+'/views/main.pug');
});
// router.get('/qq/',(req,res)=>{
// 	//res.render(c.root+'/views/main.pug');
// 	res.send(`
// 		<script>
// 			window.open("/q/","qq","width=500 height=300 scrollbars=0 titlebar=0 toolbar=0 status=0 menubar=0 location=0");
// 			window.close();
// 		</script>`)
// });
// router.get('/q/',(req,res)=>{
// 	res.send('Q!')
//})
router.get('/video',(req,res)=>{
	res.sendFile(req.query.url);
})

module.exports = router;
