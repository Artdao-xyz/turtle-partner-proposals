'use client';

import { useAuth } from '../contexts/AuthContext';
import { ReactNode, Fragment } from 'react';

interface AuthenticatedContentProps {
  children: ReactNode;
}

/**
 * Componente que renderiza su contenido solo si el usuario está autenticado.
 * Retorna null si el usuario no está autenticado.
 */
export default function AuthenticatedContent({ children }: AuthenticatedContentProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
}
