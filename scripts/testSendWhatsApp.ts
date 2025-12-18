
const AGENDAMENTO_ID = 'COLE_O_ID_DO_AGENDAMENTO_AQUI';
const API_URL = 'http://localhost:3000/api/whatsapp/send';
const INTERNAL_JOB_TOKEN = process.env.INTERNAL_JOB_TOKEN || 'uma_chave_secreta_grande';

async function testSend() {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${INTERNAL_JOB_TOKEN}`,
            },
            body: JSON.stringify({ agendamentoId: AGENDAMENTO_ID }),
        });

        const data = await response.json();
        console.log('Resposta da API:', data);
    } catch (err) {
        console.error('Erro ao chamar rota:', err);
    }
}

testSend();
