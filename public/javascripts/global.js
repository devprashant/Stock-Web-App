// StockList data array for filling in info box
var stockListData = [];

var stockToUpdate = [];

// DOM Ready ============================================
$(document).ready(function(){

	// Populate the user table on initial page load
	PopulateTable();


		// Add Stock Button Click
		$("#btnAddStock").on("click", addStock);
	
});

// Functions ============================================

//  Fill table with data
function PopulateTable(){

	// Empty content String
	var tableContent = '';

	// jQuery AJAX call for JSON
	$.getJSON('/stocks/lstock', function(data){
		stockListData = data;

		// For each stock in our JSON,
		// add a table row and cells to the content string
		$.each(data,function(){
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowstock" rel="' + this.itemname + '">' + this.itemname + '</a></td>';
			tableContent += '<td>'+ this.quantity +'</td>';
			tableContent += '<td>'+ this.price +'</td>';
			tableContent += '<td>'+ this.createdon+'</td>';
			tableContent += '<td>'+ this.createdby+'</td>';
			tableContent += '<td>'+ this.modifiedon+'</td>';
			tableContent += '<td>'+ this.modifiedby+'</td>';
			tableContent += '<td><a href="#" class="linkdeletestock" rel="'+ this._id +'">Delete</a></td>';
			tableContent += '<td><a href="#" class="linkeditstock" rel="'+ this._id +'">Edit</a></td>';
			tableContent += '</tr>';
		});

		// Inject the whole content string into our existing HTML table
		$('#stockList table tbody').html(tableContent);

		// Adding onClick Listeners
		// Username link click
		$('#stockList table tbody').on("click", "td a.linkshowstock", showStockInfo);

		// Edit Stock
		$('#stockList table tbody').on('click', 'td a.linkeditstock', editStock);

	    // Delete User link click
		$('#stockList table tbody').on('click', 'td a.linkdeletestock', deleteStock);
	});
}

// Show Stock Info
function showStockInfo(event){

	// Prevent Link from Firing
	event.preventDefault();

	// Retrieve item name from link attribute
	var thisItemName = $(this).attr('rel');

	// Get Index of Object based on id value;
	var arrayPosition = stockListData.map(function(arrayItem){
		return arrayItem.itemname;
	}).indexOf(thisItemName);

	// Get our Stock Object
	var thisStockObject = stockListData[arrayPosition];

	// Populate Info BOx
	$('#stockInfoName').text(thisStockObject.itemname);
	$('#stockInfoModifiedOn').text(thisStockObject.modifiedon);
	$('#stockInfoModifiedBy').text(thisStockObject.modifiedby);
	$('#stockInfoCreatedOn').text(thisStockObject.createdon);
}

function addStock(event){

	// Prevent Link from Firing
	event.preventDefault();

	// Super basic validation - increase errorCount variable if any feilds are blank
	var errorCount = 0;
	$("#addStock input").each(function(index, val){
		if($(this).val() === "") { errorCount++; }
	});

	// Check and make sure error count is stil at zero
	if (errorCount === 0){

		// If it is, compile all user info into one object
		var newStock = {
			"itemname" : $("#addStock fieldset input#inputItemName").val()
			,"quantity" : $("#addStock fieldset input#inputQuantity").val()
			,"price" : $("#addStock fieldset input#inputPrice").val()
			,"modifiedon" : $("#addStock fieldset input#inputModifiedOn").val()
			,"modifiedby" : $("#addStock fieldset input#inputModifiedBy").val()
			,"createdon" : $("#addStock fieldset input#inputCreatedOn").val()
			,"createdby" : $("#addStock fieldset input#inputCreatedBy").val()
		};

		// Use AJAX to post new stock to our stock add service
		$.ajax({
			type : "POST"
			,data: newStock
			,url : "/stocks/cstock"
			,dataType : "JSON"
		}).done(function(response){

			// Check for successull blank message
			if (response.msg === ""){

				// Clear the form inputs
				$("#addStock fieldset input").val('');
			} else {
				// If something goes wrong, alert
				alert('Error:' + response.msg );
			}

			// Update Table
			PopulateTable();
		});
	} else {
		// Error count is more than zero, alert
		alert('Please fill in all fields');
		return false;
	}
}

