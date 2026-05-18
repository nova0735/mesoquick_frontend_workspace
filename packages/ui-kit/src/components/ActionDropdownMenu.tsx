import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { MoreVertical } from 'lucide-react';

export interface ActionDropdownMenuProps {
  orderId: string;
}

export const ActionDropdownMenu: React.FC<ActionDropdownMenuProps> = ({ orderId: _orderId }) => {
  const actions = [
    'Asistente Virtual',
    'Hablar con representante',
    'Solicitar cancelación',
    'Postular aumento de tarifa',
  ];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 shadow-sm border border-gray-200 transition-colors">
          <MoreVertical size={20} />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
          <div className="px-1 py-1">
            {actions.map((action, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-green-base text-white' : 'text-primary'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                  >
                    {action}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
