class SocketManager {
  private static instance: SocketManager;
  private connections: Record<string, WebSocket> = {};

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public connect(path: string): void {
    if (this.connections[path]) {
      return;
    }

    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('access_token') || '';
    }
    
    const isSecure = window.location.protocol === 'https:';
    const wsProtocol = isSecure ? 'wss://' : 'ws://';
    
    // Fallback inteligente: Usar la variable de entorno del Gateway o inferir del host actual
    const gatewayUrl = import.meta.env?.VITE_API_GATEWAY_URL;
    let baseHost = window.location.host;
    
    if (gatewayUrl) {
      baseHost = gatewayUrl.replace(/^https?:\/\//, '');
    }

    const url = `${wsProtocol}${baseHost}${path}?token=${token}`;

    const ws = new WebSocket(url);
    this.connections[path] = ws;

    ws.onclose = () => {
      setTimeout(() => {
        delete this.connections[path];
        this.connect(path);
      }, 3000);
    };
  }

  public disconnect(path: string): void {
    const ws = this.connections[path];
    if (ws) {
      ws.close();
      delete this.connections[path];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public emit(path: string, payload: any): void {
    const ws = this.connections[path];
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public subscribe(path: string, callback: (data: any) => void): void {
    const ws = this.connections[path];
    if (ws) {
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          callback(data);
        } catch {
          callback(event.data);
        }
      };
    }
  }
}

export { SocketManager };
