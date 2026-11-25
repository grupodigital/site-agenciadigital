// Constantes do canal de denúncia compartilhadas entre a Server Action
// (actions.ts) e o formulário (ComplianceContent). Ficam fora de actions.ts
// porque um arquivo 'use server' só pode exportar funções assíncronas.

/** Limites de tamanho — validados no servidor e aplicados via maxLength. */
export const LIMITES = { descricao: 10_000, nome: 120, email: 254 } as const;

/** Campo isca (honeypot): invisível para pessoas, preenchido por bots. */
export const HONEYPOT_FIELD = 'website';
