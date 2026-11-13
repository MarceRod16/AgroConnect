import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AgroConnectState } from '../data/demoSeed';
import { runSmartMatching } from '../services/matchingEngine';
import {
  loadAgroConnectState,
  resetAgroConnectStorage,
  saveAgroConnectState,
} from '../services/storageService';
import {
  ActiveRole,
  BuyerProfile,
  CommercialInterest,
  EventRegistration,
  MatchOpportunity,
  PublicationStatus,
  PurchaseRequest,
  SupplierProfile,
  SupplyOffer,
  UserAccount,
} from '../types/agroconnect';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  message: string;
}

interface AgroConnectContextValue {
  state: AgroConnectState;
  currentUser: UserAccount | null;
  currentBuyerProfile: BuyerProfile | null;
  currentSupplierProfile: SupplierProfile | null;
  activeRole: ActiveRole;
  allMatches: MatchOpportunity[];
  toast: ToastMessage | null;
  dismissToast: () => void;
  showToast: (message: string, type?: ToastMessage['type']) => void;
  // Auth & Role switching
  loginDemoAccount: (mode: 'buyer' | 'supplier' | 'both') => void;
  loginWithEmail: (email: string) => { ok: boolean; error?: string };
  logout: () => void;
  switchActiveRole: (role: ActiveRole) => void;
  // Onboarding & Profiles
  upsertUserAccount: (user: UserAccount) => void;
  upsertBuyerProfile: (profile: BuyerProfile) => void;
  upsertSupplierProfile: (profile: SupplierProfile) => void;
  // Requests CRUD
  createPurchaseRequest: (req: Omit<PurchaseRequest, 'id' | 'createdAt' | 'updatedAt'>) => PurchaseRequest;
  updatePurchaseRequest: (id: string, patch: Partial<PurchaseRequest>) => void;
  setPurchaseRequestStatus: (id: string, status: PublicationStatus) => void;
  // Offers CRUD
  createSupplyOffer: (offer: Omit<SupplyOffer, 'id' | 'createdAt' | 'updatedAt'>) => SupplyOffer;
  updateSupplyOffer: (id: string, patch: Partial<SupplyOffer>) => void;
  setSupplyOfferStatus: (id: string, status: PublicationStatus) => void;
  // Interests & Events
  registerCommercialInterest: (
    payload: Omit<CommercialInterest, 'id' | 'createdAt' | 'status'>
  ) => void;
  updateInterestStatus: (id: string, status: CommercialInterest['status']) => void;
  registerForEvent: (payload: Omit<EventRegistration, 'id' | 'registeredAt'>) => void;
  // Demo reset
  resetDemoData: () => void;
}

const AgroConnectContext = createContext<AgroConnectContextValue | null>(null);

