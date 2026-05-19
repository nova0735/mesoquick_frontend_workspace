import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from './app/providers/ErrorBoundary';
import { appRouter } from './app/router'; 

export const App = () => {
  return (
    <ErrorBoundary>
      <RouterProvider router={appRouter}/>
    </ErrorBoundary>
  );
};

export default App;
