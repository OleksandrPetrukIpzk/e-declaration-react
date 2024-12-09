import api from "../constants/axiosInterceptor";


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
    const user = await api.post(`/user/create`, userData).then((response) => console.log(response.data));
    return user;
}

const loginUser = async (userData: LoginUserData) => {
    const user = await api.post(`/user/login`, userData).then((response) => console.log(response.data));
    return user;
};

const getUsersCount = async () => {
  const usersCount = await api.get(`/user/count`).then((response) => response.data);
  return usersCount;
};

const getUserInfo = async (id: number) => {
    const user = await api.post(`/user/info`, { userId: id }) // Надсилаємо об'єкт з полем userId
        .then((response) => response.data)
        .catch((error) => error);
};

export const UserDaoService = {
    createUser,
    loginUser,
    getUsersCount,
    getUserInfo
}