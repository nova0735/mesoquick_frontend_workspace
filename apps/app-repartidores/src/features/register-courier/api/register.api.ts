import { AuthAPI } from '@mesoquick/core-network';

// Recibe un JSON (payload) y lo pasa al Broker
export const submitCourierRegistration = async (payload: any) => { 
  return await AuthAPI.register(payload);
};