import { ApiResponse } from "../../shared/types/apiResponse";
import { UserRepository } from "../repositories/userRepository";

export class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository){
        this.userRepository = userRepository
    };

    async authenticateUser(username: string, password: string): Promise<ApiResponse>{
        return {status: true, descricao: ''}
    };

    async createAccessTokenForUser(user: any): Promise<string>{
        return '3443423'
    };

    async create(): Promise<ApiResponse>{
      return {status: true, descricao: ''}
    };

    async getOrCreateUserByGoogle(userInfo: any): Promise<string> {
        return ''
    };

}

const userRepository = new UserRepository();

export const userService = new UserService(userRepository);