const telegramBot = require('node-telegram-bot-api');
const {MongoClient, ObjectID} = require('mongodb');
const fs = require('fs');
const express = require('express');

const port = process.env.PORT || 3000;

var token ='1065557544:AAEzzrCLkbLD9ikZDhuJ2_vV80L316frYbw';
var api = new telegramBot(token, {polling: true});
var app = express();

MongoClient.connect('mongodb://heroku_9wjl0rfc:7j4bn8al251s74btsula1gv8fl@ds237588.mlab.com:37588/heroku_9wjl0rfc', (err, client) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('heroku_9wjl0rfc');

	//START
  api.onText(/\/start/, function(msg, match) {

	var fromId = msg.from.id;
	var fname = msg.from.first_name;
	var lname = msg.from.last_name;
	var usn = msg.from.username;
	var dir = './' + fromId;

	if(!fs.existsSync(dir)){
		fs.mkdirSync(dir);
		console.log("Directory Created!");
	}else{
		console.log("Directory exists!");
	}

	
	db.collection('bitpif_users').find({
		telegramId: fromId
	}).limit(1).count().then((count) =>{
		if(count > 0){
			console.log('user exists');
		}else{
			db.collection('bitpif_users').insertOne({
			    telegramId: fromId,
			    userName: usn,
			    firstName: fname,
			    lastName: lname,
			    email: '',
			    twitterUsn: '',
			    btcAddress: '',
			    vklike: '',
			    instlike:'',
			    added: 0,
			    addedPerson: []
			  },(err, result) => {
			    if(err){
			      return console.log('Unable to insert user', err);
			    }

			    console.log(result.ops);
			    console.log(`User ${fname} is Added`);

			  });
		}
	},(err) => {
		console.log('Unable to fetch user', err);
	});

	


	var options = {
	  reply_markup: JSON.stringify({
	  	resize_keyboard:true,
	    keyboard: [
	      [
	        {text: '\u{1F426}' + ' 1. /Telegram'},
	        {text: '\u{1F4F1}' + ' 2. /VK'},
	      ],
	      [
	      	{text: '\u{1F64B}' + ' 3. /Twitter'},
	        {text: '\u{1F4DD}' + ' 4. /Instagram'}
	      ],
	      [
	      	{text: '\u{1F3C6}' + '5. /Refer'},
	      	{text: '\u{1F453}' + '6. /Profile'}
	      ]
	    
	    ]
	  })
	};

	api.sendMessage(fromId, `Hi ${fname}, welcome to the BITPIF Airdrop bot!  \n\n` +
		`\u{1F4E3} A total of 100 BPIF tokens could be yours! \n\n` +
		`\u{1F537} 8 BPIF tokens for joining our Telegram group \n` +
		`\u{1F537} 8 BPIF tokens for liking our VK page \n` +
		`\u{1F537} 8 BPIF tokens for following our Twitter \n` +
		`\u{1F537} 16 BPIF tokens for following our Instagram page \n` +
		`\u{1F537} 10 BPIF tokens for doing all of the above \n` +
		`\u{1F537} 50 BPIF tokens for referring 10 members into our Telegram group \n\n` +
		`To start earning BPIF tokens, please press /Telegram.`
		, options);
	});
  //START END

  // TELEGRAM JOIN
  api.onText(/\/Telegram/, function(msg, match) {

	var fromId = msg.from.id;

	api.sendMessage(fromId,
		"Join @bitpif / https://t.me/bitpif Telegram group! \n\n" +
		"Come back here and type /joined once done.",
		{
			parse_mode: 'html'
		}
		);
	});

  // JOINED TELEGRAM
  api.onText(/\/joined/, function(msg, match) {

	var fromId = msg.from.id;

	api.sendMessage(fromId,
		"Thank you for joining our Telegram group! Please press /VK to proceed. \n\n",
		{
			parse_mode: 'html'
		}
		);
	});

  // VK
  api.onText(/\/VK/, function(msg, match) {

	var fromId = msg.from.id;

	api.sendMessage(fromId,
		"Like us on VK https://www.vk.com/bitpif/ \n\n" +
		"Send a screenshot showing you’ve followed our VK page.",
		{
			parse_mode: 'html'
		}
		);
	});

  // VK Screenshot

  // TWITTER


  api.onText(/\/Twitter/, function(msg, match) {

	var fromId = msg.from.id;

	api.sendMessage(fromId,
		"Follow #BITPIF on Twitter https://twitter.com/bitpif \n\n" +
		"Please provide your Twitter username. \n\n" +
		"Type /twitterusn <i>Twitter Username</i>",
		{
			parse_mode: 'html'
		}
		);
	});


  // INSTAGRAM
  api.onText(/\/Instagram/, function(msg, match) {

	var fromId = msg.from.id;

	api.sendMessage(fromId,
		"Follow our Instagram page https://www.instagram.com/bitpif/ \n\n" +
		"Send a screenshot showing you’ve followed our Instagram page.",
		{
			parse_mode: 'html'
		}
		);
	});

  //REFER
api.onText(/\/Refer/, function(msg, match) {

	var fromId = msg.from.id;

	api.sendMessage(fromId,
		"Bonus round! This is optional but worth a shot!  Earn up to 50 BPIF tokens by adding up to 10 of your friends into @bitpif / https://t.me/bitpif Telegram group. Each successfully referred member will earn you 5 BPIF tokens.  \n\n" +
		"There will be checks done to ensure the added members are real accounts. If not, your entire token earnings will be forfeited. \n\n" +
		"Finally, update your information by clicking /Profile. Without this information, we will not be able to distribute your airdrops.",
		{
			parse_mode: 'html'
		}
		);
	});

	// Profile
  api.onText(/\/Profile/, function(msg, match) {

	var fromId = msg.from.id;

	db.collection('bitpif_users').find({
		telegramId: fromId
	}).toArray().then((docs) => {
		console.log(docs);
		api.sendMessage(fromId,"Your Profile \n\n" +
			`<b>First Name:</b> ${docs[0].firstName}\n` +
			`<b>Last Name:</b> ${docs[0].lastName}\n` +
			`<b>Email:</b> ${docs[0].email}\n` +
			`<b>Twitter Username:</b> ${docs[0].twitterUsn}\n` +
			`<b>BTC Address:</b> ${docs[0].btcAddress}\n\n` +
			"To update your profile: \n\n" +
			"Type /upfirstname <i>Your First name</i> \n" +
			"Type /uplastname <i>Your Last name</i> \n" +
			"Type /upemail <i>Your Email</i> \n" +
			"Type /uptwitter <i>Your Twitter Username</i> \n" +
			"Type /upbtcaddress <i>Your BTC Address</i> \n",
			{
				parse_mode : 'html'
			});
	}, (err) => {
		console.log('user not found');
	});
   });

  // send images
  api.on('photo', (msg) => {
	var fromId = msg.from.id;
	var photoId = msg.photo[msg.photo.length-1].file_id;
	var dir = `./${fromId}`;
	
	fs.readdir(dir, function(err, files) {
	    if (err) {
	       console.log(err);
	    } else {
	       if (!files.length) {
	           var path = api.downloadFile(photoId, dir).then(function (path) {
					console.log(path);
					db.collection('bitpif_users').findOneAndUpdate({
						telegramId: fromId
					},{
						$set: {
							vklike: 'yes'
						}
					},{
						returnOriginal: false
					}).then((result) => {
						console.log(result);
						
					},(err) => {
						console.log('unable to update vklike');
					});
					api.sendMessage(fromId,"VK screenshot has been received! Please press /Twitter to proceed."
						
						);
				});
	       }else{
	       		var path = api.downloadFile(photoId, dir).then(function (path) {
					console.log(path);
					db.collection('bitpif_users').findOneAndUpdate({
						telegramId: fromId
					},{
						$set: {
							lilike: 'yes'
						}
					},{
						returnOriginal: false
					}).then((result) => {
						console.log(result);
						
					},(err) => {
						console.log('unable to update Instlike');
					});
					api.sendMessage(fromId,"Instagram screenshot has been received! Please press /Refer to proceed."
						
						);
				});
	       }
	    }
	});
	

  });

  // TWITTER USN
  api.onText(/\/twitterusn (.+)/, function(msg, match) {
  	var twitterusn = match[1];
	var fromId = msg.from.id;

	db.collection('bitpif_users').findOneAndUpdate({
		telegramId: fromId
	},{
		$set: {
			twitterUsn: twitterusn
		}
	},{
		returnOriginal: false
	}).then((result) => {
		console.log(result);
		api.sendMessage(fromId,'Your Twitter username has been updated. Please press /Instagram to proceed.');
	},(err) => {
		console.log('unable to update twitter usn');
	});

  });

  //firstname update
  api.onText(/\/upfirstname (.+)/, (msg, match) => {
	var fromId = msg.from.id;
	var fname = match[1];

	db.collection('bitpif_users').findOneAndUpdate({
		telegramId: fromId
	},{
		$set: {
			firstName: fname
		}
	},{
		returnOriginal: false
	}).then((result) => {
		console.log(result);
		api.sendMessage(fromId,'Your first name has been updated. Check /Profile to ensure all details are correct');
	},(err) => {
		console.log('unable to update first name');
	});
	
  });

  //lastname
  api.onText(/\/uplastname (.+)/, (msg, match) => {
	var fromId = msg.from.id;
	var lname = match[1];

	db.collection('bitpif_users').findOneAndUpdate({
		telegramId: fromId
	},{
		$set: {
			lastName: lname
		}
	},{
		returnOriginal: false
	}).then((result) => {
		console.log(result);
		api.sendMessage(fromId,'Your last name has been updated. Check /Profile to ensure all details are correct');
	},(err) => {
		console.log('unable to update last name');
	});
	
  });

  //update email
  api.onText(/\/upemail (.+)/, (msg, match) => {
	var fromId = msg.from.id;
	var email = match[1];

	db.collection('bitpif_users').findOneAndUpdate({
		telegramId: fromId
	},{
		$set: {
			email: email
		}
	},{
		returnOriginal: false
	}).then((result) => {
		console.log(result);
		api.sendMessage(fromId,'Your email has been updated. Check /Profile to ensure all details are correct');
	},(err) => {
		console.log('unable to update email');
	});
	
  });

  //update twitter
  api.onText(/\/uptwitter (.+)/, function(msg, match) {
  	var twitterusn = match[1];
	var fromId = msg.from.id;

	db.collection('bitpif_users').findOneAndUpdate({
		telegramId: fromId
	},{
		$set: {
			twitterUsn: twitterusn
		}
	},{
		returnOriginal: false
	}).then((result) => {
		console.log(result);
		api.sendMessage(fromId,'Your twitter has been updated. Check /Profile to ensure all details are correct');
	},(err) => {
		console.log('unable to update twitter usn');
	});

  });

  //upbtcaddress
  api.onText(/\/upbtcaddress (.+)/, function(msg, match) {
  	var btc = match[1];
	var fromId = msg.from.id;

	db.collection('bitpif_users').findOneAndUpdate({
		telegramId: fromId
	},{
		$set: {
			btcAddress: btc
		}
	},{
		returnOriginal: false
	}).then((result) => {
		console.log(result);
		api.sendMessage(fromId,'Your BTC address has been updated. Check /Profile to ensure all details are correct');
	},(err) => {
		console.log('unable to update btc address');
	});

  });

  // SEARCH
  api.onText(/\/search (.+)/, function(msg, match) {
  	var search = match[1];
	var fromId = msg.from.id;

	if(fromId === 413363979 || fromId === 443754890){
		
		db.collection('bitpif_users').find({
			userName: search
		}).toArray().then((user) => {
			api.sendMessage(fromId,"User Found: \n\n" +
				`Username: ${user[0].userName} \n` +
				`First Name: ${user[0].firstName} \n` +
				`Last Name: ${user[0].lastName} \n` +
				`email: ${user[0].email} \n` +
				`Twitter Username: ${user[0].twitterUsn} \n` +
				`BTC Address: ${user[0].btcAddress} \n` +
				`Liked VK?: ${user[0].vklike} \n` +
				`Liked Instagram?: ${user[0].instlike} \n` +
				`Added Person(s) to Group: ${user[0].added} \n` +
				`Added persons: ${user[0].addedPerson} \n`
				);
		},(err) => {
			console.log('Unable to fetch user', err);
		});
	}else{
		api.sendMessage(fromId,'You are not authorized!');
	}

  });

  api.on('new_chat_members', (user) => {
  	var fromId = user.from.id
  	var addedUser = user.new_chat_member.username;
  	var id = new  ObjectID();

  	console.log(user.new_chat_member.first_name);
  	db.collection('bitpif_users').findOneAndUpdate({
		telegramId: fromId
	},{
		$inc: {
			added: +1
		}
	},{
		returnOriginal: false
	}).then((result) => {
		console.log(result);
						
	},(err) => {
		console.log('unable to update added persons');
	});

  	db.collection('bitpif_users').findOneAndUpdate({
		telegramId: fromId
	},{
		$push: {
			addedPerson: [addedUser]
		}
	},{
		returnOriginal: false
	}).then((result) => {
		console.log(result);
						
	},(err) => {
		console.log('unable to update added persons');
	});
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
