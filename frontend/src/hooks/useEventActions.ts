import { useState } from "react";
import { api } from "../api/axios";

export const useEventActions = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinEvent = async (eventId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post(`/events/${eventId}/join`);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error joining event";
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const leaveEvent = async (eventId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post(`/events/${eventId}/leave`);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error leaving event";
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/events/${eventId}`);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to delete event";
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    joinEvent,
    leaveEvent,
    deleteEvent,
    loading,
    error,
  };
};
