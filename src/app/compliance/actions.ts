'use server';

// Server Action do canal de denúncia. Recebe o FormData do formulário em
// ComplianceContent, valida do lado servidor e encaminha a manifestação por
// e-mail (SMTP via src/lib/mailer) ao Comitê de Ética. Retorna o estado para o
// useActionState do cliente exibir mensagens de erro/sucesso.

import { sendMail } from '@/lib/mailer';

// Rótulos legíveis para compor o e-mail. As chaves espelham os values das
// options em ComplianceContent.tsx.
const TIPOS_RELATO: Record<string, string> = {
  'agressao-fisica': 'Agressão física',
  'assedio-moral': 'Assédio moral',
  'assedio-sexual': 'Assédio sexual',
  'conflito-interesse': 'Conflito de interesse',
  corrupcao: 'Corrupção',
  'desvio-ativos': 'Desvio de ativos',
  discriminacao: 'Discriminação / Racismo / Preconceito',
  favorecimento: 'Favorecimento',
  fraudes: 'Fraudes',
  'roubo-furto': 'Roubo / Furto',
  vazamento: 'Vazamento de informações',
};

const RELACIONAMENTOS: Record<string, string> = {
  cliente: 'Cliente',
  colaborador: 'Colaborador',
  cooperador: 'Cooperador',
  fornecedor: 'Fornecedor',
  prestador: 'Prestador de Serviços',
};

const TIPOS_RELATO_VALIDOS = new Set(Object.keys(TIPOS_RELATO));
const RELACIONAMENTOS_VALIDOS = new Set(Object.keys(RELACIONAMENTOS));

export type DenunciaState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  errors?: Partial<
    Record<
      'tipoRelato' | 'relacionamento' | 'descricao' | 'ciencia' | 'nome' | 'email',
      string
    >
  >;
};

export async function enviarDenuncia(
  _prev: DenunciaState,
  formData: FormData,
): Promise<DenunciaState> {
  const tipoRelato = String(formData.get('tipoRelato') ?? '').trim();
  const relacionamento = String(formData.get('relacionamento') ?? '').trim();
  const descricao = String(formData.get('descricao') ?? '').trim();
  const ciencia = formData.get('ciencia');
  const identificar = formData.get('identificar');
  const nome = String(formData.get('nome') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();

  const errors: NonNullable<DenunciaState['errors']> = {};

  if (!TIPOS_RELATO_VALIDOS.has(tipoRelato)) {
    errors.tipoRelato = 'Selecione o tipo de relato.';
  }
  if (!RELACIONAMENTOS_VALIDOS.has(relacionamento)) {
    errors.relacionamento = 'Selecione seu relacionamento com a empresa.';
  }
  if (descricao.length < 20) {
    errors.descricao = 'Descreva o ocorrido com pelo menos 20 caracteres.';
  }
  if (!ciencia) {
    errors.ciencia = 'É necessário concordar com os termos.';
  }
  if (identificar) {
    if (!nome) errors.nome = 'Informe seu nome.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      errors.email = 'Informe um e-mail válido.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { status: 'error', errors };
  }

  const identificado = Boolean(identificar);
  const recebidoEm = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });
  const tipoLabel = TIPOS_RELATO[tipoRelato];
  const relacaoLabel = RELACIONAMENTOS[relacionamento];

  const linhas = [
    'Nova manifestação recebida pelo Canal de Denúncia (Compliance).',
    '',
    `Tipo de relato: ${tipoLabel}`,
    `Relacionamento: ${relacaoLabel}`,
    `Identificação: ${identificado ? 'Identificada' : 'Anônima'}`,
    ...(identificado ? [`Nome: ${nome}`, `E-mail para retorno: ${email}`] : []),
    `Recebido em: ${recebidoEm}`,
    '',
    'Descrição:',
    descricao,
  ];

  const esc = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const html = `
    <h2>Nova manifestação — Canal de Denúncia (Compliance)</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
      <tr><td><strong>Tipo de relato</strong></td><td>${esc(tipoLabel)}</td></tr>
      <tr><td><strong>Relacionamento</strong></td><td>${esc(relacaoLabel)}</td></tr>
      <tr><td><strong>Identificação</strong></td><td>${identificado ? 'Identificada' : 'Anônima'}</td></tr>
      ${identificado ? `<tr><td><strong>Nome</strong></td><td>${esc(nome)}</td></tr>` : ''}
      ${identificado ? `<tr><td><strong>E-mail para retorno</strong></td><td>${esc(email)}</td></tr>` : ''}
      <tr><td><strong>Recebido em</strong></td><td>${esc(recebidoEm)}</td></tr>
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px"><strong>Descrição:</strong></p>
    <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${esc(descricao)}</p>
  `;

  try {
    await sendMail({
      subject: `[Compliance] Nova denúncia — ${tipoLabel}`,
      text: linhas.join('\n'),
      html,
      // Permite responder direto a quem se identificou.
      replyTo: identificado ? email : undefined,
    });
  } catch (err) {
    // Não logamos a descrição (conteúdo sensível); só o erro de envio.
    console.error('[compliance/denuncia] falha ao enviar e-mail', err);
    return {
      status: 'error',
      message:
        'Não foi possível enviar sua manifestação agora. Tente novamente em alguns minutos ou utilize o e-mail da Ouvidoria.',
    };
  }

  return {
    status: 'success',
    message:
      'Sua manifestação foi recebida e será analisada pelo Comitê de Ética em até 10 dias úteis.',
  };
}
