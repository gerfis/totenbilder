import LoginForm from './login-form';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center md:h-screen bg-gray-100 dark:bg-gray-900">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex w-full items-end justify-between bg-blue-600 p-3 md:h-14 rounded-lg">
                    <Link href="/" className="text-white text-xl font-bold">
                        Totenbilder
                    </Link>
                </div>
                <LoginForm />
            </div>
        </main>
    );
}
