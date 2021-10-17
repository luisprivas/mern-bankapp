export const validateCreateUser = (input) => {
  const validEmailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!validEmailRegex.test(input.email)) {
    throw new Error('Invalid email address');
  }
  if (input.password.length < 8) {
    throw new Error('Password is too short');
  }
};

export const validateDeposit = (depositAmount) => {
  if (isNaN(depositAmount)) {
    throw new Error('Enter numerical values only');
  }
  if (Math.sign(depositAmount) <= 0) {
    throw new Error('Positive values only');
  }
};

export const validateWithdraw = (balance, withdrawAmount) => {
  if (isNaN(withdrawAmount)) {
    throw new Error('Enter numerical values only');
  }
  if (Math.sign(withdrawAmount) <= 0) {
    throw new Error('Positive values only');
  }
  if (balance < withdrawAmount) {
    throw new Error('Not enough funds');
  }
};
