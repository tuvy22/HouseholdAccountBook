import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import Login from './login';

export default async function Home() {

    return (
        <div className="mt-4 mb-4">
            <Login/>
        </div>
    );
  }