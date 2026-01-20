import { useCallback, useEffect, useRef } from 'react';

const DRAFT_ID_KEY = 'grupo_rugido_draft_id';
const DEBOUNCE_DELAY = 1000;

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getDraftId(): string {
  let draftId = localStorage.getItem(DRAFT_ID_KEY);
  if (!draftId) {
    draftId = generateUUID();
    localStorage.setItem(DRAFT_ID_KEY, draftId);
  }
  return draftId;
}

interface FormData {
  role: string;
  name: string;
  email: string;
  phone: string;
  bottleneck: string;
  revenue: string;
  teamSize: string;
  segment: string;
  urgency: string;
  hasPartner: string;
  socialMedia: string;
}

interface AutoSavePayload {
  draftId: string;
  email: string | null;
  phone: string | null;
  currentStep: number;
  answers: FormData;
  status: 'draft' | 'finalizado';
}

async function savePartialLead(payload: AutoSavePayload): Promise<boolean> {
  try {
    const response = await fetch('/api/partial-lead/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

function hasAnyData(formData: FormData): boolean {
  return !!(
    formData.role ||
    formData.name ||
    formData.email ||
    formData.phone ||
    formData.bottleneck ||
    formData.revenue ||
    formData.teamSize ||
    formData.segment ||
    formData.urgency ||
    formData.hasPartner ||
    formData.socialMedia
  );
}

export function useAutoSave(formData: FormData, currentStep: number) {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');
  const draftIdRef = useRef<string>(getDraftId());
  const formDataRef = useRef<FormData>(formData);
  const currentStepRef = useRef<number>(currentStep);

  // Keep refs in sync with latest values
  useEffect(() => {
    formDataRef.current = formData;
    currentStepRef.current = currentStep;
  }, [formData, currentStep]);

  const saveData = useCallback((status: 'draft' | 'finalizado' = 'draft') => {
    // Only save if there's actual data (unless finalizing)
    if (status === 'draft' && !hasAnyData(formData)) {
      return;
    }

    const payload: AutoSavePayload = {
      draftId: draftIdRef.current,
      email: formData.email || null,
      phone: formData.phone || null,
      currentStep,
      answers: formData,
      status,
    };

    const payloadString = JSON.stringify(payload);
    
    if (payloadString === lastSavedRef.current && status === 'draft') {
      return;
    }

    lastSavedRef.current = payloadString;
    savePartialLead(payload);
  }, [formData, currentStep]);

  const debouncedSave = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      saveData('draft');
    }, DEBOUNCE_DELAY);
  }, [saveData]);

  useEffect(() => {
    debouncedSave();
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [formData, currentStep, debouncedSave]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Use refs to get the latest values when the user leaves
      const currentFormData = formDataRef.current;
      const step = currentStepRef.current;
      
      // Only save if there's actual data
      if (!hasAnyData(currentFormData)) {
        return;
      }

      const payload: AutoSavePayload = {
        draftId: draftIdRef.current,
        email: currentFormData.email || null,
        phone: currentFormData.phone || null,
        currentStep: step,
        answers: currentFormData,
        status: 'draft',
      };

      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/partial-lead/save', blob);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const markAsFinalized = useCallback(() => {
    saveData('finalizado');
    localStorage.removeItem(DRAFT_ID_KEY);
  }, [saveData]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_ID_KEY);
    draftIdRef.current = generateUUID();
    localStorage.setItem(DRAFT_ID_KEY, draftIdRef.current);
  }, []);

  return {
    draftId: draftIdRef.current,
    markAsFinalized,
    clearDraft,
  };
}
