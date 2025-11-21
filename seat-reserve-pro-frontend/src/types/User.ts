// seat-reserve-pro-frontend/src/types/User.ts

export interface User {
    _id: string;
    email: string;
    name: string;
    role: 'admin' | 'attendee';
    token: string;
}