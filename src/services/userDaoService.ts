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
    const user = await api.post(`/user/login`, userData).then((response) => response.data);
    return user;
};

const getUsersCount = async () => {
  const usersCount = await api.get(`/user/count`).then((response) => response.data);
  return usersCount;
};

const getUserInfo = async () => {
    const userInfo = await api.get(`/user/me`).then((response) => response.data);
    return userInfo;
}
const connectUsers = async (userId: number) => {
    const usersConnectMessage = await api.post(`/user/connect-users`, {otherUserId: userId}).then((response) => response.data)
    return usersConnectMessage;
}

const getAllAdminList = async () => {
    const adminList = await api.get(`/user/admin-list`).then((response) => response.data);
    return adminList;
}

const getAllProviderList = async () => {
    const providerList = await api.get(`/user/provider-list`).then((response) => response.data);
    return providerList;
}

const getActiveProviderList = async () => {
    const providerList = await api.get(`/user/provider-active-list`).then((response) => response.data);
    return providerList;
}

const getActiveAdminList = async () => {
    const adminList = await api.get(`/user/admin-active-list`).then((response) => response.data);
    return adminList;
}


export const UserDaoService = {
    createUser,
    loginUser,
    getUsersCount,
    getUserInfo,
    connectUsers,
    getAllAdminList,
    getAllProviderList,
    getActiveProviderList,
    getActiveAdminList
}