import AuthForms from "./components/AuthForms";
import ProductList from "./components/products/ProductList";
import { Button } from "./components/ui/button";
import { useAuth } from "./store/authContext";

function App() {
    const { user, logout } = useAuth();

    return (
        <div>
            {!user ? (
                <AuthForms />
            ) : (
                <div>
                    <div className="flex justify-between items-center p-4 border-b">
                        <h1 className="text-2xl font-bold">
                            Disc Golf Marketplace - Seller Dashboard
                        </h1>
                        <Button onClick={() => logout()}>Logout</Button>
                    </div>
                    <ProductList />
                </div>
            )}
        </div>
    );
}

export default App;
