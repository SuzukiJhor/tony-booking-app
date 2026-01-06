interface ConfirmationParams {
    nome: string;
    profissional: string;
    data: string;
    hora: string;
    link: string;
}

export const getConfirmationMessage = ({
    nome,
    profissional,
    data,
    hora,
    link
}: ConfirmationParams) => {
    const infoPersonal = nome ? `*${nome}*` : "paciente";
    const infoProfissional = profissional ? ` com o(a) *${profissional}*` : "";

    return `
Olá, ${infoPersonal}! 👋

Você tem uma consulta${infoProfissional} agendada para hoje (${data}) às *${hora}h*.

✅ *Por favor, confirme sua presença clicando no link abaixo:*
${link}

📍 *Nosso endereço:*
Rua Cristóvão Colombo, nº 1433, Centro - Alto Paraná.

Muito obrigado(a)! 😊`.trim();
};