import { User } from "../models/user.model.js";

export async function addAddress(req, res) {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;

    const user = req.user;

    // if this is set a set as default , unset all othe default
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault: isDefault || false,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Error in addAddresses controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAddresses(req, res) {
  try {
    const user = req.user;
    res.status(200).json({ addAddress: user.addresses });
  } catch (error) {
    console.error("Error in getAddresses controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateAddress(req, res) {
  try {
    const user = req.user; // Auth middleware se verified user
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;
    const { addressId } = req.params; // Route se addressId

    // 1️⃣ Find address by ID
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ error: "Addresses not found" });
    }
    // 2️⃣ Default logic
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // 3️⃣ Update fields (tumhare style: field || oldValue)

    address.label = label || address.label;
    address.fullName = fullName || address.fullName;
    address.streetAddress = streetAddress || address.streetAddress;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.phoneNumber = phoneNumber || address.phoneNumber;
    address.isDefault = isDefault != undefined ? isDefault : address.isDefault;

    // 4️⃣ Save the user document
    await user.save();
    res
      .status(200)
      .json({ message: "Address updated sucessfully", address: user.address });
  } catch (error) {
    console.error("Error in updateAddresses controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteAddress(req, res) {
    try {
         const user = req.user;
         const {addressId} = req.params

         // find address by id

           user.addresses.pull(addressId)
           await user.save();

           res.status(200).json({message : "Address deleted sucessfully", addresses :user.addAddress });

       

    } catch (error) {
        console.error("Error in deleteAddresses controller", error);
    res.status(500).json({ error: "Internal server error" });
        
    }

}

export async function addToWishlist(req, res) {
   try {
     const {productId} = req.body; // if adding use body if want to get use params
 
     const user = req.user;

     // check if product is already in the wishlist
     if(user.wishlist.includes(productId)){
     return res.status(400).json({error : "Product already in wishlist"});
     }
    user.wishlist.push(productId)
    await user.save()

    res.status(200).json({message : "Product added to wishlist ", wishlist: user.wishlist});
   } catch (error) {
    console.error("Error in addToWishList controller", error);
    res.status(500).json({ error: "Internal server error" });
    
   }
}

export async function getWishlist(req, res) {

    try {
        const user = req.user;
        res.status(200).json({wishlist : user.wishlist})
        
    } catch (error) {
        console.error("Error in getWishlist controller", error);
    res.status(500).json({ error: "Internal server error" });
    }
}

export async function removeFromWishlist(req, res) {

    try {
          const {productId} = req.params; 
          const user = req.user;

           // check if product is not in the wishlist
     if(!user.wishlist.includes(productId)){
     return res.status(400).json({error : "Product is not even in wishlist"});
     }

          user.wishlist.pull(productId)
          await user.save()

          res.status(200).json({message : "Product removed from wishlist", wishlist: user.wishlist})

    } catch (error) {
         console.error("Error in getWishlist controller", error);
    res.status(500).json({ error: "Internal server error" });
    }
}
