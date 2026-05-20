import React from 'react';
import { ProfileEditForm } from '../../features/manage-profile';
import { UpdatePasswordForm } from '../../features/update-password';
import { BankAccountForm } from '../../features/manage-bank-account';

export const ProfilePage: React.FC = () => {
  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">My Profile</h1>
        <p className="text-primary/70 mt-2">
          Manage your personal information, security settings, and banking details.
        </p>
      </header>

      <section className="bg-white shadow-md rounded-lg p-6 mb-6">
        <ProfileEditForm/>
      </section>

      <section className="bg-white shadow-md rounded-lg p-6 mb-6">
        <UpdatePasswordForm/>
      </section>

      <section className="bg-white shadow-md rounded-lg p-6 mb-6">
        <BankAccountForm/>
      </section>
    </div>
  );
};
