import '../css/ProfileContainer.css'

export default function ProfileContainer({children, title}){
    return(
        <>
        
        <div className='profile-container'>
            <p className='prof-container-title'>{title}</p>
            {children}
        </div>
        </>
    )
}