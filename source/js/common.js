$(document).ready(function() {

	function calculateTenderness (){
  	  var tenderPrice = 2,
  		  tenderQty = 6,
  		  investment = document.getElementById("investment").value;

  	  var totalTenders = (investment / tenderPrice) * tenderQty;

	  if (totalTenders > 150) {
		  $('#tenders').addClass('hidden');
		  $('#more-tenders').removeClass('hidden');
	  }

	  $('#tender-image-text span').text(totalTenders);
	  $('#tender-image').removeClass('hidden');
	  $('#calculate-form').addClass('hidden');


    }

	$("#calculate").on("click", function(event){
		event.preventDefault();
		 calculateTenderness();
	});

	$("#calculate-form").on("submit", function(event){
		event.preventDefault();
    	  calculateTenderness();
	});

	$("#back").on("click", function(event){
		$('#tender-image-text span').text("");
		$('#tender-image').addClass('hidden');
		$('#calculate-form').removeClass('hidden');

		$('#tenders').removeClass('hidden');
		$('#more-tenders').addClass('hidden');
	});

});
