var localCheck = (window.location.href).includes('localhost');
var localSlash = "";
if(localCheck)
{
	localSlash = "/";
}

document.getElementById('joinChannel').addEventListener('click', function(e) {
	var fetchUrl = localSlash + 'AmongUs/joinChannel';
	
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
	var fetchUrl = localSlash + 'AmongUs/leaveChannel';
	
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
	var fetchUrl = localSlash + 'AmongUs/muteAll';
	
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
	var fetchUrl = localSlash + 'AmongUs/unmuteAll';
	
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
	var fetchUrl = localSlash + 'AmongUs/listUsers';

	fetch(fetchUrl, {method: 'GET'})
		.then(res => res.json())
		.then((json) => {
			console.log('List users');
			
			$('#userList').removeClass('hidden');
			
			for (let userData of json) {
				$('#userList > tbody:last-child').append('<tr><td>',userData.username,'</td></tr>');
			}
			
		})
		.catch(function(error) {
			console.log(error);
		});
});