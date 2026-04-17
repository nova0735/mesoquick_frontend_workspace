import { Users } from 'lucide-react';
import type { ContactEntry } from '../../../entities/contact-entry';
import { ContactCard } from './ContactCard';

interface DirectoryListProps {
  contacts: readonly ContactEntry[];
}

/**
 * Grid de tarjetas de contacto del directorio interno.
 * Incluye empty state cuando el filtro no devuelve resultados.
 */
export function DirectoryList({ contacts }: DirectoryListProps) {
  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
        <Users className="w-10 h-10 mb-3 text-gray-300" />
        <p className="text-sm font-semibold">No se encontraron contactos</p>
        <p className="text-xs mt-1">
          Prueba con otro término o cambia el filtro de departamento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
}
