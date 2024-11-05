import CompanySelection from "@/components/founder/CompanySelection";
import { SelectionAppBar } from "@/components/founder/SelectionAppBar";
import { userHandler } from "@/lib/userHandler";
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';


export default async function Page() {
    const session = await getServerSession(userHandler);  

    if (!session || !session.user) {
        console.log('moved to home');
        redirect('/');
    }

    return (
        <div>
            <SelectionAppBar />
            <CompanySelection />
        </div>
    );
}
