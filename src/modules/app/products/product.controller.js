import * as service from "./product.service.js";

export const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await service.getProductDetails(productId);

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    const isNotFound = error.message
      .includes("not found")
      .status(isNotFound ? 404 : 500)
      .json({ success: false, message: error.message });
  }
};
