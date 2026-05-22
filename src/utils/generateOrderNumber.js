/**
 * Generates a unique order number
 * Example:
 * ORD-321-531-323
 */
const generateOrderNumber = () => {
  const generateBlock = () => {
    return Math.floor(100 + Math.random() * 900);
  };

  return `ORD-${generateBlock()}-${generateBlock()}-${generateBlock()}`;
};

export default generateOrderNumber;
