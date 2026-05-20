import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { InboxPage } from '../../pages/inbox/InboxPage';
import { FaqsPage } from '../../pages/faqs';
import { DirectoryPage } from '../../pages/directory';
import { UsersSearchPage, UserDetailPage } from '../../pages/users';
import { NotFoundPage } from '../../pages/not-found/NotFoundPage';
import { ProtectedRoute } from './ProtectedRoute';

/**
 * Árbol de rutas de app-agentes.
 *
 * El login vive en @mesoquick/shell-login (otro origen). app-agentes solo
 * tiene rutas protegidas: si no hay sesión válida, ProtectedRoute redirige
 * al shell-login.
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to="/inbox" replace />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/faqs" element={<FaqsPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/users" element={<UsersSearchPage />} />
            <Route path="/users/:tipo/:id" element={<UserDetailPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
