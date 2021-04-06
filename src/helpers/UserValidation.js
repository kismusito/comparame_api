import User from "../Models/User";

export const checkEmail = async (email) => {
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
        return true;
    }

    return false;
};

export const checkUsername = async (username) => {
    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
        return true;
    }

    return false;
};