import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

function Button({ children, type = "button", className, ...props }: ButtonProps) {
  return (
    <button type={type} className={className} {...props}>
      {children}
    </button>
  );
}

export default Button;
