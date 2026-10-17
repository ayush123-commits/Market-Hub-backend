// Method	Endpoint	Purpose
import SellerProfile from "../../models/user&roles/sellerModel.js";
import Warehouse from "../../models/Adress/warehouseModel.js"

import { sendError } from "../../utils/responseHandling/errorHandling.js";
import { sendSuccess } from "../../utils/responseHandling/successHandling.js";

export const createWarehouse = async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Check authentication
    if (!userId) {
      return sendError(res, 401, "Unauthenticated request");
    }

    // 2. Find the seller profile belonging to this user
    const sellerProfile = await SellerProfile.findOne({
      user: userId,
    });

    if (!sellerProfile) {
      return sendError(res, 404, "Seller profile not found");
    }

    // 3. Extract permitted fields from the request body
    const {
      name,
      address,
      city,
      state,
      postalCode,
      country,
      contactPhone,
      isDefault,
    } = req.body;

    // 4. Validate required fields
    const requiredFields = [
      name,
      address,
      city,
      state,
      postalCode,
      country,
      contactPhone,
    ];

    if (
      requiredFields.some(
        (field) => typeof field !== "string" || !field.trim()
      )
    ) {
      return sendError(
        res,
        400,
        "Please provide all required warehouse fields"
      );
    }

    // 5. Create the warehouse
    const warehouse = await Warehouse.create({
      seller: sellerProfile._id,
      name: name.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      contactPhone: contactPhone.trim(),
      ...(typeof isDefault === "boolean" ? { isDefault } : {}),
    });

    // 6. Return success
    return sendSuccess(
      res,
      201,
      warehouse,
      "Warehouse created successfully"
    );
  } catch (error) {
    console.error("Create warehouse error:", error);

    if (error.name === "ValidationError") {
      return sendError(res, 400, "Invalid warehouse data");
    }

    return sendError(res, 500, "Failed to create warehouse");
  }
};

// POST	/warehouses	Create a warehouse

// GET	/warehouses	List the current seller's warehouses

export const getWarehouses = async (req, res) => {
  try {
    // 1. Get the authenticated user's ID
    const userId = req.userId;

    if (!userId) {
      return sendError(res, 401, "Unauthenticated request");
    }

    // 2. Find the seller profile belonging to this user
    const sellerProfile = await SellerProfile.findOne({
      user: userId,
    });

    if (!sellerProfile) {
      return sendError(res, 404, "Seller profile not found");
    }

    // 3. Find all warehouses belonging to this seller
    const warehouses = await Warehouse.find({
      seller: sellerProfile._id,
    }).sort({ isDefault: -1, createdAt: -1 });

    // 4. Return the warehouses
    return sendSuccess(
      res,
      200,
      warehouses,
      "Warehouses fetched successfully"
    );
  } catch (error) {
    console.error("Get warehouses error:", error);

    return sendError(res, 500, "Failed to fetch warehouses");
  }
};
// GET	/warehouses/:id	Retrieve one of the seller's warehouses
export const getWarehouseById = async (req, res) => {
  try {
    // 1. Get the authenticated user ID
    const userId = req.userId;

    if (!userId) {
      return sendError(res, 401, "Unauthenticated request");
    }

    // 2. Get the warehouse ID from the URL
    const { id } = req.params;

    // 3. Validate the MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return sendError(res, 400, "Invalid warehouse ID");
    }

    // 4. Find the seller profile belonging to this user
    const sellerProfile = await SellerProfile.findOne({
      user: userId,
    });

    if (!sellerProfile) {
      return sendError(res, 404, "Seller profile not found");
    }

    // 5. Retrieve the warehouse while checking ownership
    const warehouse = await Warehouse.findOne({
      _id: id,
      seller: sellerProfile._id,
    });

    if (!warehouse) {
      return sendError(res, 404, "Warehouse not found");
    }

    // 6. Return the warehouse
    return sendSuccess(
      res,
      200,
      warehouse,
      "Warehouse fetched successfully"
    );
  } catch (error) {
    console.error("Get warehouse by ID error:", error);

    return sendError(res, 500, "Failed to fetch warehouse");
  }
};
// PATCH	/warehouses/:id	Update warehouse details

