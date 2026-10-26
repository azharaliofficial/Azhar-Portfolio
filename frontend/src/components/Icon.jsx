// Small inline icons (no icon font to download). All draw on a 24x24 grid.
const paths = {
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  near_me: <path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z M12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />,
  terminal: <><path d="M4 5h16v14H4z" /><path d="M7 10l3 2-3 2M12 15h5" /></>,
  mail: <><path d="M3 6h18v12H3z" /><path d="M3 7l9 6 9-6" /></>,
  code: <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />,
  link: <path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" />,
  play: <path d="M7 5l12 7-12 7z" />,
  copy: <><path d="M8 8h11v12H8z" /><path d="M5 16V4h11" /></>,
  send: <path d="M3 11l18-8-8 18-2-8z" />,
  arrow_forward: <path d="M4 12h16M14 6l6 6-6 6" />,
  arrow_outward: <path d="M7 17L17 7M8 7h9v9" />,
  open_in_new: <path d="M14 4h6v6M20 4L10 14M18 14v6H4V6h6" />,
  north_east: <path d="M7 17L17 7M8 7h9v9" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  image: <><path d="M3 5h18v14H3z" /><path d="M3 16l5-5 4 4 3-3 6 6" /></>,
}

export default function Icon({ name, size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {paths[name]}
    </svg>
  )
}
