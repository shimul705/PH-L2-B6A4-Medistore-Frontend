
import { Footer } from "@/src/components/shared/footer";
import Navbar from "@/src/components/shared/navbar";

const CommonLayout = ({ children }: { children: React.ReactNode; }) => {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}


export default CommonLayout;