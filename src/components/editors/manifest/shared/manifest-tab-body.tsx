function ManifestTabBody({
  className = "",
  children,
}) {
  return <div className={`min-h-40 space-y-8 ${className}`}>{children}</div>;
}

export default ManifestTabBody;
