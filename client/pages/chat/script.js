const userList = document.querySelector('.user-list')


fetch('http://localhost:3003/users').then(res => res.json()).then(data=>{
    userList.innerHTML = data.map(user=>{
        return`            
            <p class='user'>
                <img src='https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp'>
                ${user.nickname}
            </p>
        `
    }).join('')
})



const logout = ()=>{
    const decide = window.confirm('Tem certeza que deseja sair do chat')
    const user = JSON.parse(localStorage.getItem('user'))
    
    if(decide){
        fetch(`http://localhost:3003/signout/${user.id}`, {
            method:'DELETE'
        }).then(res => res.text()).then(()=>{
            localStorage.clear()
            location.href = '../../index.html'
        }).catch(e=>{
            alert(e.message)
        })
    }

}