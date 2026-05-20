import * as service from "./analytics.service.js";
import asyncHandler from "../../../utils/asyncHandler.js";

export const getKPIS = asyncHandler(async (req, res) => {
  const kpis = await service.getKPIS();
  return res.status(200).json({ success: true, kpis });
});
