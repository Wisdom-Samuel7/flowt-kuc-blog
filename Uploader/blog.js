const { log } = console
const postID = document.querySelectorAll(".id")


window.onload = () => {

  postID.forEach((post, i) => {

    const User = post.getAttribute("data-user")
    const postedBy = post.getAttribute("data-postedBy")


    if (User == postedBy) {
      post.style.display = "none"
    }

  })

}



postID.forEach((val, index) => {

  val.onclick = () => { GETattr(val) }
})



function GETattr(id) {
  const ids = id.getAttribute("data-id")
  const idsUser = id.getAttribute("data-user")
  const p = id.getAttribute("data-postedBy")
  // log(ids == idsUser)
  log(p == idsUser)

  FetchPostId(ids)

  setTimeout(() => {
    window.location.reload()
  },4000)
}

async function FetchPostId(ids) {

  await fetch('/api/user/follower', {
    method: 'POST',
    body: JSON.stringify({
      body: ids
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json()
  }).then(function (data) {
    console.log(data)
  })
    .catch(error => log(error))

  //   const data = await response.json()
  //   log(data)



  //    fetch(`http://localhost:3000/api/user/follower/${ids}`,{
  //      method : 'GET',
  //      headers: {
  //         // Accept: 'application.json',
  //         'Content-Type': 'application/json'
  //       },
  //     //   body: ids, 

  //    }).then(response => {
  //      console.log(response)
  //    })
  //    .then(data=>{
  //      console.log(data)
  //    })   
  //    .catch(error => {
  //     console.log(error)
  //    }) 

} 