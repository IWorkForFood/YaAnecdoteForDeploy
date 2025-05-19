import '../css/CategoryTitle.css'

export default function CategoryTitle({children, style}){
    return(
        <h2 className="category-title" style={style}>{children}</h2>
    )
}