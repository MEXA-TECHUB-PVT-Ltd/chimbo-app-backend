import catchAsync from "../utils/catchAsync.js";
import { startOfYear } from 'date-fns'
import { endOfYear } from 'date-fns'
import Listings from "../models/listingModel.js";
import listingTypeModel from "../models/listingTypeModel.js";
import propertyTypeModel from "../models/propertyTypeModel.js";
import heatingTypeModel from "../models/heatingTypeModel.js";
import occupationTypeModel from "../models/occupationTypeModel.js";
import genderModel from "../models/genderModel.js"
import specificationTypeModel from "../models/specificationTypeModel.js";
import roomCharacteristicsModel from "../models/roomCharacteristicsModel.js";
import listingFeaturesModel from "../models/listingFeaturesModel.js";
import accessibilityItemModel from "../models/accessibilityItemModel.js";
import geolib from 'geolib';
import { getDetailedListing, createQuery, filterListings } from '../utils/listingUtils.js'
import floorModel from "../models/floorModel.js";
import userModel from "../models/userModel.js";
import adminModel from "../models/adminModel.js";
import wishlistModel from "../models/wishlistModel.js";
import { format } from 'date-fns'

export const getIDsByLocation =  async(req, res) => {
    const ParamsId=req.params.userId;
    const userLat=req.params.userLat;
    const userLong=req.params.userLong;
    // const userLat=33.6521074;
    // const userLong=73.0817038;
    // console.log(ParamsId)
    // console.log(userLat)
    // console.log(userLong)
    let Array =[];
     Listings.find({}, (error, result) => {
        if (error) {
            res.send(error)
        } else {
            if(result){
                Array =result;
                for(let i = 0; i < result.length; i++) {
                    let lat2=Array[i].location.coordinates[1];
                    let long2=Array[i].location.coordinates[0];
                   
                        var radlat1 = Math.PI * userLat/180;
                        var radlat2 = Math.PI * lat2/180;
                        var theta = userLong-long2;
                        var radtheta = Math.PI * theta/180;
                        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                        if (dist > 1) {
                            dist = 1;
                        }
                        dist = Math.acos(dist);
                        dist = dist * 180/Math.PI;
                        dist = dist * 60 * 1.1515;
                        // console.log(dist);
                     
                        Array[i].distance=dist;

               
            }
            res.json(Array);
            }else{
                console.log('no data in listing')
            }
           
        }
    }).sort({ $natural: -1 })

};
export const AddLikeByUserId = catchAsync(async (req, res) => {
    const userId=req.params.userId;
    const ListingId=req.params.ListingId;
    const updateData = {
        $push: {
            likedBy: userId,
        }
    }
    const options = {
        new: true
    }
    Listings.findByIdAndUpdate(ListingId, updateData, options, (error, result) => {
        if (error) {
            res.json(error.message)
        } else {
            res.send({data:result,message:"Updated Successfully"})
        }
    })
  
});
export const getAll = catchAsync(async (req, res) => {
    // await Listings.deleteMany()
    const recordPerPage = 5;
    let pageNo = parseInt(req.query.pageNo || 0);

    if (pageNo !== 0) {
        pageNo--;
    }
    const count = await Listings.countDocuments({});

    const Array1 = await Listings.find({}, "price beds m2 floor city streetName streetNo advertiser imagePaths location").limit(recordPerPage)
        .skip(recordPerPage * pageNo);

    // console.log(listings);

    for (let i = 0; i < Array1.length; i++) {
        var floors = {};

        if (Array1[i].floor !== undefined) {
            floors = await floorModel.findOne({ _id: Array1[i].floor }, "name")
            Array1[i].floor = floors;
        }
        else {
            Array1[i].floor = "";
        }



    }

    if (Array1.length > 0) {

        return res.status(200).json({
            success: true,
            status: 200,
            message: "Listings found",
            totalPages: Math.ceil(count / recordPerPage),
            listings: Array1,
        });
    }
    return res.status(404).json({
        success: false,
        status: 404,
        message: "Listings Not found",
    });
});

export const get = catchAsync(async (req, res) => {
    // const userId = req.params.id;
    // Listings.find({ _id: userId }, function (err, foundResult) {
    //   try {
    //     res.json(foundResult);
    //   } catch (err) {
    //     res.json(err);
    //   }
    // })
    const viewerId = req.body?.viewerId;
    console.log(viewerId);
    const listing = await Listings.findOne({ _id: req.params.id });
    if (!listing) {
        return res.json({
            success: false,
            status: 404,
            message: "Listing Not found",
        });
    }

    const userWishlist = await wishlistModel.findOne({ userId: viewerId, listingId: req.params.id });
    console.log(userWishlist);
    const detailedListing = await getDetailedListing(listing.toObject());


    if (typeof userWishlist === "object" && userWishlist) {
        detailedListing.likedStatus = "liked"
        detailedListing.recordId = userWishlist._id;
        console.log(detailedListing);
    }
    return res.json({
        success: true,
        message: "Listing found",
        status: 200,
        listing: detailedListing,
    });
});

