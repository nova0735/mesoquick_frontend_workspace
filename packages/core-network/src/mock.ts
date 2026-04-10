export const mockApiClient = {
  get: async <T>(url: string): Promise<{ data: T | null }> => {
    console.log(`[MOCK GET] ${url}`);
    return { data: null };
  },
  post: async <T>(url: string, body: any): Promise<{ data: T | null }> => {
    console.log(`[MOCK POST] ${url}`, body);
    return { data: null };
  }
};