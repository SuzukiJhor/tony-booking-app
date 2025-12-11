export const formatPhone = (value: string) => {
    // Remove tudo que não é número
    let digits = value.replace(/\D/g, "");

    // Limita a 11 dígitos (celular + DDD)
    if (digits.length > 11) digits = digits.slice(0, 11);

    // Aplica máscara
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};