export const add = catchAsync(async (req, res) => {


    // console.log(array);
    // console.log(req.body);
    const listing = await Listings.create({ ...req.body });
    if (!listing) {
        return res.json({
            success: false,
            status: 500,
            message: "Listing could not be created",
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Listing added successfully",
        listing,
    });
});

export const del = catchAsync(async (req, res) => {
    const existing = await Listings.findOne({ _id: req.params.id });
    if (!existing) {
        return res.json({
            success: false,
            status: 404,
            message: "Listing not found",
        });
    }

    const deleted = await Listings.findByIdAndDelete(existing._id);
    if (!deleted) {
        return res.json({
            success: false,
            status: 500,
            message: "Listing could not be deleted",
        });
    }

    return res.status(201).json({
        success: true,
        status: 200,
        message: "Listing deleted successfully",
        listing: deleted,
    });
});

export const update = catchAsync(async (req, res) => {
    console.log(req.body.id)
    const existing = await Listings.findOne({ _id: req.body.id });
    if (!existing) {
        return res.json({
            success: false,
            status: 404,
            message: "Listing not found",
        });
    }

    const listing = await Listings.findByIdAndUpdate(
        req.body.id,
        {
            ...req.body,
        },
        { new: true }
    );

    if (listing) {
        return res.json({
            success: true,
            status: 200,
            message: "Listing updated successfully",
            listing,
        });
    }

    return res.json({
        success: false,
        status: 500,
        message: "Listing could not be updated",
    });
});

export const filter = catchAsync(async (req, res) => {
    const recordPerPage = 5;
    let pageNo = parseInt(req.query.pageNo || 0);

    if (pageNo !== 0) {
        pageNo--;
    }

    const data = req.body;
    const { viewerId } = req.body;

    const query = createQuery(data);
    const temp = await Listings.find(query).limit(recordPerPage)
        .skip(recordPerPage * pageNo);
    ;
    const filteredListings = filterListings(temp, data)
    console.log(filteredListings);

    console.log("here 2")
    const detailedListings = [];
    if (filteredListings.length <= 0) {
        return res.json({
            success: false,
            status: 404,
            message: "Listings not found"
        })
    }

    const ultraFilter = [];






    const Array1 = filteredListings.map((item, index) => {

        const { price, beds, m2, floor, city, streetName, streetNo, advertiser, imagePaths, _id, location, addedBy } = item

        return { price, beds, m2, floor, city, streetName, streetNo, advertiser, imagePaths, _id, location, addedBy };

    }


    )
    const userWishlist = await wishlistModel.find({ userId: viewerId });
    console.log(userWishlist);

    for (let i = 0; i < Array1.length; i++) {

        for (let j = 0; j < userWishlist.length; j++) {
            console.log(userWishlist[j].listingId);

            console.log(Array1[i]._id);

            if (Array1[i]._id.toString() == userWishlist[j].listingId.toString()) {

                Array1[i].likedStatus = "liked";
                Array1[i].recordId = userWishlist[j]._id;
            }

        }
    }
    // Array1.map((item)=>{
    //     item._id=userWishlist.map(()=>{


    console.log("hasnat3");

    for (let i = 0; i < Array1.length; i++) {
        var floors = {};
        var advertisers = {};
        if (Array1[i].floor !== undefined) {
            floors = await floorModel.findOne({ _id: Array1[i].floor }, "name")
            Array1[i].floor = floors;
        }
        else {
            Array1[i].floor = "";
        }
        if (Array1[i].advertiser !== undefined) {
            if (Array1[i].addedBy === "user") {


                advertisers = await userModel.findOne({ _id: Array1[i].advertiser }, "phoneNo")
                Array1[i].advertiser = advertisers;
            }
            else if (Array1[i].addedBy === "admin") {


                advertisers = await adminModel.findOne({ _id: Array1[i].advertiser }, "phoneNo")
                Array1[i].advertiser = advertisers;
            }

        }
        else {
            Array1[i].advertiser = "";
        }
        // console.log(Array1[i]);
        // for (let j = 0; j < userWishlist.length; i++) {

        //     // if (Array1[i]._id === userWishlist[j].listingId) {
        //     //     Array1[i].likedStatus = "liked";
        //     // }
        // }


    }



    // console.log(Array1);


    return res.json({
        success: true,
        status: 200,
        message: "Listings found",
        listings: Array1,
    });


})
export const uploadImages = catchAsync(async (req, res) => {

    if (!req.files) res.json({
        success: false,
        message: "Images not uploaded."
    });
    else {
       
        // const images = req.files.map((image) => image.path);
        // res.json({ success: true, message: "Images Uploaded", images });
    }
})

export const uploadVideo = catchAsync(async (req, res) => {
    if (!req.file) res.json({
        success: false,
        message: "Video not uploaded."
    });

    const video = req.file.path;
    res.json({ success: true, message: "Video Uploaded", video });
})



export const getIDs = catchAsync(async (req, res) => {
    const listingTypeIDs = await listingTypeModel.find();
    const propertyTypeIDs = await propertyTypeModel.find();
    const heatingTypeIDs = await heatingTypeModel.find();
    const occupationTypeIDs = await occupationTypeModel.find();
    const genderIDs = await genderModel.find();
    const specificationIDs = await specificationTypeModel.find();
    const roomCharacteristicsIDs = await roomCharacteristicsModel.find();
    const featuresIDs = await listingFeaturesModel.find();
    const accessibilityItemIDs = await accessibilityItemModel.find();
    const floorIDs = await floorModel.find();

    const AllIDs = {
        listingTypeIDs,
        propertyTypeIDs,
        heatingTypeIDs,
        occupationTypeIDs,
        genderIDs,
        specificationIDs,
        roomCharacteristicsIDs,
        featuresIDs,
        accessibilityItemIDs,
        floorIDs



    };





    return res.status(200).json({
        success: true,
        status: 200,
        message: "Listings found",
        IDs: AllIDs,
    });


});
export const getByUser = catchAsync(async (req, res) => {
    const listing = await Listings.find({ advertiser: req.params.id }, "price beds m2 floor city streetName streetNo advertiser imagePaths location addedBy");
    const viewerId = req.body.viewerId;

    if (listing.length == 0) {
        return res.json({
            success: false,
            status: 404,
            message: "Listing Not found",
        });
    }
    else {
        console.log(listing);
        const detailedListings = []

        for (let i = 0; i < listing.length; i++) {
            detailedListings.push(
                await getDetailedListing(listing[i].toObject())
            )
        }

        const userWishlist = await wishlistModel.find({ userId: viewerId });
        console.log(userWishlist);

        for (let i = 0; i < detailedListings.length; i++) {

            for (let j = 0; j < userWishlist.length; j++) {
                console.log(userWishlist[j].listingId);

                console.log(detailedListings[i]._id);

                if (detailedListings[i]._id.toString() == userWishlist[j].listingId.toString()) {

                    detailedListings[i].likedStatus = "liked";
                    detailedListings[i].recordId = userWishlist[j]._id;
                }

            }
        }


        return res.json({
            success: true,
            message: "Listing found",
            status: 200,
            listing: detailedListings,
        });
    }
});

export const searchByCity = catchAsync(async (req, res) => {
    const recordPerPage = 5;
    let pageNo = parseInt(req.query.pageNo || 0);
    const data = req.body.city;
    console.log(data);
    if (pageNo !== 0) {
        pageNo--;
    }
    const listings = await Listings.find({ city: { $regex: data, $options: "i" } }).limit(recordPerPage)
        .skip(recordPerPage * pageNo);
    console.log(listings);
    const detailedListings = []
    if (listings.length < 0) {
        return res.status(404).json({
            success: false,
            status: 404,
            message: "Listings Not found",
        });
    }
    for (let i = 0; i < listings.length; i++) {
        detailedListings.push(
            await getDetailedListing(listings[i].toObject())
        )
    }

    if (detailedListings.length > 0) {
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Listings found",
            listings: detailedListings,
        });
    }
    return res.status(404).json({
        success: false,
        status: 404,
        message: "Listings Not found",
    });

})





