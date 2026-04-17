import { Mail, Phone, Calendar, Store, IdCard } from 'lucide-react';
import {
  SUPPORT_USER_TYPE_LABEL,
  SUPPORT_USER_STATUS_LABEL,
  type SupportUser,
} from '../../../entities/support-user';

interface UserProfileCardProps {
  user: SupportUser;
}

/**
 * Bloque de datos de perfil del usuario consultado.
 * Muestra contacto, ID, fecha de registro y estado. Para empresas incluye
 * el nombre comercial.
 */
export function UserProfileCard({ user }: UserProfileCardProps) {
  const registered = new Date(user.registeredAt).toLocaleDateString('es-HN', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
      <h2 className="text-sm font-bold text-primary uppercase tracking-wider">
        Datos de perfil
      </h2>

      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <InfoRow icon={IdCard} label="ID" value={user.id} mono />
        <InfoRow
          icon={IdCard}
          label="Tipo"
          value={SUPPORT_USER_TYPE_LABEL[user.type]}
        />
        <InfoRow icon={Mail} label="Correo" value={user.email} />
        <InfoRow icon={Phone} label="Teléfono" value={user.phone} />
        <InfoRow icon={Calendar} label="Miembro desde" value={registered} />
        <InfoRow
          icon={IdCard}
          label="Estado"
          value={SUPPORT_USER_STATUS_LABEL[user.status]}
        />
        {user.businessName && (
          <InfoRow
            icon={Store}
            label="Negocio"
            value={user.businessName}
          />
        )}
      </dl>
    </div>
  );
}

interface InfoRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}

function InfoRow({ icon: Icon, label, value, mono }: InfoRowProps) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
      <div className="min-w-0">
        <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
          {label}
        </dt>
        <dd
          className={`text-sm text-gray-900 truncate ${
            mono ? 'font-mono text-xs' : ''
          }`}
        >
          {value}
        </dd>
      </div>
    </div>
  );
}
