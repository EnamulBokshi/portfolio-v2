interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown> | null> | null;
}

export function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;

  const serializedData = Array.isArray(data)
    ? data.filter(Boolean)
    : data;

  if (Array.isArray(serializedData) && serializedData.length === 0) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(serializedData),
      }}
    />
  );
}