function deleteStock(event){

	// Prevent default event
	event.preventDefault();

	// Pop up a confirmation box
	var confirmation = confirm('Are you sure you want to delete this user?');

	// Check and make sure the user confirmed
	if (confirmation === true){

		// If they did it, do our delete
		$.ajax({
			type : "DELETE"
			,url : "stocks/dstock/" + $(this).attr('rel')
		}).done(function(response){

			// Check for successful blank response
			if (response.msg === ''){

			}else {
				alert('Error: ' + response.msg);
			}

			// Update Table
			PopulateTable();
		});
	} else {

		// If they say no, do nothing
		return false;
	}
}

function editStock(event){

	// Prevent Link from Firing
	event.preventDefault();

	// Retrieve item idfrom link attribute
	var thisItemId = $(this).attr('rel');

	// Get Index of Object based on id value;
	var arrayPosition = stockListData.map(function(arrayItem){
		return arrayItem._id;
	}).indexOf(thisItemId);

	// Get our Stock Object
	var thisStockObject = stockListData[arrayPosition];
	stockToUpdate = thisStockObject;

	$("#addStock fieldset input#inputItemName").val(thisStockObject.itemname);
	$("#addStock fieldset input#inputQuantity").val(thisStockObject.quantity);
	$("#addStock fieldset input#inputPrice").val(thisStockObject.price);
	$("#addStock fieldset input#inputModifiedOn").val(thisStockObject.modifiedon);
	$("#addStock fieldset input#inputModifiedBy").val(thisStockObject.modifiedby);
	$("#addStock fieldset input#inputCreatedOn").val(thisStockObject.createdon);
	$("#addStock fieldset input#inputCreatedBy").val(thisStockObject.createdby);
	
	// Chanding text and behaviour of Add Stock button
	$("#btnAddStock").attr("id","btnUpdateStock").html("Update Stock");

	// Update Stock Button click
	$("#btnUpdateStock").unbind("click").on("click", updateStock);
}

function updateStock(){

	// Prevent Link from Firing
	event.preventDefault();

	// Super basic validation - increase errorCount variable if any feilds are blank
	var errorCount = 0;
	$("#addStock input").each(function(index, val){
		if($(this).val() === "") { errorCount++; }
	});

	// Check and make sure error count is stil at zero
	if (errorCount === 0){

		// If it is, compile all user info into one object
		var newStock = {
			"itemname" : $("#addStock fieldset input#inputItemName").val()
			,"quantity" : $("#addStock fieldset input#inputQuantity").val()
			,"price" : $("#addStock fieldset input#inputPrice").val()
			,"modifiedon" : $("#addStock fieldset input#inputModifiedOn").val()
			,"modifiedby" : $("#addStock fieldset input#inputModifiedBy").val()
			,"createdon" : $("#addStock fieldset input#inputCreatedOn").val()
			,"createdby" : $("#addStock fieldset input#inputCreatedBy").val()
		};

		// Use AJAX to post new stock to our stock add service
		$.ajax({
			type : "POST"
			,data: newStock
			,url : "/stocks/ustock/" + stockToUpdate._id
			,dataType : "JSON"
		}).done(function(response){

			// Check for successull blank message
			if (response.msg === ""){

				// Clear the form inputs
				$("#addStock fieldset input").val('');

				// Changing text and behaviour of Update Stock button
				$("#btnUpdateStock").attr("id","btnAddStock").html("Add Stock");

				// Update Stock Button click
				$("#btnAddStock").unbind("click").on("click", addStock);
			} else {
				// If something goes wrong, alert
				alert('Error:' + response.msg );
			}

			// Update Table
			PopulateTable();
		});
	} else {
		// Error count is more than zero, alert
		alert('Please fill in all fields');
		return false;
	}
}