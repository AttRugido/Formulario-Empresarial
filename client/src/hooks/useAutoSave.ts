import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

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

export function useAutoSave(formData: FormData, currentStep: number, attribution?: any) {
  const draftIdRef = useRef<string>(getDraftId());
  const lastSavedStepRef = useRef<number>(0);
  const isSavingRef = useRef<boolean>(false);

  const saveToSupabase = useCallback(async (status: 'parcial' | 'completo' = 'parcial') => {
    if (isSavingRef.current) return;
    
    if (status === 'parcial' && !hasAnyData(formData)) {
      return;
    }

    isSavingRef.current = true;

    const upsertData = {
      draft_id: draftIdRef.current,
      name: formData.name || null,
      email: formData.email || null,
      phone: formData.phone || null,
      role: formData.role || null,
      bottleneck: formData.bottleneck || null,
      revenue: formData.revenue || null,
      team_size: formData.teamSize || null,
      segment: formData.segment || null,
      urgency: formData.urgency || null,
      has_partner: formData.hasPartner || null,
      social_media: formData.socialMedia || null,
      current_step: currentStep,
      status: status,
      utm_source: attribution?.utm_source || null,
      utm_medium: attribution?.utm_medium || null,
      utm_campaign: attribution?.utm_campaign || null,
      utm_content: attribution?.utm_content || null,
      utm_term: attribution?.utm_term || null,
      referrer: attribution?.referrer || null,
      first_page: attribution?.first_page || null,
      current_page: attribution?.current_page || null,
      device: attribution?.device || null,
    };

    console.log('[AutoSave] Saving to Supabase:', { step: currentStep, status, role: formData.role, name: formData.name });
    
    try {
      const { data, error } = await supabase
        .from('leads')
        .upsert(upsertData, { onConflict: 'draft_id' })
        .select();
      
      if (error) {
        console.error('[AutoSave] Supabase error:', error);
      } else {
        console.log('[AutoSave] Saved successfully:', data);
        lastSavedStepRef.current = currentStep;
      }
    } catch (err) {
      console.error('[AutoSave] Error:', err);
    }

    isSavingRef.current = false;
  }, [formData, currentStep, attribution]);

  // Save immediately when step increases (user answered a question and moved forward)
  useEffect(() => {
    if (currentStep > lastSavedStepRef.current && hasAnyData(formData)) {
      console.log('[AutoSave] Step increased, saving immediately');
      saveToSupabase('parcial');
    }
  }, [currentStep, formData, saveToSupabase]);

  const markAsFinalized = useCallback(() => {
    saveToSupabase('completo');
    localStorage.removeItem(DRAFT_ID_KEY);
  }, [saveToSupabase]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_ID_KEY);
    draftIdRef.current = generateUUID();
    localStorage.setItem(DRAFT_ID_KEY, draftIdRef.current);
  }, []);

  return {
    draftId: draftIdRef.current,
    markAsFinalized,
    clearDraft,
    saveNow: saveToSupabase,
  };
}
