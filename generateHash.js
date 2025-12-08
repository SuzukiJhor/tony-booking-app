import { hash as _hash } from 'bcryptjs';

const password = 'tony123'; // Ex: 'senha12345'
const saltRounds = 10; // Custo do hash (pode ser 10 ou 12)

async function generateHash() {
    try {
        const hash = await _hash(password, saltRounds);
        console.log(`Senha a ser hasheada: ${password}`);
        console.log(`Hash gerado (cole isso no DB):`);
        console.log(hash);
    } catch (error) {
        console.error('Erro ao gerar hash:', error);
    }
}

generateHash();