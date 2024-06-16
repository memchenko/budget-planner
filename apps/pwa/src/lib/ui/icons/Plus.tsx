export interface PlusIconProps {
  className?: string;
  pathClassName?: string;
}

export const PlusIcon = (props: PlusIconProps) => {
  return (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <path
        className={props.pathClassName}
        d="M4 12H20M12 4V20"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
