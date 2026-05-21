/**
 * 🛣️ Cambios al archivo: src/app/router/AppRouter.tsx
 *
 * Solo agregar:
 *   1. Un import de LoginPage
 *   2. Una <Route> nueva dentro del bloque AuthLayout (donde ya vive REGISTER)
 *
 * Las líneas marcadas con ➕ son nuevas. NO se quita ni se modifica nada.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './routes';

// Pages
import HomePage from '@pages/HomePage';
import CatalogPage from '@pages/CatalogPage';
import BusinessDetailPage from '@pages/BusinessDetailPage';
import CartPage from '@pages/CartPage';
import CheckoutPage from '@pages/CheckoutPage';
import OrderConfirmationPage from '@pages/OrderConfirmationPage';
import OrdersPage from '@pages/OrdersPage';
import OrderTrackingPage from '@pages/OrderTrackingPage';
import RegisterPage from '@pages/RegisterPage';
import LoginPage from '@pages/LoginPage';      // ➕ NUEVO
import ProfilePage from '@pages/ProfilePage';
import EditProfilePage from '@pages/EditProfilePage';
import SupportPage from '@pages/SupportPage';
import ChatbotPage from '@pages/ChatbotPage';
import AgentChatPage from '@pages/AgentChatPage';
import NotFoundPage from '@pages/NotFoundPage';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import CheckoutLayout from '../layouts/CheckoutLayout';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas con layout principal (header + footer) */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
          <Route path={ROUTES.BUSINESS_DETAIL} element={<BusinessDetailPage />} />
          <Route path={ROUTES.CART} element={<CartPage />} />
          <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
          <Route path={ROUTES.ORDER_TRACKING} element={<OrderTrackingPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.PROFILE_EDIT} element={<EditProfilePage />} />
          <Route path={ROUTES.SUPPORT} element={<SupportPage />} />
          <Route path={ROUTES.CHATBOT} element={<ChatbotPage />} />
          <Route path={ROUTES.AGENT_CHAT} element={<AgentChatPage />} />
        </Route>

        {/* Rutas con layout de autenticación (sin header completo) */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />   {/* ➕ NUEVO */}
        </Route>

        {/* Rutas con layout de checkout (simplificado, sin distracciones) */}
        <Route element={<CheckoutLayout />}>
          <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
          <Route
            path={ROUTES.ORDER_CONFIRMATION}
            element={<OrderConfirmationPage />}
          />
        </Route>

        {/* 404 */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}