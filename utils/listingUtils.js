import ListingTypes from "../models/listingTypeModel.js"
import PropertyTypes from '../models/propertyTypeModel.js'
import HeatingTypes from '../models/heatingTypeModel.js'
import Admins from "../models/adminModel.js"
import Users from '../models/userModel.js'
import OccupationTypes from '../models/occupationTypeModel.js'
import Specifications from '../models/specificationTypeModel.js'
import RoomCharacteristics from '../models/roomCharacteristicsModel.js'
import Features from '../models/listingFeaturesModel.js'
import AccessibilityItems from "../models/accessibilityItemModel.js"
import genderModel from "../models/genderModel.js"
import Listings from "../models/listingModel.js"
import floorModel from "../models/floorModel.js";
export const getDetailedListing = async ({

    listingTypeId,
    propertyTypeId,
    heatingTypeId,
    occupationTypeId,
    selectedSpecifications,
    selectedRoomCharacteristics,
    selectedFeatures,
    selectedAccessibilityItems,
    advertiser,
    genderPreferenceId,
    floor,
    addedBy,
    ...rest
}) => {
    var user;
    console.log(advertiser);
    const getRefDetails = async (refs, Model, name) => {

        let items = [];
        for (let i = 0; i < refs?.length; i++) {
            const { id, ...rest } = refs[i];
            const res = await Model.findOne({ _id: id });
            console.log(id);
            // (async () => {
            //     console.log(res);
            //     console.log(id);
            //     if (res === null) {
            //         await Listings.updateOne({ _id: listingId }, { $pull: { $refs: { id: id } } }, { multi: true })
            //     }
            // })()

            items.push({
                [name]: res,
                ...rest,
            });

        }
        // console.log(items);
        return items;
    }

    const getItemDetails = async (id, Model) => {
        const response = await Model.findById(id);
        // console.log(response, id)
        return response;
    }

    const listingType = await getItemDetails(
        listingTypeId,
        ListingTypes
    );
    const propertyType = await getItemDetails(
        propertyTypeId,
        PropertyTypes
    );
    const heatingType = await getItemDetails(
        heatingTypeId,
        HeatingTypes
    );
    const gender = await getItemDetails(
        genderPreferenceId,
        genderModel
    );
    const floorName = await getItemDetails(
        floor,
        floorModel
    );
    console.log(addedBy);
    if (addedBy === "user") {
        user = await getItemDetails(advertiser, Users);
        console.log(user);
    }
    else if (addedBy === "admin") {
        user = await getItemDetails(advertiser, Admins);
        console.log(user);
    }
    const occupationType = await getRefDetails(
        occupationTypeId,
        OccupationTypes,
        "occupation"
    );
    const specifications = await getRefDetails(
        selectedSpecifications,
        Specifications,
        "specification",

    );
    const roomCharacteristics = await getRefDetails(
        selectedRoomCharacteristics,
        RoomCharacteristics,
        "roomCharacteristic"
    );
    const features = await getRefDetails(
        selectedFeatures,
        Features,
        "feature"
    );
    const accessibilityItems = await getRefDetails(
        selectedAccessibilityItems,
        AccessibilityItems,
        "accessibilityItem"
    );
    // deleting unnecessary items
    delete rest.__v;
    return {
        ...rest,
        listingType,
        propertyType,
        heatingType,
        occupationType,
        specifications,
        roomCharacteristics,
        features,
        accessibilityItems,
        gender,
        floorName,
        advertiser: user ? { id: user._id, name: user.name, phone: user.phoneNo, email: user.email, pfp: user.pfp } : null,
    };
}

export const createQuery = ({
    city,
    price,
    roomSharedWith,
    listingTypeId,
    propertyTypeId,
    heatingTypeId,
    genderPreferenceId,
    location,
    floorId,
}) => {
    let q = {};

    if (city) q.city = { $regex: city, $options: "i" }
    if (price) {
        q.price = {};
        if (price.min !== "") q.price.$gte = price.min;
        if (price.max !== "") q.price.$lte = price.max;
    }
    if (roomSharedWith) q.roomSharedWith = roomSharedWith;
    if (floorId) q.floor = floorId;
    if (listingTypeId) q.listingTypeId = listingTypeId;
    if (propertyTypeId) q.propertyTypeId = propertyTypeId;
    if (heatingTypeId) q.heatingTypeId = heatingTypeId;
    if (genderPreferenceId) q.genderPreferenceId = genderPreferenceId;
    if (location) {
        q.location = {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [location.long, location.lat],
                },
                $maxDistance: location.radius * 1000,
            },
        };
    }
    // console.log(q);
    return q;
}

export const filterListings = (
    raw,
    { roomCharacteristics: rc, specifications: specs, features }
) => {

    const findIndexInArr = (arr, obj) => {
        // console.log(arr);
        // console.log(obj);
        for (let i in arr) {
            if (
                arr.hasOwnProperty(i) &&
                arr[i].id === obj.id
                // arr[i].value === obj.value
            ) { return i }
        }
        return -1;
    }

    const filterByRoomCharacteristics = (unfiltered, rc) => unfiltered.filter((l) => {
        // console.log(l.selectedRoomCharacteristics);

        if (!l.selectedRoomCharacteristics) return false;

        if (rc !== undefined && rc.length !== 0) {
            let valid = true;
            for (let i in rc) {
                // console.log("hasnt");
                let index = findIndexInArr(l.selectedRoomCharacteristics, rc[i]);
                console.log(index);
                if (index === -1) {
                    valid = false;
                    break;
                }
            }

            // console.log(valid);
            return valid;
        }
        else {
            console.log("Hasnat");
            return true
        }
    });

    const filterBySpecifications = (unfiltered, specs) => unfiltered.filter((l) => {

        if (!l.selectedSpecifications) return;

        let valid = true;
        for (let i in specs) {
            let index = findIndexInArr(l.selectedSpecifications, specs[i]);
            if (index === -1) {
                valid = false;
                break;
            }
        }


        return valid;
    });

    const filterByFeatures = (unfiltered, features) => unfiltered.filter((l) => {
        if (!l.selectedFeatures) return;

        let valid = true;
        for (let i in features) {
            let index = findIndexInArr(l.selectedFeatures, features[i]);
            console.log(index);
            if (index === -1) {
                valid = false;
                break;
            }
        }

        return valid;
    });

    const filteredByRoomCharacteristics = filterByRoomCharacteristics(raw, rc);
    // console.log(filteredByRoomCharacteristics);
    // console.log(filterBySpecifications(filteredByRoomCharacteristics, specs));


    return filterByFeatures(
        filterBySpecifications(filteredByRoomCharacteristics, specs),
        features
    );

}
