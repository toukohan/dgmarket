import AuthForms from "./components/AuthForms"
import { Button } from "./components/ui/button"
import { useAuth } from "./store/authContext"
import DiscList from "./components/DiscList"

function App() {
const { user, loading, logout } = useAuth()

  
  return (
      <div>
        {!user ? (
          <AuthForms />
        ) : (
          <div>
            <div className="flex justify-between items-center p-4 border-b">
              <h1 className="text-2xl font-bold">Disc Golf Marketplace - Seller Dashboard</h1>
              <Button onClick={() => logout()}>Logout</Button>
            </div>
            <DiscList />
          </div>
        )}
      </div>
  )
}

export default App