export const updateWarehouse = async (req, res) => {
  try {
    // 1. Check authentication
    const userId = req.userId;

    if (!userId) {
      return sendError(res, 401, "Unauthenticated request");
    }

    // 2. Validate warehouse ID
    const { id } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return sendError(res, 400, "Invalid warehouse ID");
    }

    // 3. Find the seller profile
    const sellerProfile = await SellerProfile.findOne({
      user: userId,
    });

    if (!sellerProfile) {
      return sendError(res, 404, "Seller profile not found");
    }

    // 4. Validate the request body
    const body = req.body;

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      Object.keys(body).length === 0
    ) {
      return sendError(res, 400, "Please provide fields to update");
    }

    // 5. Allow only specific fields to be updated
    const allowedFields = [
      "name",
      "address",
      "city",
      "state",
      "postalCode",
      "country",
      "contactPhone",
      "isDefault",
    ];

    const updates = {};

    for (const [field, value] of Object.entries(body)) {
      if (!allowedFields.includes(field)) {
        return sendError(
          res,
          400,
          `Field '${field}' cannot be updated`
        );
      }

      if (field === "isDefault") {
        if (typeof value !== "boolean") {
          return sendError(
            res,
            400,
            "isDefault must be a boolean"
          );
        }

        updates[field] = value;
      } else {
        if (typeof value !== "string" || !value.trim()) {
          return sendError(
            res,
            400,
            `${field} must be a non-empty string`
          );
        }

        updates[field] = value.trim();
      }
    }

    // 6. Update only a warehouse owned by this seller
    const warehouse = await Warehouse.findOneAndUpdate(
      {
        _id: id,
        seller: sellerProfile._id,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!warehouse) {
      return sendError(res, 404, "Warehouse not found");
    }

    // 7. If this warehouse becomes the default,
    // unset the default flag on the seller's other warehouses
    if (updates.isDefault === true) {
      await Warehouse.updateMany(
        {
          seller: sellerProfile._id,
          _id: { $ne: warehouse._id },
          isDefault: true,
        },
        {
          $set: { isDefault: false },
        }
      );
    }

    // 8. Return the updated warehouse
    return sendSuccess(
      res,
      200,
      warehouse,
      "Warehouse updated successfully"
    );
  } catch (error) {
    console.error("Update warehouse error:", error);

    if (error.name === "ValidationError") {
      return sendError(res, 400, "Invalid warehouse data");
    }

    return sendError(res, 500, "Failed to update warehouse");
  }
};

// DELETE	/warehouses/:id	Delete a warehouse
export const deleteWarehouse = async (req, res) => {
  try {
    // 1. Check authentication
    const userId = req.userId;

    if (!userId) {
      return sendError(res, 401, "Unauthenticated request");
    }

    // 2. Validate warehouse ID
    const { id } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return sendError(res, 400, "Invalid warehouse ID");
    }

    // 3. Find the seller profile belonging to this user
    const sellerProfile = await SellerProfile.findOne({
      user: userId,
    });

    if (!sellerProfile) {
      return sendError(res, 404, "Seller profile not found");
    }

    // 4. Find and delete only a warehouse owned by this seller
    const deletedWarehouse = await Warehouse.findOneAndDelete({
      _id: id,
      seller: sellerProfile._id,
    });

    if (!deletedWarehouse) {
      return sendError(res, 404, "Warehouse not found");
    }

    // 5. If the deleted warehouse was the default,
    // promote the newest remaining warehouse
    if (deletedWarehouse.isDefault) {
      const nextDefault = await Warehouse.findOne({
        seller: sellerProfile._id,
      }).sort({ createdAt: -1 });

      if (nextDefault) {
        // Clear any existing default flags for this seller
        await Warehouse.updateMany(
          { seller: sellerProfile._id },
          { $set: { isDefault: false } }
        );

        // Mark the selected warehouse as the default
        nextDefault.isDefault = true;
        await nextDefault.save();
      }
    }

    // 6. Return success
    return sendSuccess(
      res,
      200,
      deletedWarehouse,
      "Warehouse deleted successfully"
    );
  } catch (error) {
    console.error("Delete warehouse error:", error);

    return sendError(res, 500, "Failed to delete warehouse");
  }
};