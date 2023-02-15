import { ReactNode } from 'react';

/**
 * Generate wrapper for no transrations
 */
export function NoTrans({ children }: { children: ReactNode }) {
  return (
    <>{children}</>
  );
}
