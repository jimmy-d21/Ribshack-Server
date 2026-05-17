const resolveStatus = (message = "") => {
  const msg = message.toLowerCase();
  if (msg.includes("not found")) return 404;
  if (msg.includes("unauthorized")) return 401;
  if (msg.includes("forbidden")) return 403;
  if (msg.includes("invalid") || msg.includes("must be")) return 400;
  return 500;
};

export default resolveStatus;
