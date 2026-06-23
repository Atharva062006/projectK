
import { createUser, findUserByEmail } from "../repositories/userRepository.js";

// Register user
export const registerUserService = async ({user_name, email, password}) => {
    
    if (await findUserByEmail(email)) {
        throw new Error("Email already in use");
    }

    // TODO : Assigning a JWT token

    const user = await createUser(name, email, password);
    return user;
}

export const loginUserService = async ({email, password}) => {
    // TODO
}