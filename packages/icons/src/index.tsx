import * as React from "react";

/**
 * UDS icon library — extracted verbatim from Figma "[Test] Core Icon Library"
 * (Qpf4bQgv5oSq1V3h3gQ5xD), recolored to `currentColor`.
 *
 * Every icon is a 24×24 <svg> that inherits color from the surrounding
 * `text-*` token utility and resizes via `className`. Concrete guidance:
 *   - size:  16px `size-4` (inline/dense) · 20px `size-5` (small controls) · 24px `size-6` (default)
 *   - color: `text-icon-base-primary` (default) · `text-icon-base-secondary` (muted) ·
 *            `text-status-icon-negative` (error) · `text-status-icon-selected` (selected/success) ·
 *            or inherit `currentColor` from the parent text.
 *
 * Add an icon: extract its SVG path from the library, recolor to currentColor,
 * and append a component below (keep the SvgIcon wrapper).
 */
export type IconProps = React.SVGProps<SVGSVGElement>;

function SvgIcon({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M18.2939 6.29185C18.6849 5.90193 19.3179 5.90286 19.7079 6.2938C20.0978 6.6848 20.0969 7.31785 19.706 7.70786L10.6942 16.6981C10.3045 17.0869 9.67367 17.088 9.28311 16.7L4.29483 11.743C3.90311 11.3537 3.90165 10.7207 4.29093 10.329C4.68022 9.93723 5.31324 9.9348 5.70499 10.3241L9.98624 14.579L18.2939 6.29185Z" fill="currentColor" />
    </SvgIcon>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M15.7071 4.29289C15.3166 3.90237 14.6836 3.90237 14.293 4.29289L7.29304 11.2929C6.90252 11.6834 6.90252 12.3164 7.29304 12.707L14.293 19.707C14.6836 20.0975 15.3166 20.0975 15.7071 19.707C16.0976 19.3164 16.0976 18.6834 15.7071 18.2929L9.41414 11.9999L15.7071 5.70696C16.0976 5.31643 16.0976 4.68342 15.7071 4.29289Z" fill="currentColor" />
    </SvgIcon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M8.29289 19.707C8.68342 20.0975 9.31643 20.0975 9.70696 19.707L16.707 12.707C17.0975 12.3164 17.0975 11.6834 16.707 11.2929L9.70696 4.29289C9.31643 3.90237 8.68342 3.90237 8.29289 4.29289C7.90237 4.68342 7.90237 5.31643 8.29289 5.70696L14.5859 11.9999L8.29289 18.2929C7.90237 18.6834 7.90237 19.3164 8.29289 19.707Z" fill="currentColor" />
    </SvgIcon>
  );
}

export function CloseCircleIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM15.5352 8.46484C15.1446 8.07438 14.5116 8.07434 14.1211 8.46484L11.999 10.585L9.87891 8.46484C9.48838 8.07438 8.85535 8.07434 8.46484 8.46484C8.0744 8.85535 8.0744 9.4884 8.46484 9.87891L10.585 11.999L8.46387 14.1211C8.07369 14.5115 8.07388 15.1447 8.46387 15.5352C8.85437 15.9257 9.48838 15.9256 9.87891 15.5352L12 13.4141L14.1211 15.5352C14.5116 15.9257 15.1446 15.9256 15.5352 15.5352C15.9257 15.1446 15.9257 14.5116 15.5352 14.1211L13.4141 12L15.5352 9.87891C15.9257 9.48841 15.9256 8.85537 15.5352 8.46484Z" fill="currentColor" />
    </SvgIcon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M18.293 4.29314C18.6835 3.90261 19.3165 3.90261 19.707 4.29314C20.0975 4.68366 20.0975 5.31669 19.707 5.7072L13.4141 12.0002L19.707 18.2931L19.7754 18.3693C20.0956 18.7621 20.0731 19.3411 19.707 19.7072C19.3409 20.0733 18.7619 20.0958 18.3691 19.7756L18.293 19.7072L12 13.4142L5.70703 19.7072L5.63086 19.7756C5.2381 20.0958 4.65905 20.0733 4.29297 19.7072C3.92689 19.3411 3.90436 18.7621 4.22461 18.3693L4.29297 18.2931L10.5859 12.0002L4.29297 5.7072C3.90246 5.31669 3.90248 4.68366 4.29297 4.29314C4.68349 3.90261 5.31651 3.90261 5.70703 4.29314L12 10.5861L18.293 4.29314Z" fill="currentColor" />
    </SvgIcon>
  );
}

