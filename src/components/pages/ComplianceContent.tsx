'use client';

import {
  useActionState,
  useId,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Download,
  Mail,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import AnimatedText from '@/components/ui/AnimatedText';
import { enviarDenuncia, type DenunciaState } from '@/app/compliance/actions';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_STD = [0.4, 0, 0.2, 1] as const;
const IN_VIEW = { margin: '-15% 0px -15% 0px' };

// Configuração da página. WhatsApp e PDFs dependem de definições do time
// (TI / Comitê de Ética) e foram deixados como placeholders documentados.

// WhatsApp da Ouvidoria — preencher com o número em E.164, ex.: '5592999999999'.
// Quando vazio, o card é exibido em estado "A definir" e o link fica desabilitado.
const WHATSAPP_E164 = '';
const WHATSAPP_DISPLAY = 'A definir';
const EMAIL_OUVIDORIA = 'ouvidoria@agenciadigital.com.vc';
// Caminhos sugeridos pelo briefing. TI deve subir os PDFs nesses caminhos.
const PDF_PROGRAMA = '/storage/compliance/programa-de-integridade-2026.pdf';
const PDF_CODIGO = '/storage/compliance/codigo-de-etica-2026.pdf';

const TIPOS_RELATO = [
  { value: 'agressao-fisica', label: 'Agressão física' },
  { value: 'assedio-moral', label: 'Assédio moral' },
  { value: 'assedio-sexual', label: 'Assédio sexual' },
  { value: 'conflito-interesse', label: 'Conflito de interesse' },
  { value: 'corrupcao', label: 'Corrupção' },
  { value: 'desvio-ativos', label: 'Desvio de ativos' },
  { value: 'discriminacao', label: 'Discriminação / Racismo / Preconceito' },
  { value: 'favorecimento', label: 'Favorecimento' },
  { value: 'fraudes', label: 'Fraudes' },
  { value: 'roubo-furto', label: 'Roubo / Furto' },
  { value: 'vazamento', label: 'Vazamento de informações' },
] as const;

const RELACIONAMENTOS = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'colaborador', label: 'Colaborador' },
  { value: 'cooperador', label: 'Cooperador' },
  { value: 'fornecedor', label: 'Fornecedor' },
  { value: 'prestador', label: 'Prestador de Serviços' },
] as const;

type LucideIcon = ComponentType<{
  className?: string;
  strokeWidth?: number;
  size?: number;
  'aria-hidden'?: boolean | 'true' | 'false';
}>;

const DOCUMENTOS: ReadonlyArray<{
  icon: LucideIcon;
  titulo: string;
  subtitulo: string;
  descricao: string;
  href: string;
}> = [
  {
    icon: ShieldCheck,
    titulo: 'Programa de Integridade',
    subtitulo: 'Versão atualizada',
    descricao:
      'Documento completo com nossas políticas, controles e procedimentos de integridade.',
    href: PDF_PROGRAMA,
  },
  {
    icon: BookOpen,
    titulo: 'Código de Ética e Conduta',
    subtitulo: 'Versão atualizada',
    descricao:
      'Princípios e padrões de comportamento aplicáveis a colaboradores, fornecedores e parceiros.',
    href: PDF_CODIGO,
  },
];

const INITIAL_STATE: DenunciaState = { status: 'idle' };

