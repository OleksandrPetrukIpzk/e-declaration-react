import api from "../constants/axiosInterceptor";


const getDocument = async () =>{
    const file = await api.get(`/document`, { responseType: 'blob' }).then((response) => response.data);
    return file;
}

export const DocumentDaoService = {
    getDocument,
}