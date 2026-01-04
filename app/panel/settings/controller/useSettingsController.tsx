'use client';

import toast from "react-hot-toast";
import { getMainPhone, setMainPhone } from "../actions";
import { formatPhone } from "@/util/mask/mask-phone-br";
import { useState, useEffect, useCallback } from "react";

export function useSettingsController() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handlePhoneChange = (value: string) => {
        setPhoneNumber(formatPhone(value));
    };

    const fetchSettings = useCallback(async () => {
        try {
            const { data } = await getMainPhone();
            if (data?.mainPhone) {
                setPhoneNumber(formatPhone(data.mainPhone));
                setIsEditing(false);
                return;
            }
            setIsEditing(true);
        } catch (error) {
            console.error("Failed to fetch settings:", error);
            toast.error("Erro ao carregar configurações.");
        }
    }, []);

    const handleSavePhone = async () => {
        setIsLoading(true);
        try {
            const { success, data } = await setMainPhone(phoneNumber.replace(/\D/g, ""));
            if (success === false) throw new Error("Erro ao salvar o telefone.");
            if (data?.telefone) toast.success(`Telefone atualizado para ${data.telefone}`);
            setIsEditing(false);
        } catch (error) {
            toast.error("Erro ao salvar o telefone.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const cancelEditing = () => {
        setIsEditing(false);
        fetchSettings();
    };

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return {
        phoneNumber,
        isLoading,
        isEditing,
        setIsEditing,
        handlePhoneChange,
        handleSavePhone,
        cancelEditing
    };
}