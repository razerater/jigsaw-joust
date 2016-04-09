var firebase = new Firebase("https://glaring-heat-7005.firebaseio.com/");

document.getElementById("start").addEventListener("onclick", function(event) {
	firebase.authWithOAuthPopup("google", function(error, authData) {
		if(error) {
			// error is null if there is no error
			console.log("Login failed.", error);
		}
	});
});

firebase.onAuth(function(authData) {
	if(authData) {
		/*
		I want the following code to run when the user has logged in, which can only happen once 
		they've clicked the start button and entered their information in the Google login popup. 
		The popup is supposed to appear when authWithOAuthPopup() is called, but it's not and I'm 
		not sure why.
		The HTML onclick event that runs these two functions when the start button is pressed is 
		for testing purposes.
		*/
		makePuzzle();
		startTimer();
	}
	else {
		console.log("Authentication failed.");
	}
});