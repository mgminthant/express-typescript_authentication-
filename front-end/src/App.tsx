import "./App.css";
import SignUp from "./auth/SignUp";
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Toaster />
        <SignUp />
      </div>
    </div>
  );
}

export default App;
