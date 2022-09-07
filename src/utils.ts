export const validateRequestStrings = (
  ...args: (string | undefined)[]
): Error | null => {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '') {
      const err = `Invalid: ${args[i]} cannot be empty!`;
      console.error(err);
      return new Error(err);
    }
  }
  return null;
};

export const validateRequestNumbers = (
  ...args: (number | undefined)[]
): Error | null => {
  for (let i = 0; i < args.length; i++) {
    if (isNaN(args[i] as number)) {
      const err = `Invalid: argument must be a number, but is ${args[i]} instead`;
      console.error(err);
      return new Error(err);
    }
  }
  return null;
};