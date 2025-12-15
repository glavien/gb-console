import apiClient from "../apiClient";

import type { UserInfo } from "#/entity";

export interface SignInReq {
	login: string;
	password: string;
}

export interface SignUpReq extends SignInReq {
	email: string;
}

export interface SignInRes {
	id: string;
	token: string;
	role: string;
	isCreated: boolean;
}

export enum UserApi {
	SignIn = "/users", 
	SignUp = "/auth/signup",
	Logout = "/auth/logout",
	Refresh = "/auth/refresh",
	User = "/users", 
}

const signin = (data: SignInReq) => apiClient.post<SignInRes>({ url: UserApi.SignIn, data });
const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: UserApi.SignUp, data });
const logout = () => apiClient.get({ url: UserApi.Logout });
const findById = (id: string) => apiClient.get<UserInfo>({ url: `${UserApi.User}/${id}` });

export default {
	signin,
	signup,
	findById,
	logout,
};