export const getListingsInsidePolygon = catchAsync(async (req, res) => {


    const filteredListings = []
    const viewerId = req.body.viewerId;

    console.log(req.body.array);
    const longlatArray = req.body.array;
    const allListing = await Listings.find();
    if (allListing.length < 0) {
        return res.status(404).json({
            success: false,
            status: 404,
            message: "Listings Not found",
        });
    }
    allListing.map((item) => {
        const long = item.location.coordinates[0];
        const lat = item.location.coordinates[1];
        if (geolib.isPointInPolygon({ latitude: lat, longitude: long }, longlatArray
        )) {
            filteredListings.push(item);
        };
    })

    console.log(filteredListings);

    const detailedListings = []


    if (filteredListings.length < 0) {
        return res.status(404).json({
            success: false,
            status: 404,
            message: "Listings Not found",
        });
    }




    const Array1 = filteredListings?.map((item, index) => {

        const { price, beds, m2, floor, city, streetName, streetNo, advertiser, imagePaths, _id, location } = item

        return { price, beds, m2, floor, city, streetName, streetNo, advertiser, imagePaths, _id, location };

    }

    )
    const userWishlist = await wishlistModel.find({ userId: viewerId });
    console.log(userWishlist);

    for (let i = 0; i < Array1.length; i++) {

        for (let j = 0; j < userWishlist.length; j++) {
            console.log(userWishlist[j].listingId);

            console.log(Array1[i]._id);

            if (Array1[i]._id.toString() == userWishlist[j].listingId.toString()) {

                Array1[i].likedStatus = "liked";
                Array1[i].recordId = userWishlist[j]._id;
            }

        }
    }


    console.log("hasnat3");

    for (let i = 0; i < Array1.length; i++) {
        var floors = {};
        var advertisers = {};
        if (Array1[i].floor !== undefined) {
            floors = await floorModel.findOne({ _id: Array1[i].floor }, "name")
            Array1[i].floor = floors;
        }
        else {
            Array1[i].floor = "";
        }
        if (Array1[i].advertiser !== undefined) {
            advertisers = await userModel.findOne({ _id: Array1[i].advertiser }, "phoneNo")
            Array1[i].advertiser = advertisers;
        }
        else {
            Array1[i].advertiser = "";
        }
        // console.log(Array1[i]);
        // for (let j = 0; j < userWishlist.length; i++) {

        //     // if (Array1[i]._id === userWishlist[j].listingId) {
        //     //     Array1[i].likedStatus = "liked";
        //     // }
        // }


    }



















    // for (let i = 0; i < listings.length; i++) {
    //     detailedListings.push(
    //         await getDetailedListing(listings[i].toObject())
    //     )
    // }

    if (Array1.length > 0) {
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Listings found",
            listings: Array1,
        });
    }
    return res.status(404).json({
        success: false,
        status: 404,
        message: "Listings Not found",
    });
});

