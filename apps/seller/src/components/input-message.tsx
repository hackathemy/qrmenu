export const InputMessage = ({
  message,
  error,
}: {
  error?: boolean;
  message: string | undefined | null;
}) => {
  if (!message) return null;

  return (
    <span
      className={`text-[10px]/[14px] mt-1 text-[#666666] ${
        error && "!text-[#ff0000] !text-[12px]/[18px]"
      } block`}
    >
      {message}
    </span>
  );
};
