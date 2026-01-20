import { useCallback, useEffect, useRef } from 'react';

const DRAFT_ID_KEY = 'grupo_rugido_draft_id';

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
    console.error('[AutoSave] Error saving:', error);
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
  const draftIdRef = useRef<string>(getDraftId());
  const lastSavedStepRef = useRef<number>(0);
  const isSavingRef = useRef<boolean>(false);

  const saveNow = useCallback(async (status: 'draft' | 'finalizado' = 'draft') => {
    if (isSavingRef.current) return;
    
    if (status === 'draft' && !hasAnyData(formData)) {
      return;
    }

    isSavingRef.current = true;

    const payload: AutoSavePayload = {
      draftId: draftIdRef.current,
      email: formData.email || null,
      phone: formData.phone || null,
      currentStep,
      answers: formData,
      status,
    };

    console.log('[AutoSave] Saving now:', { step: currentStep, status, role: formData.role, name: formData.name });
    
    await savePartialLead(payload);
    lastSavedStepRef.current = currentStep;
    isSavingRef.current = false;
  }, [formData, currentStep]);

  // Save immediately when step increases (user answered a question and moved forward)
  useEffect(() => {
    if (currentStep > lastSavedStepRef.current && hasAnyData(formData)) {
      console.log('[AutoSave] Step increased, saving immediately');
      saveNow('draft');
    }
  }, [currentStep, formData, saveNow]);

  const markAsFinalized = useCallback(() => {
    saveNow('finalizado');
    localStorage.removeItem(DRAFT_ID_KEY);
  }, [saveNow]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_ID_KEY);
    draftIdRef.current = generateUUID();
    localStorage.setItem(DRAFT_ID_KEY, draftIdRef.current);
  }, []);

  return {
    draftId: draftIdRef.current,
    markAsFinalized,
    clearDraft,
    saveNow,
  };
}
