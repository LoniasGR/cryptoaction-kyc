import { Spinner } from "../ui/spinner";

export function LoadingPage() {
    return (
        <div className='flex justify-center items-center h-screen'><Spinner className="size-10" /></div>);
}