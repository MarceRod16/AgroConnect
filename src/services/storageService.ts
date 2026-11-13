import { AgroConnectState, createInitialDemoState } from '../data/demoSeed';

const STORAGE_KEY = 'agroconnect_mvp_state_v1';
const CURRENT_SCHEMA_VERSION = 1;

export function loadAgroConnectState(): AgroConnectState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialDemoState();
      saveAgroConnectState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as AgroConnectState;
    if (!parsed || parsed.schemaVersion !== CURRENT_SCHEMA_VERSION || !Array.isArray(parsed.users)) {
      const initial = createInitialDemoState();
      saveAgroConnectState(initial);
      return initial;
    }
    return parsed;
  } catch {
    return createInitialDemoState();
  }
}

export function saveAgroConnectState(state: AgroConnectState): void {
  try {
    // Asegurar que nunca se serialice ningún campo de contraseña en localStorage
    const sanitizedState: AgroConnectState = {
      ...state,
      users: state.users.map((u) => {
        const clone = { ...u } as Record<string, unknown>;
        delete clone.password;
        delete clone.passwordHash;
        return clone as unknown as typeof u;
      }),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedState));
  } catch {
    // Silenciar errores de cuota en navegadores restringidos
  }
}

export function resetAgroConnectStorage(): AgroConnectState {
  const initial = createInitialDemoState();
  saveAgroConnectState(initial);
  return initial;
}
