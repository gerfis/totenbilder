import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <form
                    action={async () => {
                        'use server';
                        await signOut();
                    }}
                >
                    <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 text-black">
                        <div className="hidden md:block">Sign Out</div>
                    </button>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <p className="text-lg mb-4">Welcome, {session.user.name}!</p>
                <p className="text-gray-600 dark:text-gray-300">
                    This is the protected admin area. You can manage images and users here (feature coming soon).
                </p>
            </div>
        </div>
    );
}
