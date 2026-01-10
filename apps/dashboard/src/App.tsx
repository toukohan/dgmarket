import AuthForms from "./components/AuthForms";
import ProductList from "./components/products/ProductList";
import { Button } from "./components/ui/button";
import { useAuth } from "./store/authContext";

function App() {
    const { user, logout, initializing } = useAuth();
    if (initializing) {
        return <div className="p-4 text-sm text-muted-foreground">Checking session…</div>;
    }
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
                        <div className="flex items-center gap-4">
                            <a
                                href={import.meta.env.VITE_PUBLIC_APP_URL}
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                View marketplace
                            </a>

                            <Button onClick={logout}>Logout</Button>
                        </div>
                    </div>
                    <ProductList key={user?.id ?? "logged-out"} />
                </div>
            )}
        </div>
    );
}

export default App;
