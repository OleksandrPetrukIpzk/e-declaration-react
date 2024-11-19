import axios from "axios";
import {BASE_URL} from "../constants/urls";

type CreateUserData = {
    firstName: string;
    email: string;
    password: string;
    role: number;
}

type LoginUserData = {
    email: string;
    password: string;
}

const createUser = async (userData: CreateUserData) => {
    const user = await axios.post(`${BASE_URL}/user/create`, userData).then((response) => console.log(response.data));
    return user;
}

const loginUser = async (userData: LoginUserData) => {
    const user = await axios.post(`${BASE_URL}/user/login`, userData).then((response) => console.log(response.data));
    return user;
}

export const UserDaoService = {
    createUser,
    loginUser
}