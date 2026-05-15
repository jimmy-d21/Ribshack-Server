import * as service from "./menu.service.js";

export const getAllMenu = async (req, res) => {
  try {
    const branchId = req.authUser.id;
    const productMenus = await service.getAllMenu(branchId);

    return res.status(200).json({
      success: true,
      productMenus,
    });
  } catch (error) {
    const isNotFound = error.message.includes("not found");
    return res
      .status(isNotFound ? 404 : 500)
      .json({ success: false, message: error.message });
  }
};

export const getMenuDetails = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await service.getMenuDetails(productId);

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    const isNotFound = error.message.includes("not found");
    return res
      .status(isNotFound ? 404 : 500)
      .json({ success: false, message: error.message });
  }
};
