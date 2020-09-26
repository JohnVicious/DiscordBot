
const localCheck = (window.location.href).includes('localhost');
var localSlash = "";
var wsConnectionURL = "wss://johnklein.dev/websocket";
if(localCheck)
{
	localSlash = "/";
	wsConnectionURL = "ws://localhost:6969"
}

const connection = new WebSocket(wsConnectionURL);
  
connection.onmessage = (e) => {
	if(e.data == "member_activity"){
		checkForUserUpdate();
	}
}


document.getElementById('joinChannel').addEventListener('click', function(e) {
	var command = 'joinChannel';
	var fetchUrl = localSlash + 'AmongUs/' + command;
	
	fetch(fetchUrl, {method: 'POST'})
		.then(function(response) {
			if(response.ok) {
				console.log('Joined channel');
				return;
			}
			throw new Error('Request failed.');
		})
		.catch(function(error) {
			console.log(error);
		});
});

document.getElementById('leaveChannel').addEventListener('click', function(e) {
	var command = 'leaveChannel';
	var fetchUrl = localSlash + 'AmongUs/' + command;
	
	fetch(fetchUrl, {method: 'POST'})
		.then(function(response) {
			if(response.ok) {
				console.log('Left channel');
				return;
			}
			throw new Error('Request failed.');
		})
		.catch(function(error) {
			console.log(error);
		});
});

document.getElementById('muteAll').addEventListener('click', function(e) {
	var command = 'muteAll';
	var fetchUrl = localSlash + 'AmongUs/' + command;
	
	fetch(fetchUrl, {method: 'POST'})
		.then(function(response) {
			if(response.ok) {
				console.log('Mute all');
				checkForUserUpdate();
				return;
			}
			throw new Error('Request failed.');
		})
		.catch(function(error) {
			console.log(error);
		});
});

document.getElementById('unmuteAll').addEventListener('click', function(e) {
	var command = 'unmuteAll';
	var fetchUrl = localSlash + 'AmongUs/' + command;
	
	fetch(fetchUrl, {method: 'POST'})
		.then(function(response) {
			if(response.ok) {
				console.log('Unmute all');
				checkForUserUpdate();
				return;
			}
			throw new Error('Request failed.');
		})
		.catch(function(error) {
			console.log(error);
		});
});

document.getElementById('allAlive').addEventListener('click', function(e) {
	var command = 'allAlive';
	var fetchUrl = localSlash + 'AmongUs/' + command;
	
	fetch(fetchUrl, {method: 'POST'})
		.then(function(response) {
			if(response.ok) {
				console.log('All alive');
				checkForUserUpdate();
				return;
			}
			throw new Error('Request failed.');
		})
		.catch(function(error) {
			console.log(error);
		});
});

document.getElementById('listUsers').addEventListener('click', function(e) {
	checkForUserUpdate();
});

$(document).on('click', '.userMic-btn', function(){
	
	var isMuted = false;
	var btn = $(this);
	btn.children().each(function () {
		for(let itemClass of this.classList){
			if(itemClass == "hidden"){
				if($(this).hasClass('userMic-inactive')){
					isMuted = true;
				}
			}
		}
		
		$(this).toggleClass("hidden");
	});
	
	//If isMuted is true, we need to mute user
	if(isMuted){
		btn.removeClass('btn-success');
		btn.addClass('btn-danger');
	}else{
		btn.addClass('btn-success');
		btn.removeClass('btn-danger');
	}
	
	if(isMuted){
		var command = 'muteUser';
	}else{
		var command = 'unmuteUser';
	}
	var fetchUrl = localSlash + 'AmongUs/' + command;
	
	fetch(fetchUrl, 
		{
			method: 'POST', 
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify({id:btn.data('id')})
		})
		.then(function(response) {
			if(response.ok) {
				console.log('Mute status');
				checkForUserUpdate();
				return;
			}
			throw new Error('Request failed.');
		})
		.catch(function(error) {
			console.log(error);
		});
});

$(document).on('click', '.userAlive-btn', function(){
	
	var isAlive = false;
	var btn = $(this);
	btn.children().each(function () {
		for(let itemClass of this.classList){
			if(itemClass == "hidden"){
				if($(this).hasClass('userAlive-inactive')){
					isAlive = true;
				}
			}
		}
		
		$(this).toggleClass("hidden");
	});
	
	//If isAlive is true, we need to mark user as alive
	if(isAlive){
		btn.removeClass('btn-success');
		btn.addClass('btn-danger');
	}else{
		btn.addClass('btn-success');
		btn.removeClass('btn-danger');
	}
	
	if(isAlive){
		var command = 'markDeadUser';
	}else{
		var command = 'markAliveUser';
	}
	var fetchUrl = localSlash + 'AmongUs/' + command;
	
	fetch(fetchUrl, 
		{
			method: 'POST', 
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify({id:btn.data('id')})
		})
		.then(function(response) {
			if(response.ok) {
				console.log('Alive status');
				checkForUserUpdate();
				return;
			}
			throw new Error('Request failed.');
		})
		.catch(function(error) {
			console.log(error);
		});
		
});

function checkForUserUpdate()
{
	var command = 'listUsers';	
	var fetchUrl = localSlash + 'AmongUs/' + command;

	fetch(fetchUrl, {method: 'GET'})
		.then(res => res.json())
		.then((json) => {
			
			$("#userList").empty();
			
			for (let userData of json) {
				$('#userList').append('<div class="userPanel"><div class="userIcon"><img src="' + userData.avatarURL + '" style="max-width: 36px;" /></div><div class="userInfo"><span>'+ userData.username+'</span></div><div class="userActions"><button class="btn ' + (userData.muted ? 'btn-danger' : 'btn-success') + ' userMic-btn" data-id="' + userData.id + '" data-muted="' + userData.muted + '"><i class="userMic-active ' + (userData.muted ? 'hidden' : '') + ' fas fa-microphone"></i><i class="userMic-inactive ' + (userData.muted ? '' : 'hidden') + ' fas fa-microphone-slash"></i></button><button class="btn ' + (userData.alive ? 'btn-success' : 'btn-danger') + ' userAlive-btn" data-id="' + userData.id + '" data-alive="' + userData.alive + '"><i class="userAlive-active ' + (userData.alive ? '' : 'hidden') + ' fas fa-heart"></i><i class="userAlive-inactive ' + (userData.alive ? 'hidden' : '') + ' fas fa-skull-crossbones"></i></button></div></div>');
			}
			
		})
		.catch(function(error) {
			console.log(error);
		});
}
