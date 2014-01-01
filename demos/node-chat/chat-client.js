window.app = {

	uid : 0,
	nickname : '',
	ready: false,

	setNickname : function() 
	{
		var n = emy.$('#chat_nickname').value;
		if(n!='') {
			if(app.nickname)
				chat.emit('nickchange', { uid: app.uid, from: app.nickname, to: n });
			else
				chat.emit('newuser', { uid: app.uid, me: n });

			app.nickname = n;
			emy.$('#chat_nickname').blur();
			emy.addClass(emy.$('#nickname_box'), 'hide');
			emy.changeClass(emy.$('#chat_box'), 'hide','');
		}
	},

	sendText : function()
	{
		if(app.ready && app.nickname) 
		{
			var msg = emy.$('#chat_message').value;
			if(msg) {
				chat.emit('message', { uid: app.uid, msg: msg });
				emy.$('#chat_message').value = '';
			}
		}
	},

	history : function() 	{ chat.emit('history'); }
};


var chat = io.connect('http://localhost:8080');

chat.on('connect', function () 
{
	app.uid = 'emy-';
	for(var i=0;i<12;i++) {
		app.uid += Math.floor(Math.random()*10);
	}
	app.ready=true;
	emy.showViewById('me');
});

chat.on('info', function (o)
{
	if(app.ready) 
	{
		if(o.type=="newuser") {
			console.log('#'+o.data.uid+' : Bienvenu '+o.data.me+' !');
		}
		else if(o.type=="nickchange") {
			console.log('#'+o.data.uid+' : '+o.data.from+' est maintenant '+o.data.to);
		}
	}
});

chat.on('message', function (o)
{
	if(app.ready && app.nickname)
	{
		console.log('#'+o.uid+' : Message '+o.msg);
		var msgElementText = '', msgElement = emy.$('#message_master').cloneNode(true);
		msgElement.removeAttribute('id');
		emy.$('#chatroom').appendChild(msgElement);
	}
});


chat.on('history', function (o)
{
	console.log(o);
});