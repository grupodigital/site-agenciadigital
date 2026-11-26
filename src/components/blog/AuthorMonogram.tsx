/**
 * Author initials in the brand's square badge. Used instead of WordPress
 * avatars: most authors only have the generic Gravatar silhouette, and a mix
 * of real photos and placeholders looks broken.
 */
function initials(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toLocaleUpperCase('pt-BR');
}

type Props = {
  name: string;
  size?: 'sm' | 'lg';
};

export default function AuthorMonogram({ name, size = 'sm' }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex flex-none items-center justify-center bg-secondary font-semibold text-primary ${
        size === 'lg' ? 'h-14 w-14 text-lg' : 'h-8 w-8 text-xs'
      }`}
    >
      {initials(name)}
    </span>
  );
}
