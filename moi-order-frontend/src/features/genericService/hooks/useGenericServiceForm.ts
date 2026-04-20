import { useCallback, useState } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';

import { FieldSchemaItem } from '@/types/models';

export interface GenericServiceFormState {
  fields: Record<string, string>;
  files:  Record<string, ImagePickerAsset>;
  errors: Record<string, string>;
}

export interface UseGenericServiceFormResult {
  form:            GenericServiceFormState;
  handleChange:    (key: string, value: string) => void;
  handleFileChange:(key: string, asset: ImagePickerAsset) => void;
  validate:        (schema: FieldSchemaItem[]) => boolean;
  applyApiError:   (errors: Record<string, string[]>) => void;
  clearError:      (key: string) => void;
}

export function useGenericServiceForm(): UseGenericServiceFormResult {
  const [form, setForm] = useState<GenericServiceFormState>({
    fields: {},
    files:  {},
    errors: {},
  });

  const clearError = useCallback((key: string): void => {
    setForm((prev) => {
      if (!prev.errors[key]) return prev;
      const { [key]: _, ...rest } = prev.errors;
      return { ...prev, errors: rest };
    });
  }, []);

  const handleChange = useCallback((key: string, value: string): void => {
    clearError(key);
    setForm((prev) => ({ ...prev, fields: { ...prev.fields, [key]: value } }));
  }, [clearError]);

  const handleFileChange = useCallback((key: string, asset: ImagePickerAsset): void => {
    clearError(key);
    setForm((prev) => ({ ...prev, files: { ...prev.files, [key]: asset } }));
  }, [clearError]);

  const validate = useCallback((schema: FieldSchemaItem[]): boolean => {
    const errors: Record<string, string> = {};
    for (const field of schema) {
      if (!field.required) continue;
      if (field.type === 'file') {
        if (!form.files[field.key]) errors[field.key] = `${field.label_en} is required.`;
      } else if (field.type === 'boolean') {
        // boolean fields with a value (even 'false') are considered answered
        if (!form.fields[field.key]) errors[field.key] = `${field.label_en} is required.`;
      } else {
        if (!form.fields[field.key]?.trim()) errors[field.key] = `${field.label_en} is required.`;
      }
    }
    setForm((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }, [form]);

  const applyApiError = useCallback((apiErrors: Record<string, string[]>): void => {
    const errors: Record<string, string> = {};
    Object.entries(apiErrors).forEach(([key, messages]) => {
      const fieldKey = key.startsWith('fields.') ? key.slice(7) : key;
      errors[fieldKey] = messages[0] ?? '';
    });
    setForm((prev) => ({ ...prev, errors }));
  }, []);

  return { form, handleChange, handleFileChange, validate, applyApiError, clearError };
}
