import React from "react";
import "../../styles/japanese-global.css";

export const JpContainer = ({ children, className = "", ...props }) => (
  <div className={`jp-container ${className}`} {...props}>
    {children}
  </div>
);

export const JpSection = ({
  children,
  className = "",
  background = "paper",
  spacing = "md",
  ...props
}) => {
  const bgClass = {
    paper: "jp-bg-paper",
    subtle: "jp-bg-subtle",
    muted: "jp-bg-muted",
    dark: "jp-bg-dark",
    sakura: "jp-bg-sakura",
    pattern: "jp-bg-pattern"
  }[background];

  const spacingClass = {
    sm: "jp-section",
    md: "jp-section",
    lg: "jp-section-lg",
    xl: "jp-section-xl"
  }[spacing];

  return (
    <section className={`${spacingClass} ${bgClass} ${className}`} {...props}>
      {children}
    </section>
  );
};

export const JpCard = ({
  children,
  className = "",
  elevated = false,
  origami = false,
  wabisabi = false,
  ...props
}) => {
  const baseClass = elevated ? "jp-card jp-card-elevated" : "jp-card";
  const origamiClass = origami ? "jp-origami-fold" : "";
  const wabiClass = wabisabi ? "jp-wabi-sabi" : "";

  return (
    <div 
      className={`${baseClass} ${origamiClass} ${wabiClass} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const JpHeading = ({
  level = 1,
  children,
  className = "",
  zen = false,
  ...props
}) => {
  const Tag = `h${level}`;
  const zenClass = zen ? "jp-zen-border" : "";

  return (
    <Tag
      className={`jp-heading jp-heading-${level} ${zenClass} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
};

export const JpText = ({
  children,
  variant = "body",
  className = "",
  ...props
}) => {
  const variantClasses = {
    body: "jp-body",
    "body-large": "jp-body-large",
    "body-small": "jp-body-small",
    caption: "jp-caption"
  };

  return (
    <p className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </p>
  );
};

export const JpButton = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  ...props
}) => {
  const variantClasses = {
    primary: "jp-btn-primary",
    secondary: "jp-btn-secondary",
    sakura: "jp-btn-sakura",
    aka: "jp-btn-aka",
    ai: "jp-btn-ai",
    midori: "jp-btn-midori"
  };

  const sizeClasses = {
    sm: "jp-btn-sm",
    md: "",
    lg: "jp-btn-lg",
    xl: "jp-btn-xl"
  };

  return (
    <button
      className={`jp-btn ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      }`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
          <span>処理中...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export const JpInput = ({
  label,
  error,
  className = "",
  required = false,
  ...props
}) => (
  <div className="space-y-2">
    {label && (
      <label className="jp-label">
        {label}
        {required && <span className="jp-text-aka ml-1">*</span>}
      </label>
    )}
    <input
      className={`jp-input ${error ? "border-red-500" : ""} ${className}`}
      {...props}
    />
    {error && <p className="jp-text-aka jp-body-small">{error}</p>}
  </div>
);

export const JpGrid = ({
  children,
  cols = { sm: 1, md: 2, lg: 3 },
  className = "",
  spacing = "tatami",
  ...props
}) => {
  const spacingClass = `jp-space-${spacing}`;
  const gridClasses = `jp-grid grid-cols-${cols.sm} md:grid-cols-${cols.md} lg:grid-cols-${cols.lg}`;

  return (
    <div className={`${gridClasses} ${spacingClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const JpFlex = ({
  children,
  direction = "row",
  align = "start",
  justify = "start",
  spacing = "tatami",
  className = "",
  ...props
}) => {
  const directionClass = direction === "column" ? "flex-col" : "flex-row";
  const alignClass = `items-${align}`;
  const justifyClass = `justify-${justify}`;
  const spacingClass = `jp-space-${spacing}`;

  return (
    <div
      className={`jp-flex ${directionClass} ${alignClass} ${justifyClass} ${spacingClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Japanese Modal Component
export const JpModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className = "",
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
          onClick={onClose}
        />

        <div
          className={`inline-block align-bottom jp-card transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} w-full ${className}`}
        >
          <div className="px-6 py-4 jp-bg-subtle jp-border-bottom">
            <div className="flex items-center justify-between">
              <JpHeading level={3} className="mb-0">
                {title}
              </JpHeading>
              <button
                onClick={onClose}
                className="jp-text-muted hover:jp-text-primary transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-6 py-6 jp-bg-paper">{children}</div>
        </div>
      </div>
    </div>
  );
};

// Japanese Navigation Component
export const JpNav = ({ children, variant = "default", className = "" }) => {
  const variantClass = {
    default: "jp-nav",
    transparent: "jp-nav jp-nav-transparent",
    dark: "jp-nav jp-nav-dark"
  }[variant];

  return (
    <nav className={`${variantClass} ${className}`}>
      {children}
    </nav>
  );
};

// Japanese Hero Section with Mono no Aware aesthetic
export const JpHero = ({
  title,
  subtitle,
  children,
  backgroundImage,
  className = "",
}) => (
  <section
    className={`relative min-h-screen flex items-center justify-center overflow-hidden jp-mono-no-aware ${className}`}
  >
    {/* Background Image */}
    {backgroundImage && (
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
    )}

    {/* Gentle overlay */}
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10" />

    {/* Content */}
    <JpContainer className="relative z-20">
      <div className="text-center max-w-4xl mx-auto">
        <JpHeading
          level={1}
          className="jp-heading-1 mb-6 jp-text-primary"
          zen
        >
          {title}
        </JpHeading>

        <JpText
          variant="body-large"
          className="jp-text-secondary mb-12 max-w-3xl mx-auto"
        >
          {subtitle}
        </JpText>

        <JpFlex
          direction="row"
          justify="center"
          align="center"
          spacing="tatami"
          className="flex-wrap"
        >
          {children}
        </JpFlex>
      </div>
    </JpContainer>

    {/* Zen decorative lines */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent z-20"></div>
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent z-20"></div>
  </section>
);

// Ma (Negative Space) Component
export const JpMa = ({ size = "md", children }) => {
  const sizeClass = `jp-ma-${size}`;
  return <div className={sizeClass}>{children}</div>;
};

export default JpContainer;