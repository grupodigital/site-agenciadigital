'use server';

// Server Action do canal de denúncia. Recebe o FormData do formulário em
// ComplianceContent, valida do lado servidor e retorna o estado para o
// useActionState do cliente exibir mensagens de erro/sucesso.
//
// TODO (operacional / TI): integrar com servidor de e-mail (Resend, SES,
// SMTP institucional) para encaminhar a manifestação a
// ouvidoria@agenciadigital.com.vc. Hoje só registra em log e retorna
// sucesso, para a UI ficar 100% navegável enquanto o backend de envio é
// definido.

const TIPOS_RELATO_VALIDOS = new Set([
  'agressao-fisica',
  'assedio-moral',
  'assedio-sexual',
  'conflito-interesse',
  'corrupcao',
  'desvio-ativos',
  'discriminacao',
  'favorecimento',
  'fraudes',
  'roubo-furto',
  'vazamento',
]);

const RELACIONAMENTOS_VALIDOS = new Set([
  'cliente',
  'colaborador',
  'cooperador',
  'fornecedor',
  'prestador',
]);

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

  // Registro mínimo para auditoria do recebimento enquanto o envio de
  // e-mail real não está integrado. Não logamos a descrição completa para
  // evitar vazar conteúdo sensível em logs.
  console.info('[compliance/denuncia] manifestação recebida', {
    tipoRelato,
    relacionamento,
    descricaoTamanho: descricao.length,
    identificado: Boolean(identificar),
    nome: identificar ? nome : undefined,
    email: identificar ? email : undefined,
    recebidoEm: new Date().toISOString(),
  });

  return {
    status: 'success',
    message:
      'Sua manifestação foi recebida e será analisada pelo Comitê de Ética em até 10 dias úteis.',
  };
}
