export interface User {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
}

export interface Message {
    message: string;
    to: string;
    from: string;
    self?: boolean;
    timestamp: string;
}