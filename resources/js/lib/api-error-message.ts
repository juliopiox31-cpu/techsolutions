import type { AxiosError } from 'axios';

type LaravelErrorBody = {
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
};

export function apiErrorMessage(error: unknown, fallback: string): string {
    if (typeof error !== 'object' || error === null || !('response' in error)) {
        return fallback;
    }

    const res = (error as AxiosError<LaravelErrorBody>).response;
    if (!res) {
        return fallback;
    }

    const d = res.data;
    if (d?.message && typeof d.message === 'string') {
        return d.message;
    }
    if (d?.error && typeof d.error === 'string') {
        return d.error;
    }
    if (d?.errors && typeof d.errors === 'object') {
        const first = Object.values(d.errors).flat()[0];
        if (typeof first === 'string') {
            return first;
        }
    }

    if (res.status === 419) {
        return 'Sesión expirada o token de seguridad inválido. Recarga la página e inténtalo de nuevo.';
    }
    if (res.status === 403) {
        return 'No tienes permiso para realizar esta acción.';
    }
    if (res.status === 404) {
        return 'El recurso no existe o fue eliminado.';
    }
    if (res.status === 422) {
        return 'Los datos enviados no son válidos. Revisa el formulario.';
    }

    return fallback;
}
