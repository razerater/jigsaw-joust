var parentRef = new Firebase("https://glaring-heat-7005.firebaseio.com/");
var childRef = parentRef.child("joust-players-times");
var startNotClicked = true;

function logScore() {
	childRef.child("puzzle" + currentPuzzleNum).push({
		name: parentRef.getAuth().google.cachedUserProfile.given_name,
		time: seconds,
		clockTime: document.getElementById("start").textContent
	});
}

function clearLeaderboard() {
	Array.from(document.getElementsByTagName("li")).forEach(function(elem) {
		elem.textContent = "";
	});
}

function updateLeaderboard() {
	childRef.child("puzzle" + currentPuzzleNum).child("triggerOnFunction").set(Math.random());
}

document.getElementById("login").addEventListener("click", function() {
	parentRef.authWithOAuthPopup("google", function(error, authData) {
		if(error) {
			console.log("Login failed.", error);
		}
	});
});

document.getElementById("start").addEventListener("click", function() {
	if(startNotClicked) {
		if(parentRef.getAuth()) {
			startNotClicked = false;
			makePuzzle();
			startTimer();
		}
		else {
			alert("You must login first!");
		}
	}
});

document.getElementById("playanother").addEventListener("click", function() {
	getNextPuzzle();
	clearLeaderboard();
	updateLeaderboard();
	startTimer();
});

for(let i = 0; i < puzzles.length; i++) {
	childRef.child("puzzle" + i).orderByChild("time").limitToFirst(6).on("value", function(snapshot) {
		let counter = -1;
		clearLeaderboard();
		snapshot.forEach(function(data) {
			data.forEach(function(childData) {
				if(childData.key() == "clockTime") {
					document.getElementById("score" + counter).textContent += childData.val();
				}
				else if(childData.key() == "name") {
					document.getElementById("score" + counter).textContent = childData.val() + ": " + 
					document.getElementById("score" + counter).textContent;
				}
			});
			counter++;
		});
	});
}

// window.onload = updateLeaderboard();
