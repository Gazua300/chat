// const url = 'https://super-form-server.vercel.app'
const url = 'http://localhost:3003'

const getUsers = ()=>{
    fetch(`${url}/users`).then(res => res.json()).then(data=>{
        document.querySelector('.popup-content').innerHTML = data.map(user=>{
            return `
                <div key=${user.id} class='card'>
                    ${user.name}
                    <div style='margin-left:10px;'>Status</div>
                </div>
            `
        }).join('')
    }).catch(e=>{
        alert(e.message)
    })
}

getUsers()