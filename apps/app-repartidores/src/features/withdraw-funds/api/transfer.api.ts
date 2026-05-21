export interface TransferResponse {
  success: boolean;
  message: string;
}

/**
 * Simulación de transferencia de fondos al banco para el MVP.
 * @param amount Cantidad a transferir
 */
export const transferFundsToBank = async (amount: number): Promise<TransferResponse> => {
  console.log(`Iniciando transferencia simulada de: ${amount}`);
  
  // Simulación de delay de red/procesamiento bancario
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    success: true,
    message: "Transferencia exitosa"
  };
};
