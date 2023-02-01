import ErrorMessage from "../errorMessage/ErrorMessage";
import { Link } from "react-router-dom";
import '../../style/style.scss';

const Page404 = () => {
    return(
        <div>
            <ErrorMessage/>
            <p className="error_title">Page doesn't exist</p>
            <Link className="error_link" to="/" >Back to main page</Link>
        </div>
    );
}

export default Page404;