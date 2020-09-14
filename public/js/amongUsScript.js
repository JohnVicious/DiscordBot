var localCheck = (window.location.href).includes('localhost');
var localSlash = "";
if(localCheck)
{
	localSlash = "/";
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

$('.userMic-btn').on('click', function(){
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
				console.log('Unmute all');
				return;
			}
			throw new Error('Request failed.');
		})
		.catch(function(error) {
			console.log(error);
		});
});

setInterval(
	function(){
		checkForUserUpdate();
	},5000);

function checkForUserUpdate()
{
	var command = 'listUsers';	
	var fetchUrl = localSlash + 'AmongUs/' + command;

	fetch(fetchUrl, {method: 'GET'})
		.then(res => res.json())
		.then((json) => {
			
			$("#userList").empty();
			
			for (let userData of json) {
				$('#userList').append('<div class="userPanel"><div class="userIcon"><i class="fas fa-user fa-3x"></i></div><div class="userInfo"><span>'+ userData.username+'</span></div>		<div class="userActions"><button class="btn ' + (userData.muted ? 'btn-danger' : 'btn-success') + ' userMic-btn" data-id="' + userData.id + '" data-muted="' + userData.muted + '"><i class="userMic-active ' + (userData.muted ? 'hidden' : '') + ' fas fa-microphone"></i><i class="userMic-inactive ' + (userData.muted ? '' : 'hidden') + ' fas fa-microphone-slash"></i></button></div></div>');
			}
			
		})
		.catch(function(error) {
			console.log(error);
		});
}
