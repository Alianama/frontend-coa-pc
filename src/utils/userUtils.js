/**
 * Mendapatkan full name user berdasarkan ID
 * @param {number} userId - ID user yang dicari
 * @param {Array} users - Array berisi data user
 * @returns {string} Full name user atau "-" jika tidak ditemukan
 */
export const getFullNameById = (userId, users) => {
  const user = users.find((user) => user.id === userId);
  return user ? user.fullName : "-";
};

/**
 * Mendapatkan username user berdasarkan ID
 * @param {number} userId - ID user yang dicari
 * @param {Array} users - Array berisi data user
 * @returns {string} Username user atau "-" jika tidak ditemukan
 */
export const getUsernameById = (userId, users) => {
  const user = users.find((user) => user.id === userId);
  return user ? user.username : "-";
};

/**
 * Mendapatkan email user berdasarkan ID
 * @param {number} userId - ID user yang dicari
 * @param {Array} users - Array berisi data user
 * @returns {string} Email user atau "-" jika tidak ditemukan
 */
export const getEmailById = (userId, users) => {
  const user = users.find((user) => user.id === userId);
  return user ? user.email : "-";
};
