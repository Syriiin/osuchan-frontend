import axios from "axios";
import Cookies from "js-cookie";

const http = axios.create({
    headers: {
        "X-CSRFToken": Cookies.get("csrftoken")
    }
});

export default http;