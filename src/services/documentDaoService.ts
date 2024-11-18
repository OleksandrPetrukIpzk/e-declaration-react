import axios from "axios";
import {BASE_URL} from "../constants/urls";


const getDocument = async () =>{
    const file = await axios.get(`${BASE_URL}/document`, { responseType: 'blob' }).then((response) => response.data);
    return file;
}

export const DocumentDaoService = {
    getDocument,
}