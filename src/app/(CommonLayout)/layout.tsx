import { Navbar } from "@/src/components/shared/navbar";

const CommonLayout = ({ children }: { children: React.ReactNode; }) => {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
}


export default CommonLayout;