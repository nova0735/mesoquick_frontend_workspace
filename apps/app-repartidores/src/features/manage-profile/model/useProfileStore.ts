import { create } from 'zustand';
import { CourierProfileResponse, UpdateProfileRequest } from '../../../entities/courier/model/types';
import { fetchProfileDetails, updateProfileDetails } from '../api/profile.api';

interface ProfileState {
  profileData: CourierProfileResponse | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (payload: UpdateProfileRequest) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profileData: null,
  isLoading: false,
  isUpdating: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchProfileDetails();
      set({ profileData: data, isLoading: false });
    } catch (error: unknown) {
      set({ error: 'Failed to load profile data.', isLoading: false });
    }
  },

  updateProfile: async (payload: UpdateProfileRequest) => {
    set({ isUpdating: true, error: null });
    try {
      await updateProfileDetails(payload);
      // Optimistic UI update
      set((state) => ({
        profileData: state.profileData ? { ...state.profileData, ...payload } : null,
        isUpdating: false
      }));
    } catch (error: unknown) {
      set({ error: 'Failed to update profile.', isUpdating: false });
      throw error;
    }
  }
}));
