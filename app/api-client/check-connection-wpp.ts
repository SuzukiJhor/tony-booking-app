export async function checkConnectionWppService(companyId: number) {
    const response = await fetch('/api/whatsapp/check-connection', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyId }),
    });
    if (!response.ok) throw new Error("Erro ao verificar conexão com o WhatsApp");
    return response.json();
}
