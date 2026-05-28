export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const emailValidation = (email = '') =>
    // simple RFC-5322-ish check
    emailRegex.test(email);
export const usernameRegex = /^[a-zA-Z0-9](?!.*[._]{2})[a-zA-Z0-9._]{1,28}[a-zA-Z0-9]$/;
export const usernameValidation = (username = '') =>
    usernameRegex.test(username);
