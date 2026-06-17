import nodemailer, { type Transporter } from 'nodemailer';

// Transporte SMTP compartilhado para envio de e-mails transacionais do site
// (hoje: canal de denúncia do Compliance). Credenciais ficam em variáveis de
// ambiente — ver .env.local (MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS,
// MAIL_FROM, MAIL_TO). Importado apenas pela Server Action ('use server'),
// portanto os segredos nunca chegam ao bundle do cliente.

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variável de ambiente ${name} não definida. Configure-a em .env.local.`,
    );
  }
  return value;
}

// Reaproveita o transporter entre invocações (a porta 465 usa SSL implícito).
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const port = Number(process.env.MAIL_PORT ?? 465);

  transporter = nodemailer.createTransport({
    host: requiredEnv('MAIL_HOST'),
    port,
    // 465 = SSL implícito (secure). 587/25 usam STARTTLS (secure=false).
    secure: port === 465,
    auth: {
      user: requiredEnv('MAIL_USER'),
      pass: requiredEnv('MAIL_PASS'),
    },
  });

  return transporter;
}

export type SendMailInput = {
  subject: string;
  text: string;
  html?: string;
  /** Sobrescreve o destinatário padrão (MAIL_TO). */
  to?: string;
  /** Define o Reply-To, ex.: e-mail de quem se identificou na denúncia. */
  replyTo?: string;
};

export async function sendMail({
  subject,
  text,
  html,
  to,
  replyTo,
}: SendMailInput): Promise<void> {
  const from = requiredEnv('MAIL_FROM');
  const recipient = to ?? requiredEnv('MAIL_TO');
  // BCC (cópia oculta) opcional. O nodemailer envia este endereço apenas no
  // envelope SMTP (RCPT TO) e NÃO gera header "Bcc:", então o destinatário
  // não aparece em nenhum lugar da mensagem recebida.
  const bcc = process.env.MAIL_BCC || undefined;

  const info = await getTransporter().sendMail({
    from,
    to: recipient,
    bcc,
    subject,
    text,
    html,
    replyTo,
  });

  // Diagnóstico de entrega (sem expor conteúdo): registra quais destinatários
  // o servidor SMTP aceitou/rejeitou no envelope. Útil para confirmar se o BCC
  // foi de fato incluído e aceito. `bccDefinido` revela se a env foi carregada.
  console.info('[mailer] envelope SMTP', {
    bccDefinido: Boolean(bcc),
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response,
  });
}
