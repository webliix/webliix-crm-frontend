import { AppRouter } from "@/app/router/AppRouter";
import { useAuthBootstrap } from "@/modules/auth/hooks/useAuthBootstrap";

function App() {
  useAuthBootstrap();

  return <AppRouter />;
}

export default App;
