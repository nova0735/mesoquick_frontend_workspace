import { Mail, Phone } from 'lucide-react';
import {
  DEPARTMENT_LABEL,
  type ContactEntry,
} from '../../../entities/contact-entry';

interface ContactCardProps {
  contact: ContactEntry;
}

/**
 * Tarjeta individual de un contacto del directorio.
 * Muestra nombre, rol, departamento, disponibilidad, teléfono y correo.
 */
export function ContactCard({ contact }: ContactCardProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      {/* Avatar placeholder con iniciales */}
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-primary">
          {getInitials(contact.name)}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-semibold text-primary truncate">
            {contact.name}
          </h3>
          <span
            className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
              contact.available ? 'bg-green-base' : 'bg-gray-300'
            }`}
            title={contact.available ? 'Disponible' : 'No disponible'}
          />
        </div>

        <p className="text-xs text-gray-600 truncate">{contact.role}</p>

        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-accent/15 text-primary">
          {DEPARTMENT_LABEL[contact.department]}
        </span>

        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate">{contact.email}</span>
          </a>

          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{contact.phone}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.split(' ');
  const first = parts[0]?.[0] ?? '';
  const last = parts[parts.length - 1]?.[0] ?? '';
  return (first + last).toUpperCase();
}
