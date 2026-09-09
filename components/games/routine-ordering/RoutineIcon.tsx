"use client";

type RoutineIconProps = {
  value: string;
  alt: string;
  className?: string;
};

export default function RoutineIcon({ value, alt, className = "" }: RoutineIconProps) {
  const isImage = value.startsWith("/") || /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(value);

  if (isImage) {
    return <img src={value} alt={alt} className={`object-contain ${className}`} />;
  }

  return <span className={className} aria-hidden="true">{value}</span>;
}
