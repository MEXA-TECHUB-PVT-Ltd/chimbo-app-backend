import catchAsync from "../utils/catchAsync.js";
// import jwt from "jsonwebtoken";

const chklisting = catchAsync(async (req, res, next) => {
    console.log("hasnat2");
    try {
        if (req.body.selectedSpecifications?.includes(null) || req.body.selectedFeatures?.includes(null)
            || (req.body.selectedFeatures[0]?.id instanceof Array)) {
            console.log("hasnat1");
            const array = req.body.selectedSpecifications.filter((item) => {
                if (item !== null) {
                    return item
                }
            })

            const char = req.body.selectedRoomCharacteristics.filter((item) => {
                if (item !== null) {
                    return item.id = item.id[0];
                }
            })
            const feature = req.body.selectedFeatures.filter((item) => {
                if (item !== null) {
                    return item.id = item.id[0];
                }
            })
            const sItems = req.body.selectedAccessibilityItems.filter((item) => {
                if (item !== null) {
                    return item.id = item.id[0];
                }
            })
            const occupation = req.body.occupationTypeId.filter((item) => {
                if (item !== null) {
                    return item.id = item.id[0];
                }
            })
            const owenerCheck = req.body.isOwnerLivingInProperty === "true" ? true : false
            console.log(sItems);
            req.body.selectedFeatures = feature
            req.body.selectedSpecifications = array;
            req.body.selectedRoomCharacteristics = char;
            req.body.selectedAccessibilityItems = sItems;
            req.body.occupationTypeId = occupation;
            req.body.isOwnerLivingInProperty = owenerCheck

            next();
        }

        else {
            console.log("hasnat");
            console.log(req.body);
            next();
        }
    }
    catch (e) {
        console.log(e);
    }
})
export default chklisting;
