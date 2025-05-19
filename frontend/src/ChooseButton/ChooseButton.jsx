import './ChooseButton.css'

const CollectionSlide = ({ children, isActive, onClick }) => {
    return(
        <button className={ isActive ? "choose-button chosen" : "choose-button"}
        onClick={ onClick }
        >
            {children}
        </button>
    )
}

export default CollectionSlide;