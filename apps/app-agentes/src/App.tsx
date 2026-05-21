import { AppRouter } from './app/router/AppRouter';
import { SessionProvider } from './app/providers/SessionProvider';

function App() {
  return (
    <SessionProvider>
      <AppRouter />
    </SessionProvider>
  );
}

export default App;
