console.log("Hi forks...");
console.log("Hope you are doing great!");
console.log("If you have issue, You can contact us...");
console.log("or mail us at  -   ecell@iiitm.ac.in");
console.log("...");
console.log("");

function myFunction() {
	var text = "ecell@iiitm.ac.in";
navigator.clipboard.writeText(text).then(function() {
  console.log('Async: Copying to clipboard was successful!');
}, function(err) {
  console.error('Async: Could not copy text: ', err);
});
    alert(text+" is copied on clipboard");
}


function validateEmail(emailField){
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

            if (reg.test(emailField) == false) 
            {
                alert('Invalid Email Address');
                return false;
            }

            return true;

}

function postToGoogle() {
    var field1 = $("#emailField1").val();

    
    if(!validateEmail(field1)){
        return false;
    }
    

    $.ajax({
        url: "https://docs.google.com/forms/d/e/1FAIpQLSdB7nXLSjzeTLmaqTJkdZR1QXILXqci4KGwzzXH-0n8fLdKyA/formResponse?",
		data: { "entry.1015921823": field1},
        type: "POST",
        dataType: "xml",
        success: function(d)
		{
		},
		error: function(x, y, z)
			{

				$('#success-msg').show();
				$('#form').hide();
				
			}
    });
    $("#emailField1").val("");
    alert("Thank YOU FOR SUBSCRIBING!!")
	return false;
}

function postToGoogleMessage() {
    var field1 = $("#nameField").val();
    var field2 = $("#emailField").val();
    var field3 = $("#messageField").val();

    if(!validateEmail(field2)){
        return false;
    }
    

    $.ajax({
        url: "https://docs.google.com/forms/d/e/1FAIpQLScqJplgq8owuso4vImmSejOtbUO8_TuLX04I_tiyyPYZbELYg/formResponse?",
		data: { "entry.1657746657": field1, "entry.2062751322": field2, "entry.1089479515": field3},
        type: "POST",
        dataType: "xml",
        success: function(d)
		{
		},
		error: function(x, y, z)
			{

				$('#success-msg').show();
				$('#form').hide();
				
			}
    });
    $("#nameField").val("");
    $("#emailField").val("");
    $("#messageField").val("");

    alert("Message Send!!");
	return false;
}
