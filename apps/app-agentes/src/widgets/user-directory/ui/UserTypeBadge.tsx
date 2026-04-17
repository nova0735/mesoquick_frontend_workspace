import {
  SUPPORT_USER_TYPE_LABEL,
  type SupportUserType,
} from '../../../entities/support-user';

interface UserTypeBadgeProps {
  type: SupportUserType;
}

const TYPE_COLOR: Record<SupportUserType, string> = {
  CLIENT: 'bg-accent/20 text-primary',
  COURIER: 'bg-green-base/15 text-green-base',
  BUSINESS: 'bg-primary/10 text-primary',
};

/**
 * Badge pequeño con el tipo de usuario. Usado en tarjetas del listado y
 * en el header de detalle.
 */
export function UserTypeBadge({ type }: UserTypeBadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${TYPE_COLOR[type]}`}
    >
      {SUPPORT_USER_TYPE_LABEL[type]}
    </span>
  );
}
