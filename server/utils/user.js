module.exports.comparePassword = ({ user, candidatePassword }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (user.password === null) {
        throw new Error("User's password must be reset.");
      }

      const isMatch = await bcrypt.compare(candidatePassword, user.password);

      resolve(isMatch);
    } catch (error) {
      reject(error);
    }
  });
};
