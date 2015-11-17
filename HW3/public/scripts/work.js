document.getElementById('day').onchange = function() {
  changeSubmitButton();
}

document.getElementById('hour').onchange = function() {
  changeSubmitButton();
}

var changeSubmitButton = function() {
	var dayOption = document.getElementById('day').selectedIndex;
	var hourOption = document.getElementById('hour').selectedIndex;
	var submitButton = document.getElementById('submit');
	if (dayOption != 0 && hourOption != 0) {
		submitButton.disabled = false;
	} else {
		submitButton.disabled = true;
	}
}