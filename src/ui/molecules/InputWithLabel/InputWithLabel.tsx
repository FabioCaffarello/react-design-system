import type { HTMLProps } from "react";
import { Text, Input, type InputProps } from "../../atoms";

interface Props extends Omit<HTMLProps<HTMLInputElement>, 'size'> {
  label: string;
  size?: InputProps['size'];
}

export default function InputWithLabel({ label, size, ...props }: Props) {
  if (!props.id && process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.error("InputWithLabel component requires an id prop");
  }

  return (
    <div className="mb-medium grid gap-small">
      <Text as="label" htmlFor={props.id} className="cursor-pointer">
        {label}
      </Text>
      <Input {...props} size={size} />
    </div>
  );
}
