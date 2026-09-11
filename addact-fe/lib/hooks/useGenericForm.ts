"use client";

import { useState, useCallback } from "react";
import { fetchStrapiRest, mutateStrapi } from "@/lib/api/client";

export interface UseGenericFormConfig<TValues extends Record<string, unknown>, TResponse = unknown> {
  initialValues: TValues;
  endpoint?: string;
  mutation?: string;
  validate?: (values: TValues) => Partial<Record<keyof TValues, string>> | null;
  transformSubmitData?: (values: TValues) => Record<string, unknown>;
  onSuccess?: (data: TResponse) => void;
  onError?: (errorMessage: string) => void;
  resetOnSuccess?: boolean;
}

export interface UseGenericFormReturn<TValues extends Record<string, unknown>, TResponse = unknown> {
  values: TValues;
  errors: Partial<Record<keyof TValues, string>>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | null;
  turnstileToken: string | null;
  setValue: <K extends keyof TValues>(key: K, value: TValues[K]) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  setTurnstileToken: (token: string | null) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<TResponse | null>;
  reset: () => void;
}

/**
 * Universal Generic Form Submission Hook
 * 
 * Handles local state, field change events, client validation,
 * Cloudflare Turnstile tokens, loading states, and direct submission
 * to Strapi REST or GraphQL endpoints.
 */
export function useGenericForm<
  TValues extends Record<string, unknown>,
  TResponse = unknown
>({
  initialValues,
  endpoint,
  mutation,
  validate,
  transformSubmitData,
  onSuccess,
  onError,
  resetOnSuccess = true,
}: UseGenericFormConfig<TValues, TResponse>): UseGenericFormReturn<TValues, TResponse> {
  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof TValues, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const setValue = useCallback(<K extends keyof TValues>(key: K, value: TValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      setValue(name as keyof TValues, (type === "checkbox" ? checked : value) as unknown as TValues[keyof TValues]);
    },
    [setValue]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setErrorMessage(null);
    setTurnstileToken(null);
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent): Promise<TResponse | null> => {
      if (e) {
        e.preventDefault();
      }

      setIsError(false);
      setErrorMessage(null);

      // 1. Validation
      if (validate) {
        const validationErrors = validate(values);
        if (validationErrors && Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return null;
        }
      }

      setIsLoading(true);

      const payloadData = transformSubmitData ? transformSubmitData(values) : values;
      const finalPayload = {
        ...payloadData,
        ...(turnstileToken ? { turnstileToken } : {}),
      };

      try {
        // Option A: GraphQL Mutation
        if (mutation) {
          const result = await mutateStrapi<TResponse>(mutation, { input: finalPayload });
          if (!result.ok) {
            throw new Error(result.error.message);
          }
          setIsSuccess(true);
          onSuccess?.(result.data);
          if (resetOnSuccess) reset();
          return result.data;
        }

        // Option B: REST Endpoint
        if (endpoint) {
          const result = await fetchStrapiRest<TResponse>(endpoint, {
            method: "POST",
            body: { data: finalPayload },
          });

          if (!result.ok) {
            throw new Error(result.error.message);
          }

          setIsSuccess(true);
          onSuccess?.(result.data);
          if (resetOnSuccess) reset();
          return result.data;
        }

        throw new Error("No endpoint or mutation provided to useGenericForm");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to submit form";
        setIsError(true);
        setErrorMessage(msg);
        onError?.(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [
      values,
      validate,
      transformSubmitData,
      turnstileToken,
      mutation,
      endpoint,
      onSuccess,
      onError,
      resetOnSuccess,
      reset,
    ]
  );

  return {
    values,
    errors,
    isLoading,
    isSuccess,
    isError,
    errorMessage,
    turnstileToken,
    setValue,
    handleChange,
    setTurnstileToken,
    handleSubmit,
    reset,
  };
}

export default useGenericForm;
