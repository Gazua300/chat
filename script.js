const email = document.getElementById('email')
const password = document.getElementById('password')
// const url = 'https://super-form-server.vercel.app'
const url = 'http://localhost:3003'


window.addEventListener('load', ()=>{
    const user = localStorage.getItem('user')

    if(user){
        location.href = './pages/chat/index.html'
    }
})

document.getElementById('form').addEventListener('submit', (e)=>{
    e.preventDefault()

    const body = {
        email: email.value,
        password: password.value
    }
    fetch(`${url}/login`, {
        method:'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data=>{
        localStorage.setItem('user', JSON.stringify(data))
        location.href = './pages/chat/index.html'
    }).catch(e=>{
        alert(e.message)
    })
})