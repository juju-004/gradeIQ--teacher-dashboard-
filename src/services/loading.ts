type Listener = (loading: boolean) => void;

class LoadingService {
  private loading = false;
  private listeners = new Set<Listener>();

  show() {
    this.set(true);
  }

  hide() {
    this.set(false);
  }

  toggle() {
    this.set(!this.loading);
  }

  private set(value: boolean) {
    this.loading = value;
    this.listeners.forEach((listener) => listener(this.loading));
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.loading);

    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const loadingService = new LoadingService();
