import { Experience } from "./components/Experience";
import { Cursor } from "./components/Cursor";
import { CustomLoader } from "./components/ui/Loader";
import { Header } from "./components/ui/Header";
import { BasketballElement } from "./components/ui/BasketballElement";

function App() {
    return (
        <>
            <div className="noise-bg" />
            <CustomLoader />
            <Cursor />
            <BasketballElement />
            <Header />
            <Experience />
        </>
    );
}



export default App;
