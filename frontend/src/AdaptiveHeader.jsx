
import '../css/AdaptiveHeader.css'

export default function AdaptiveHeader(){
    return(
        <div class="adaptive-header p-2 d-flex d-md-none">
        <a href="#" class=""
        data-bs-toggle="offcanvas"
        data-bs-target=".navbar">
            <i class="fa-solid fa-bars"></i>
        </a>
        </div>
    )
}