export const getCountOfDocs = catchAsync(async (req, res) => {
    const userListings = await Listings.countDocuments({ addedBy: "user" });
    const adminListings = await Listings.countDocuments({ addedBy: "admin" });
    console.log(userListings);
    if (!userListings && !adminListings) {
        return res.json({
            success: false,
            status: 200,
            message: "Listing  Found",
            listing: { userListings, adminListings },
        });
    }

    return res.json({
        success: true,
        message: "Listing found",
        status: 200,
        listing: { userListings, adminListings },
    });
})

export const chartData = catchAsync(async (req, res) => {
    // const userListings = await Listings.countDocuments({
    //     createdAt: {
    //         $gte: startOfYear(new Date()),
    //         $lte: endOfYear(new Date())
    //     }
    // });
    var year = req.body.year;
    const year2 = format(new Date(year), "yyyy");
    console.log(year2);
    year = parseInt(year2);
    console.log(year);
    var listingChart = [];
    const array = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 0; i < 12; i++) {
        const data = await Listings.aggregate([
            { $addFields: { "year": { $year: '$createdAt' } } },
            { $match: { year: year } },
            { $addFields: { "month": { $month: '$createdAt' } } },
            { $match: { month: i + 1 } },
            {
                $count: "totalCount"
            }
        ]);
        listingChart.push({ month: array[i], count: data[0]?.totalCount ? data[0]?.totalCount : 0 });
        console.log({ month: array[i], count: data[0]?.totalCount ? data[0]?.totalCount : 0 });
    }

    // console.log(listingChart);
    if (listingChart.length < 0) {
        return res.json({
            success: false,
            status: 404,
            message: "Listing Not found",
        });
    }

    return res.json({
        success: true,
        message: "Listing found",
        status: 200,
        listing: listingChart
    });
})


// function chk11() {
//     const val = geolib.isPointInPolygon({ latitude: 51.5125, longitude: 7.485 }, [
//         { latitude: 51.5, longitude: 7.4 },
//         { latitude: 51.555, longitude: 7.4 },
//         { latitude: 51.555, longitude: 7.625 },
//         { latitude: 51.5125, longitude: 7.625 },
//     ]);

//     console.log(val);
// }
// chk11();
// [
//     { "latitude": 51.5, "longitude": 7.4 },
//     { "latitude": 51.555, "longitude": 7.4 },
//     { "latitude": 51.555, "longitude": 7.625 },
//     { "latitude": 51.5125, "longitude": 7.625 },
// { "latitude": 33.64919518023462, "longitude": 73.06610774248838 }
// ]