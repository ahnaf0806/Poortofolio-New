import { WindowManagerProvider } from "@/lib/contexts/WindowManagerContext";
import { Desktop } from "@/components/desktop/Desktop";

function App() {
  return (
    <WindowManagerProvider>
      <Desktop />
    </WindowManagerProvider>
  );
}

export default App;
