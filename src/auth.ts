import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
    uid: number;
    name: string;
    pass: string;
    mail: string;
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const { username, password } = credentials ?? {};
                if (!username || !password) return null;

                try {
                    // Adjust query to select necessary fields
                    const users = await query(
                        'SELECT uid, name, pass, mail FROM users WHERE name = ? OR mail = ? LIMIT 1',
                        [username, username]
                    ) as User[];

                    if (users.length === 0) return null;

                    const user = users[0];

                    // Verify password using bcrypt
                    // Note: This assumes the password in DB is a bcrypt hash. 
                    // If it's a legacy Drupal hash, this will fail until the password is reset.
                    const passwordsMatch = await bcrypt.compare(password as string, user.pass);

                    if (passwordsMatch) {
                        return {
                            id: user.uid.toString(),
                            name: user.name,
                            email: user.mail,
                        };
                    }
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }

                return null;
            },
        }),
    ],
});
