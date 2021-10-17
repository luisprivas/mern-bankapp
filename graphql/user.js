import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import { validateCreateUser, validateDeposit, validateWithdraw } from '../validation/user.js';

const userResolvers = {
  createUser: async ({ input }) => {
    validateCreateUser(input);
    try {
      const hashedPassword = await bcrypt.hash(input.password, 12);
      const user = new User({
        name: input.name.trim(),
        email: input.email,
        password: hashedPassword,
      });
      const result = await user.save();
      return { ...result._doc, password: null };
    } catch (err) {
      throw err;
    }
  },

  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email: email });
      const isEqual = await bcrypt.compare(password, user.password);
      if (!user || !isEqual) {
        return { __typename: 'InvalidCredentials', message: 'Invalid Credentials' };
      }
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.SECRET_KEY, {
        expiresIn: '1h',
      });
      return {
        __typename: 'AuthData',
        userId: user.id,
        name: user.name,
        balance: user.balance,
        token: token,
        tokenExpiration: 1,
      };
    } catch (err) {
      throw err;
    }
  },

  deposit: async ({ amount }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    validateDeposit(amount);
    try {
      const user = await User.findOne({ _id: req.userId });
      user.balance += amount;
      await user.save();
      return user.balance;
    } catch (err) {
      throw err;
    }
  },

  withdraw: async ({ amount }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      const user = await User.findOne({ _id: req.userId });
      validateWithdraw(user.balance, amount);
      user.balance -= amount;
      await user.save();
      return user.balance;
    } catch (err) {
      throw err;
    }
  },
};

export default userResolvers;