export function ErrorCircleIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15ZM12 7C11.3126 7 10.7547 7.5549 10.75 8.24121L11.001 12.9609C11.0005 12.9739 11 12.9869 11 13C11 13.5523 11.4477 14 12 14C12.5523 14 13 13.5523 13 13L13.25 8.24121C13.2453 7.5549 12.6874 7 12 7Z" fill="currentColor" />
    </SvgIcon>
  );
}

export function InfoCircleIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 10.75C12.5523 10.75 13 11.1977 13 11.75V15.75C13 16.3023 12.5523 16.75 12 16.75C11.4477 16.75 11 16.3023 11 15.75V11.75C11 11.1977 11.4477 10.75 12 10.75Z" fill="currentColor" />
      <path d="M12 7.25C12.5523 7.25 13 7.69772 13 8.25C13 8.80228 12.5523 9.25 12 9.25C11.4477 9.25 11 8.80228 11 8.25C11 7.69772 11.4477 7.25 12 7.25Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z" fill="currentColor" />
    </SvgIcon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M20 5C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H4C3.44772 7 3 6.55228 3 6C3 5.44772 3.44772 5 4 5H20Z" fill="currentColor" />
      <path d="M20 11C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H20Z" fill="currentColor" />
      <path d="M20 17C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18C3 17.4477 3.44772 17 4 17H20Z" fill="currentColor" />
    </SvgIcon>
  );
}

export function MicIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 2C13.933 2 15.5 3.567 15.5 5.5V11C15.5 12.933 13.933 14.5 12 14.5C10.067 14.5 8.5 12.933 8.5 11V5.5C8.5 3.567 10.067 2 12 2Z" fill="currentColor" />
      <path d="M19 10C19.5523 10 20 10.4477 20 11C20 15.0795 16.9462 18.4433 13 18.9355V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V18.9355C7.05384 18.4433 4 15.0795 4 11C4 10.4477 4.44772 10 5 10C5.55228 10 6 10.4477 6 11C6 14.3137 8.68629 17 12 17C15.3137 17 18 14.3137 18 11C18 10.4477 18.4477 10 19 10Z" fill="currentColor" />
    </SvgIcon>
  );
}

export function MoreVerticalIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 17.498C12.9665 17.498 13.75 18.2815 13.75 19.248C13.75 20.2145 12.9665 20.998 12 20.998C11.0335 20.998 10.25 20.2145 10.25 19.248C10.25 18.2815 11.0335 17.498 12 17.498Z" fill="currentColor" />
      <path d="M12 10.25C12.9665 10.25 13.75 11.0335 13.75 12C13.75 12.9665 12.9665 13.75 12 13.75C11.0335 13.75 10.25 12.9665 10.25 12C10.25 11.0335 11.0335 10.25 12 10.25Z" fill="currentColor" />
      <path d="M12 3C12.9665 3 13.75 3.7835 13.75 4.75C13.75 5.7165 12.9665 6.5 12 6.5C11.0335 6.5 10.25 5.7165 10.25 4.75C10.25 3.7835 11.0335 3 12 3Z" fill="currentColor" />
    </SvgIcon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M10.5 2C15.1944 2 19 5.80558 19 10.5C19 12.4868 18.316 14.3125 17.1738 15.7598L21.207 19.793C21.5975 20.1835 21.5975 20.8165 21.207 21.207C20.8165 21.5975 20.1835 21.5975 19.793 21.207L15.7598 17.1738C14.3125 18.316 12.4868 19 10.5 19C5.80558 19 2 15.1944 2 10.5C2 5.80558 5.80558 2 10.5 2ZM10.5 4C6.91015 4 4 6.91015 4 10.5C4 14.0899 6.91015 17 10.5 17C14.0899 17 17 14.0899 17 10.5C17 6.91015 14.0899 4 10.5 4Z" fill="currentColor" />
    </SvgIcon>
  );
}
