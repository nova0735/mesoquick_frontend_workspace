import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { LoginPage } from '../../pages/login/LoginPage';
import { InboxPage } from '../../pages/inbox/InboxPage';
import { FaqsPage } from '../../pages/faqs';
import { DirectoryPage } from '../../pages/directory';
import { UsersSearchPage, UserDetailPage } from '../../pages/users';
import { NotFoundPage } from '../../pages/not-found/NotFoundPage';
import { ProtectedRoute } from './ProtectedRoute';

/**
 * Árbol de rutas de app-agentes.
 *
 * - /login → pública, formulario mock (se eliminará cuando shell-login esté listo).
 * - Todo lo demás → protegido por <ProtectedRoute /> + envuelto en <MainLayout />.
 *
 * El orden de las subrutas protegidas irá creciendo en cada fase:
 *   Fase 2: /faqs
 *   Fase 3: /directory
 *   Fase 4: /users/:tipo/:id
 *   Fase 5: modales disparados desde /inbox y /users
 *   Fase 6: /chats/:chatId  (activo)
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

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
