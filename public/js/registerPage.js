$(document).ready(function(){
	 	
	$('#password, #confirm_password').on('keyup', function () {
		if ($('#password').val() == $('#confirm_password').val()) {
			$('#message').html('Matching').css('color', 'green');
		} else 
			$('#message').html('Not Matching').css('color', 'red');
	});

});

function validateRegister(evt)
{
	evt.preventDefault(); 
	
	//Confirm all fields are entered and that password is confirmed
	var username = $('#username').val();
	var email = $('#email').val();
	var password = $('#password').val();
	var confirmPass = $('#confirm_password').val();
	
	if(username != '' && email != '' && password != '' && password == confirmPass){
		$('#registerForm').attr('onsubmit', null);
		$('#registerForm').submit();
	}else{
		//alert user what is missing
		$('#missing_message').removeClass('hidden');
		$('#missing_message').html('• Please fill in the entire form');
	}
}