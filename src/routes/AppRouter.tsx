import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '../components/shared/Layout/Layout';
import { ErrorBoundary } from '../components/shared/ErrorBoundary/ErrorBoundary';
import { LoadingSpinner } from '../components/shared/LoadingSpinner/LoadingSpinner';

// Lazy load route components
const PokemonList = lazy(() =>
  import('../components/pokemon/PokemonList/PokemonList').then(module => ({
    default: module.PokemonList,
  }))
);

const PokemonDetail = lazy(() =>
  import('../components/pokemon/PokemonDetail/PokemonDetail').then(module => ({
    default: module.PokemonDetail,
  }))
);

// Route-level loading component
const RouteLoadingFallback = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '50vh',
    }}
  >
    <LoadingSpinner message='Loading page...' size='large' />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <PokemonList />
          </Suspense>
        ),
      },
      {
        path: 'pokemon/:id',
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <PokemonDetail />
          </Suspense>
        ),
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
