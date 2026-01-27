'use client';

import { ReactNode, Fragment } from 'react';

interface AuthenticatedContentProps {
  children: ReactNode;
}

/**
 * Componente que renderiza su contenido siempre.
 * Se mantiene el nombre por compatibilidad pero ya no hay gatekeeping.
 */
export default function AuthenticatedContent({ children }: AuthenticatedContentProps) {
  return <Fragment>{children}</Fragment>;
}
