import Header from '~/components/Layout/components/Header';
import Footer from '../components/Footer';
import '../../GlobalStyles/GlobalStyles.css';

function DefaultLayout({ children }) {
    return (
        <div className=" bg-white min-h-[100vh] h-full flex-col pt-[5.75rem] duong">
            <Header />
            <div>
                <div>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
