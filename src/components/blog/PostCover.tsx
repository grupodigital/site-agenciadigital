import Image from 'next/image';
import { coverOf, type BlogPostSummary } from '@/lib/blog';

type Props = {
  post: Pick<BlogPostSummary, 'image'>;
  sizes: string;
  /** Layout classes for the outer box (size / aspect ratio). */
  className?: string;
  preload?: boolean;
};

/** Post thumbnail — falls back to the blog's default cover when WordPress has none. */
export default function PostCover({
  post,
  sizes,
  className = '',
  preload = false,
}: Props) {
  const image = coverOf(post);

  return (
    <div className={`relative overflow-hidden bg-primary ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
    </div>
  );
}
