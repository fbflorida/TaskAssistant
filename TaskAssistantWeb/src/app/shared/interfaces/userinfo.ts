export interface UserInfo {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
}

export type UserLogin = Omit<UserInfo, "id" | "firstName" | "lastName">
export type RegisterInfo = Omit<UserInfo, "id">