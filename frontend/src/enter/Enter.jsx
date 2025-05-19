export default function Enter(){
    return(
    <div className = "reg-enter-block">
    <h3>Вход</h3>
    <p>Добро пожаловать! Мы рады видеть вас снова!</p>
    <form className = "reg-enter-form">   
        <input name='username' ></input>
        <input name='password'></input>
        <span >Забыли свой пароль</span>
        <button type='submit'></button>
    </form>
    </div>
    )
}