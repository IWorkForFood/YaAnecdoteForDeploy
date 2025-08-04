import { useLocation, useNavigate } from "react-router-dom";

export const GoBackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();
  
    const handleGoBack = () => {
      const { fromPath } = location.state?.from;
      console.log("fromPath", fromPath);
  
      const isInternalNavigation =
        (window.history.state && window.history.state.idx > 0) ||
        (document.referrer && document.referrer.includes(window.location.origin));
  
      if (fromPath) {
        navigate(fromPath);
      } else if (isInternalNavigation) {
        navigate(-1);
      } else {
        navigate("/");
      }
    };
    return(
      <button
          className="btn d-none d-md-block btn-outline-secondary rounded-pill"
          onClick={handleGoBack}
      >
          Назад
      </button>
    )
}