// go to Create Author Screen
function addAuthor(){
    window.location = "/authors";
}

// go to Create Author Screen
function readAuthor(name){
    window.location = "/authors?name="+name;
}

//go back to main screen
function listAuthor(){
    window.location = "/";
}

var update = document.getElementById('update')

update.addEventListener('click', function () {
  // Send PUT Request here
  fetch('quotes', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'name': 'Appan',
      'quote': 'May God bless you too.'
    })
}).then(res => {
  if (res.ok) return res.json()
}).then(data => {
  console.log(data)
  window.location.reload(true)
})
})


var del = document.getElementById('delete')

del.addEventListener('click', function () {
  fetch('quotes', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'name': 'Darth Vader'
    })
  })
  .then(res => {
    if (res.ok) return res.json()
  }).
  then(data => {
    console.log(data)
    window.location.reload()
  })
})
