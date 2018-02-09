//sendmail to authenticate via mail
function sendmail(){
	var txtScreenName = document.getElementById("txtScreenName").value;
	var txtMailId = document.getElementById("txtMailId").value;


	if( txtScreenName === ''){
		alert("Please provide a screen name");
	}else if (txtMailId === ''){
		alert("Please provide mail address");
	}else{
		// Send POST Request here
		fetch('signup', {
		    method: 'post',
		    headers: {'Content-Type': 'application/json'},
		    body: JSON.stringify({
		      'name': txtScreenName,
		      'mail': txtMailId,
		    })
		}).then(res => {
			window.location = "/";
		})
	}
}

//go to log in screen
function gotologinscreen(){
	window.location = "/signup";
}

//sign out
function signout(){
	window.location = "/signout";
}

// go to Create Author Screen
function createAuthor(username){
	if(username === ''){
		alert('Please sign up to create new Author')
	}else{
		window.location = "/authors?type=Create";
	}
}

function addAuthor(){
	var txtAuthorName = document.getElementById("txtAuthorName").value;
	var txtAuthorDesc = document.getElementById("txtAuthorDesc").value;

	if( txtAuthorName === ''){
		alert("Please provide Author Name");
	}else if (txtAuthorDesc === ''){
		alert("Please provide Author Description");
	}else{
		// Send POST Request here
		fetch('authors', {
		    method: 'post',
		    headers: {'Content-Type': 'application/json'},
		    body: JSON.stringify({
		      'name': txtAuthorName,
		      'desc': txtAuthorDesc
		    })
		}).then(res => {
			window.location = "/";
		})

	}
}

// go to View Author Screen
function readAuthor(id){
    window.location = "/authors?type=Read&_id="+id;
}


// go to update Author Screen
function updateAuthor(id){
    window.location = "/authors?type=Update&_id="+id;
}

// Edit Author details
function editAuthor(){
	var txtAuthorName = document.getElementById("txtAuthorName").value;
	var txtAuthorDesc = document.getElementById("txtAuthorDesc").value;
	var txtAuthorId = document.getElementById("txtAuthorId").value;


	if( txtAuthorName === ''){
		alert("Please provide Author Name");
	}else if (txtAuthorDesc === ''){
		alert("Please provide Author Description");
	}else{
		// Send PUT Request here
		fetch('authors', {
		    method: 'put',
		    headers: {'Content-Type': 'application/json'},
		    body: JSON.stringify({
			  '_id': txtAuthorId,
		      'name': txtAuthorName,
		      'desc': txtAuthorDesc
		    })
		}).then(res => {
			window.location = "/";
		})

	}
}

//delete Author
function deleteAuthor(id){
    fetch('authors', {
	    method: 'delete',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify({
	      '_id': id
	    })
	  })
	  .then(res => {
	    if (res.ok) return res.json()
	  }).
	  then(data => {
	    console.log(data)
	    window.location.reload()
  })
}

//go back to main screen cancel button
function listAuthor(){
    window.location = "/";
}

//=========================================================================
//================Books Functionalities Starts here========================
//=========================================================================

// go to Create Author Screen
function createBook(auth_id, auth_name, username){
	if(username === ''){
		alert('Please sign up to create new Book')
	}else{
		window.location = "/books?type=Create&auth_id=" + auth_id +"&auth_name="+auth_name;
	}

}

// Add book to the given Author
function addBook(){
	var txtBookName = document.getElementById("txtBookName").value;
	var txtBookDesc = document.getElementById("txtBookDesc").value;
	var txtAuthorName = document.getElementById("txtAuthorName").value;
	var txtAuthorId = document.getElementById("txtAuthorId").value;



	if( txtBookName === ''){
		alert("Please provide Author Name");
	}else if (txtBookDesc === ''){
		alert("Please provide Author Description");
	}else{
		// Send POST Request here
		fetch('books', {
		    method: 'post',
		    headers: {'Content-Type': 'application/json'},
		    body: JSON.stringify({
		      'name': txtBookName,
		      'desc': txtBookDesc,
		      'author_name':txtAuthorName,
		      'author_id':txtAuthorId
		    })
		}).then(res => {
			window.location = "/authors?type=Read&_id=" + txtAuthorId;
		})

	}
}

//go back to main screen cancel button
function listBook(){
	var txtAuthorId = document.getElementById("txtAuthorId").value;
    window.location = "/authors?type=Read&_id=" + txtAuthorId;
}

//delete Book
function deleteBook(id){
    fetch('books', {
	    method: 'delete',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify({
	      '_id': id
	    })
	  })
	  .then(res => {
	    if (res.ok) return res.json()
	  }).
	  then(data => {
	    console.log(data)
	    window.location.reload()
  })
}

// go to View Book Screen
function readBook(id){
	var txtAuthorName = document.getElementById("txtAuthorName").value;
	var txtAuthorId = document.getElementById("txtAuthorId").value;
    window.location = "/books?type=Read&auth_id="+txtAuthorId+"&auth_name="+txtAuthorName+"&_id="+id;
}

// go to update Book Screen
function updateBook(id){
    var txtAuthorName = document.getElementById("txtAuthorName").value;
	var txtAuthorId = document.getElementById("txtAuthorId").value;
    window.location = "/books?type=Update&auth_id="+txtAuthorId+"&auth_name="+txtAuthorName+"&_id="+id;
}

//Edit book function
function editBook(){
	var txtBookName = document.getElementById("txtBookName").value;
	var txtBookDesc = document.getElementById("txtBookDesc").value;
	var txtAuthorName = document.getElementById("txtAuthorName").value;
	var txtAuthorId = document.getElementById("txtAuthorId").value;
	var txtBookId = document.getElementById("txtBookId").value;

	if( txtBookName === ''){
		alert("Please provide a name for the book");
	}else if (txtBookDesc === ''){
		alert("Please provide a description of the book");
	}else{
		// Send PUT Request here
		fetch('books', {
		    method: 'put',
		    headers: {'Content-Type': 'application/json'},
		    body: JSON.stringify({
			  '_id': txtBookId,
		      'name': txtBookName,
		      'desc': txtBookDesc,
		      'author_name': txtAuthorName,
			  'author_id':txtAuthorId
		    })
		}).then(res => {
			window.location = "/authors?type=Read&_id=" + txtAuthorId;
		})

	}
}


//===================================================================================================
//==============================comments Functions Starts here ======================================
//===================================================================================================

// Add comment to the given Book
function addComment(username){
	var txtBookId = document.getElementById("txtBookId").value;
	var txtComment = document.getElementById("txtComment").value;
	var txtAuthorName = document.getElementById("txtAuthorName").value;
	var txtAuthorId = document.getElementById("txtAuthorId").value;

	if( txtComment === ''){
		alert("Please provide a comment to add");
	} else if(username === ''){
		alert("Please signup to add comment to this book");
	}else{
		// Send POST Request here
		fetch('comments', {
		    method: 'post',
		    headers: {'Content-Type': 'application/json'},
		    body: JSON.stringify({
				'book': txtBookId,
				'comment': txtComment,
		      	'author': txtAuthorId,
		      	'author_name': txtAuthorName
		    })
		}).then(res => {
    		window.location.reload()
		})

	}
}

//delete Comment
function deleteComment(id){
    fetch('comments', {
	    method: 'delete',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify({
	      '_id': id
	    })
	  })
	  .then(res => {
	    if (res.ok) return res.json()
	  }).
	  then(data => {
	    console.log(data)
	    window.location.reload()
  })
}