export const AgroConnectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AgroConnectState>(() => loadAgroConnectState());
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    saveAgroConnectState(state);
  }, [state]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    setToast({ id: `${Date.now()}`, type, message });
  };

  const dismissToast = () => setToast(null);

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId]
  );

  const currentBuyerProfile = useMemo(() => {
    if (!currentUser) return null;
    return (
      state.buyers.find(
        (b) => b.id === currentUser.buyerProfileId || b.userId === currentUser.id
      ) ?? null
    );
  }, [currentUser, state.buyers]);

  const currentSupplierProfile = useMemo(() => {
    if (!currentUser) return null;
    return (
      state.suppliers.find(
        (s) => s.id === currentUser.supplierProfileId || s.userId === currentUser.id
      ) ?? null
    );
  }, [currentUser, state.suppliers]);

  const allMatches = useMemo(
    () => runSmartMatching(state.requests, state.offers, state.buyers, state.suppliers),
    [state.requests, state.offers, state.buyers, state.suppliers]
  );

  const loginDemoAccount = (mode: 'buyer' | 'supplier' | 'both') => {
    const targetId =
      mode === 'buyer'
        ? 'user_buyer_demo'
        : mode === 'supplier'
        ? 'user_supplier_demo'
        : 'user_dual_demo';
    const targetRole: ActiveRole = mode === 'supplier' ? 'supplier' : 'buyer';
    setState((prev) => ({
      ...prev,
      currentUserId: targetId,
      activeRole: targetRole,
    }));
    showToast(
      mode === 'both'
        ? 'Sesión iniciada en cuenta dual de demostración (Comprador + Proveedor).'
        : mode === 'buyer'
        ? 'Sesión iniciada como Comprador de demostración.'
        : 'Sesión iniciada como Proveedor de demostración.',
      'info'
    );
  };

  const loginWithEmail = (email: string): { ok: boolean; error?: string } => {
    const normalized = email.trim().toLowerCase();
    const found = state.users.find((u) => u.email.toLowerCase() === normalized);
    if (!found) {
      return {
        ok: false,
        error:
          'No encontramos una cuenta registrada con ese correo en este navegador. Crea una cuenta nueva o ingresa con los accesos rápidos de demostración.',
      };
    }
    const nextRole: ActiveRole =
      found.roleType === 'supplier' ? 'supplier' : 'buyer';
    setState((prev) => ({
      ...prev,
      currentUserId: found.id,
      activeRole: nextRole,
    }));
    showToast(`Bienvenido nuevamente, ${found.firstName}.`);
    return { ok: true };
  };

  const logout = () => {
    setState((prev) => ({
      ...prev,
      currentUserId: null,
    }));
  };

  const switchActiveRole = (role: ActiveRole) => {
    setState((prev) => ({
      ...prev,
      activeRole: role,
    }));
    showToast(
      role === 'buyer'
        ? 'Vista cambiada a perfil Comprador.'
        : 'Vista cambiada a perfil Proveedor.',
      'info'
    );
  };

  const upsertUserAccount = (user: UserAccount) => {
    setState((prev) => {
      const exists = prev.users.some((u) => u.id === user.id);
      const nextUsers = exists
        ? prev.users.map((u) => (u.id === user.id ? user : u))
        : [...prev.users, user];
      const nextActiveRole: ActiveRole =
        user.roleType === 'supplier'
          ? 'supplier'
          : user.roleType === 'buyer'
          ? 'buyer'
          : prev.activeRole;
      return {
        ...prev,
        currentUserId: user.id,
        activeRole: nextActiveRole,
        users: nextUsers,
      };
    });
  };

  const upsertBuyerProfile = (profile: BuyerProfile) => {
    setState((prev) => {
      const exists = prev.buyers.some((b) => b.id === profile.id);
      const nextBuyers = exists
        ? prev.buyers.map((b) => (b.id === profile.id ? profile : b))
        : [...prev.buyers, profile];
      const nextUsers = prev.users.map((u) =>
        u.id === profile.userId ? { ...u, buyerProfileId: profile.id } : u
      );
      return { ...prev, buyers: nextBuyers, users: nextUsers };
    });
  };

  const upsertSupplierProfile = (profile: SupplierProfile) => {
    setState((prev) => {
      const exists = prev.suppliers.some((s) => s.id === profile.id);
      const nextSuppliers = exists
        ? prev.suppliers.map((s) => (s.id === profile.id ? profile : s))
        : [...prev.suppliers, profile];
      const nextUsers = prev.users.map((u) =>
        u.id === profile.userId ? { ...u, supplierProfileId: profile.id } : u
      );
      return { ...prev, suppliers: nextSuppliers, users: nextUsers };
    });
  };

  const createPurchaseRequest = (
    req: Omit<PurchaseRequest, 'id' | 'createdAt' | 'updatedAt'>
  ): PurchaseRequest => {
    const now = new Date().toISOString();
    const created: PurchaseRequest = {
      ...req,
      id: `req_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setState((prev) => ({
      ...prev,
      requests: [created, ...prev.requests],
    }));
    showToast('Solicitud de compra publicada. El Smart Matching se actualizó automáticamente.');
    return created;
  };

  const updatePurchaseRequest = (id: string, patch: Partial<PurchaseRequest>) => {
    setState((prev) => ({
      ...prev,
      requests: prev.requests.map((r) =>
        r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r
      ),
    }));
    showToast('Solicitud de compra actualizada.');
  };

  const setPurchaseRequestStatus = (id: string, status: PublicationStatus) => {
    setState((prev) => ({
      ...prev,
      requests: prev.requests.map((r) =>
        r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
      ),
    }));
    const label =
      status === 'activa' ? 'reactivada' : status === 'pausada' ? 'pausada' : 'cerrada';
    showToast(`Solicitud ${label}.`);
  };

  const createSupplyOffer = (
    offer: Omit<SupplyOffer, 'id' | 'createdAt' | 'updatedAt'>
  ): SupplyOffer => {
    const now = new Date().toISOString();
    const created: SupplyOffer = {
      ...offer,
      id: `offer_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setState((prev) => ({
      ...prev,
      offers: [created, ...prev.offers],
    }));
    showToast('Oferta agrícola publicada. Disponible inmediatamente en Smart Matching.');
    return created;
  };

  const updateSupplyOffer = (id: string, patch: Partial<SupplyOffer>) => {
    setState((prev) => ({
      ...prev,
      offers: prev.offers.map((o) =>
        o.id === id ? { ...o, ...patch, updatedAt: new Date().toISOString() } : o
      ),
    }));
    showToast('Publicación de oferta actualizada.');
  };

  const setSupplyOfferStatus = (id: string, status: PublicationStatus) => {
    setState((prev) => ({
      ...prev,
      offers: prev.offers.map((o) =>
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
      ),
    }));
    const label =
      status === 'activa' ? 'reactivada' : status === 'pausada' ? 'pausada' : 'cerrada';
    showToast(`Oferta ${label}.`);
  };

  const registerCommercialInterest = (
    payload: Omit<CommercialInterest, 'id' | 'createdAt' | 'status'>
  ) => {
    const newInterest: CommercialInterest = {
      ...payload,
      id: `int_${Date.now()}`,
      status: 'pendiente',
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      interests: [newInterest, ...prev.interests],
    }));
    showToast(
      payload.initiatedByRole === 'buyer'
        ? 'Solicitud de contacto enviada (no confirma compra ni reserva inventario).'
        : 'Interés comercial manifestado al comprador.'
    );
  };

  const updateInterestStatus = (id: string, status: CommercialInterest['status']) => {
    setState((prev) => ({
      ...prev,
      interests: prev.interests.map((item) =>
        item.id === id ? { ...item, status } : item
      ),
    }));
    showToast('Estado de contacto actualizado.');
  };

  const registerForEvent = (payload: Omit<EventRegistration, 'id' | 'registeredAt'>) => {
    const exists = state.eventRegistrations.some(
      (r) => r.eventId === payload.eventId && r.userId === payload.userId
    );
    if (exists) {
      showToast('Ya cuentas con una inscripción confirmada para este evento.', 'info');
      return;
    }
    const created: EventRegistration = {
      ...payload,
      id: `evt_reg_${Date.now()}`,
      registeredAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      eventRegistrations: [created, ...prev.eventRegistrations],
    }));
    showToast('Inscripción confirmada al evento comercial.');
  };

  const resetDemoData = () => {
    const next = resetAgroConnectStorage();
    setState(next);
    showToast('Datos de demostración restaurados correctamente.', 'info');
  };

  return (
    <AgroConnectContext.Provider
      value={{
        state,
        currentUser,
        currentBuyerProfile,
        currentSupplierProfile,
        activeRole: state.activeRole,
        allMatches,
        toast,
        dismissToast,
        showToast,
        loginDemoAccount,
        loginWithEmail,
        logout,
        switchActiveRole,
        upsertUserAccount,
        upsertBuyerProfile,
        upsertSupplierProfile,
        createPurchaseRequest,
        updatePurchaseRequest,
        setPurchaseRequestStatus,
        createSupplyOffer,
        updateSupplyOffer,
        setSupplyOfferStatus,
        registerCommercialInterest,
        updateInterestStatus,
        registerForEvent,
        resetDemoData,
      }}
    >
      {children}
    </AgroConnectContext.Provider>
  );
};

export function useAgroConnect(): AgroConnectContextValue {
  const ctx = useContext(AgroConnectContext);
  if (!ctx) {
    throw new Error('useAgroConnect debe usarse dentro de AgroConnectProvider');
  }
  return ctx;
}