export default function ComplianceContent() {
  return (
    <>
      <main className="flex-1">
        {/* ============================== HERO ============================== */}
        <section
          data-hero
          className="relative z-10 bg-primary px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 md:pb-32 md:pt-44"
        >
          <div className="relative mx-auto max-w-7xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
              className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-secondary"
            >
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 bg-secondary"
              />
              Integridade
            </motion.p>

            <AnimatedText
              as="h1"
              delay={0.35}
              className="mt-6 block max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Compliance.
            </AnimatedText>

            <motion.span
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: EASE_STD, delay: 0.95 }}
              className="mt-8 block h-px w-24 origin-left bg-secondary"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.9 }}
              className="mt-8 max-w-2xl text-base leading-[1.8] text-white/75 sm:text-lg"
            >
              Conduzimos nossos negócios com integridade, conformidade legal e
              responsabilidade nas relações com clientes, fornecedores e órgãos
              públicos. Abaixo, você acessa o Programa de Integridade e o
              Código de Ética que orientam nossa atuação.
            </motion.p>
          </div>
        </section>

        {/* ============================== CANAL DE DENÚNCIA ============================== */}
        <section
          id="canal"
          className="relative z-10 bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="max-w-3xl"
            >
              <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-primary">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 bg-secondary"
                />
                Denúncia
              </p>

              <AnimatedText
                as="h2"
                delay={0.15}
                className="mt-6 block text-3xl font-medium leading-[1.1] tracking-tight text-zinc-900 sm:text-4xl md:text-5xl"
              >
                Canal de Denúncia.
              </AnimatedText>

              <motion.span
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={IN_VIEW}
                transition={{ duration: 0.8, ease: EASE_STD, delay: 0.55 }}
                className="mt-8 block h-px w-24 origin-left bg-secondary"
              />

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={IN_VIEW}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.45 }}
                className="mt-8 max-w-2xl text-base leading-[1.8] text-zinc-600 sm:text-lg"
              >
                Utilize este canal para relatar condutas que violem nosso
                Programa de Integridade, nossas políticas ou a legislação. As
                manifestações podem ser identificadas ou anônimas e são
                tratadas com sigilo pelo Comitê de Ética e Integridade da
                Digital.
              </motion.p>
            </motion.div>

            {/* Contact cards */}
            <div className="mt-14 grid grid-cols-1 gap-px bg-zinc-200 md:mt-20 md:grid-cols-2">
              <ContactCard
                href={
                  WHATSAPP_E164
                    ? `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(
                        'Olá, gostaria de falar com a Ouvidoria da Digital.',
                      )}`
                    : null
                }
                icon={MessageCircle}
                label="WhatsApp da Ouvidoria"
                value={WHATSAPP_DISPLAY}
                hint="Atendimento em horário comercial. Mensagens fora desse horário são respondidas no próximo dia útil."
                delay={0}
              />
              <ContactCard
                href={`mailto:${EMAIL_OUVIDORIA}`}
                icon={Mail}
                label="E-mail da Ouvidoria"
                value={EMAIL_OUVIDORIA}
                hint="Retorno em até 10 dias úteis pelo Comitê de Ética e Integridade."
                delay={0.1}
              />
            </div>

          </div>
        </section>

        {/* ============================== DOCUMENTOS ============================== */}
        <section
          id="documentos"
          className="relative z-10 bg-surface px-4 py-16 sm:px-6 sm:py-20 md:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="max-w-3xl"
            >
              <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-primary">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 bg-secondary"
                />
                Documentos
              </p>

              <AnimatedText
                as="h2"
                delay={0.15}
                className="mt-6 block text-3xl font-medium leading-[1.1] tracking-tight text-zinc-900 sm:text-4xl md:text-5xl"
              >
                Documentos oficiais para consulta.
              </AnimatedText>

              <motion.span
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={IN_VIEW}
                transition={{ duration: 0.8, ease: EASE_STD, delay: 0.55 }}
                className="mt-8 block h-px w-24 origin-left bg-secondary"
              />
            </motion.div>

            <div className="mt-14 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-2 md:gap-8">
              {DOCUMENTOS.map((doc, i) => (
                <motion.article
                  key={doc.titulo}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={IN_VIEW}
                  transition={{
                    duration: 0.7,
                    ease: EASE_OUT,
                    delay: 0.15 + i * 0.1,
                  }}
                  className="group relative flex flex-col bg-white p-8 transition-colors duration-300 hover:bg-primary md:p-10"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -top-px left-0 block h-px w-16 bg-secondary"
                  />

                  <doc.icon
                    aria-hidden="true"
                    className="h-10 w-10 text-secondary"
                    strokeWidth={1.5}
                  />

                  <p className="mt-8 text-xs font-medium uppercase tracking-[0.22em] text-zinc-500 transition-colors group-hover:text-white/55">
                    {doc.subtitulo}
                  </p>
                  <h3 className="mt-3 text-2xl font-medium tracking-tight text-zinc-900 transition-colors group-hover:text-white md:text-3xl">
                    {doc.titulo}
                  </h3>
                  <p className="mt-5 flex-1 text-base leading-[1.8] text-zinc-600 transition-colors group-hover:text-white/70">
                    {doc.descricao}
                  </p>

                  <a
                    href={doc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-10 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary transition-colors group-hover:text-secondary"
                  >
                    <Download size={16} aria-hidden="true" strokeWidth={2} />
                    Baixar PDF
                  </a>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================== AVISO DE SEPARAÇÃO ============================== */}
        <section className="relative z-10 bg-white px-4 pt-16 sm:px-6 sm:pt-20 md:pt-32">
          <p className="mx-auto max-w-4xl border-l-2 border-zinc-200 bg-zinc-50 px-6 py-5 text-sm italic leading-relaxed text-zinc-500 md:px-8 md:py-6">
            Para dúvidas, solicitações comerciais ou questões sobre nossos
            serviços, utilize nossa página de Contato. Este canal é exclusivo
            para denúncias de condutas antiéticas ou que violem nossas
            políticas.
          </p>
        </section>

        {/* ============================== FORMULÁRIO ============================== */}
        <section
          id="formulario"
          className="relative z-10 bg-white px-4 pb-16 pt-12 sm:px-6 sm:pb-20 md:pb-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={IN_VIEW}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="mx-auto max-w-7xl"
          >
            <DenunciaForm />
          </motion.div>
        </section>
      </main>
    </>
  );
}

function ContactCard({
  href,
  icon: Icon,
  label,
  value,
  hint,
  delay,
}: {
  href: string | null;
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  delay: number;
}) {
  const disabled = href === null;
  const external = href !== null && href.startsWith('http');

  const inner = (
    <>
      <Icon
        aria-hidden="true"
        className={`h-8 w-8 ${disabled ? 'text-zinc-400' : 'text-secondary'}`}
        strokeWidth={1.5}
      />
      <p className="mt-6 text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-3 text-xl font-medium tracking-tight md:text-2xl ${
          disabled ? 'text-zinc-500' : 'text-zinc-900'
        }`}
      >
        {value}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-500">{hint}</p>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={IN_VIEW}
      transition={{ duration: 0.7, ease: EASE_OUT, delay }}
      className="bg-white"
    >
      {disabled || !href ? (
        <div className="px-6 py-10 md:px-10 md:py-12" aria-disabled="true">
          {inner}
        </div>
      ) : (
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="block px-6 py-10 transition-colors hover:bg-zinc-50 md:px-10 md:py-12"
        >
          {inner}
        </a>
      )}
    </motion.div>
  );
}

function DenunciaForm() {
  const [state, formAction, pending] = useActionState(
    enviarDenuncia,
    INITIAL_STATE,
  );
  const [identify, setIdentify] = useState(false);

  if (state.status === 'success') {
    return (
      <div
        role="status"
        className="border border-zinc-200 bg-white shadow-sm"
      >
        <div className="flex items-center gap-3 border-b border-zinc-200 bg-primary px-6 py-5 md:px-10 md:py-6">
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 bg-secondary"
          />
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-secondary">
            Manifestação recebida
          </p>
        </div>
        <div className="px-6 py-8 md:px-10 md:py-10">
          <p className="text-xl leading-relaxed text-zinc-900 md:text-2xl">
            {state.message}
          </p>
        </div>
      </div>
    );
  }

  const e = state.errors ?? {};

  return (
    <form
      action={formAction}
      noValidate
      className="border border-zinc-200 bg-white shadow-sm"
    >
      {/* Header — anchors the form visually and explains its purpose */}
      <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-6 md:px-10 md:py-7">
        <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-primary">
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 bg-secondary"
          />
          Formulário de manifestação
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">
          Preencha os campos abaixo para registrar sua denúncia. Campos
          marcados com <span className="text-secondary">*</span> são
          obrigatórios.
        </p>
      </div>

      {/* Body */}
      <div className="space-y-8 px-6 py-8 md:px-10 md:py-10">
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="identificar"
            checked={identify}
            onChange={(ev) => setIdentify(ev.target.checked)}
            className="mt-1 h-4 w-4 accent-secondary"
          />
          <span>
            <span className="font-semibold text-zinc-900">
              Desejo me identificar
            </span>
            <span className="mt-1 block text-zinc-500">
              Deixe em branco para enviar a manifestação de forma anônima.
            </span>
          </span>
        </label>

        {identify && (
          <div className="grid gap-6 border-l-2 border-secondary bg-zinc-50 px-5 py-5 md:grid-cols-2 md:px-6 md:py-6">
            <Field
              label="Nome completo"
              name="nome"
              autoComplete="name"
              required
              error={e.nome}
            />
            <Field
              label="E-mail para retorno"
              name="email"
              type="email"
              autoComplete="email"
              required
              error={e.email}
            />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <SelectField
            label="Tipo de relato"
            name="tipoRelato"
            options={TIPOS_RELATO}
            error={e.tipoRelato}
            required
          />
          <SelectField
            label="Relacionamento com a empresa"
            name="relacionamento"
            options={RELACIONAMENTOS}
            error={e.relacionamento}
            required
          />
        </div>

        <TextareaField
          label="Descrição"
          name="descricao"
          hint="Inclua datas, locais e envolvidos, se conhecidos. Mínimo de 20 caracteres."
          error={e.descricao}
          required
        />
      </div>

      {/* Proteção de dados */}
      <div className="border-t border-zinc-200 bg-zinc-50 px-6 py-6 md:px-10 md:py-8">
        <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 bg-secondary"
          />
          Proteção de dados
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">
          Os dados informados serão tratados em conformidade com a LGPD (Lei
          nº 13.709/2018) e utilizados exclusivamente para apuração interna
          pelo Comitê de Ética e Integridade da Digital Comunicação.
        </p>
        <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-zinc-800">
          <input
            type="checkbox"
            name="ciencia"
            className="mt-1 h-4 w-4 accent-secondary"
          />
          <span>
            Declaro estar ciente de que minhas informações serão tratadas com
            sigilo e usadas exclusivamente para apuração desta manifestação.
            <span aria-hidden="true" className="ml-1 text-secondary">
              *
            </span>
          </span>
        </label>
        {e.ciencia && (
          <p className="mt-3 text-xs text-red-600" role="alert">
            {e.ciencia}
          </p>
        )}
      </div>

      {/* Submit footer — clear closing edge of the form */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 bg-white px-6 py-6 md:px-10 md:py-7">
        {state.status === 'error' ? (
          <p className="text-sm text-red-600" role="alert">
            Revise os campos destacados e envie novamente.
          </p>
        ) : (
          <p className="text-xs leading-relaxed text-zinc-500">
            Ao enviar, sua manifestação será encaminhada ao Comitê de Ética
            e Integridade.
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-3 bg-primary px-7 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary/85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? 'Enviando…' : 'Enviar manifestação'}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </form>
  );
}

const INPUT_BASE =
  'mt-2 block w-full border bg-white px-4 py-3 text-base text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-primary';

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-zinc-900"
    >
      {children}
      {required && (
        <span aria-hidden="true" className="ml-1 text-secondary">
          *
        </span>
      )}
    </label>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
  error,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        className={`${INPUT_BASE} ${error ? 'border-red-500' : 'border-zinc-300'}`}
      />
      {hint && !error && <p className="mt-2 text-xs text-zinc-500">{hint}</p>}
      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  error,
  required,
}: {
  label: string;
  name: string;
  options: readonly { value: string; label: string }[];
  error?: string;
  required?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={error ? true : undefined}
        className={`${INPUT_BASE} pr-10 ${error ? 'border-red-500' : 'border-zinc-300'}`}
      >
        <option value="" disabled>
          Selecione…
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function TextareaField({
  label,
  name,
  hint,
  error,
  required,
}: {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  required?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={6}
        aria-invalid={error ? true : undefined}
        className={`${INPUT_BASE} leading-relaxed ${error ? 'border-red-500' : 'border-zinc-300'}`}
      />
      {hint && !error && <p className="mt-2 text-xs text-zinc-500">{hint}</p>}
      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
