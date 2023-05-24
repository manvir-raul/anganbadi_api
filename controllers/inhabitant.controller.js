const db = require("../models/index");
const ObjectId = db.mongoose.Types.ObjectId;

const Inhabitant = db.inhabitant;
const Family = db.family;

// const saveFamilyDetails = (req, res, inhabitant_id) => {
//   const { family_number, relation_with_head } = req.body;
//   Family.updateOne(
//     { _id: family_number },
//     [
//       {
//         $addFields: {
//           family_head: {
//             $cond: [
//               { $eq: [relation_with_head, "Self"] },
//               ObjectId(inhabitant_id),
//               "$family_head",
//             ],
//           },
//           members: {
//             $reduce: {
//               input: [{ _id: ObjectId(inhabitant_id), relation_with_head }],
//               initialValue: { $ifNull: ["$members", []] },
//               in: {
//                 $cond: {
//                   if: { $in: ["$$this", "$$value"] },
//                   then: "$$value",
//                   // then: {
//                   //   $map: {
//                   //     input: "$$value",
//                   //     as: "mem",
//                   //     in: {
//                   //       $cond: {
//                   //         if: {
//                   //           $eq: [
//                   //             "$$mem.relation_with_head",
//                   //             "$$this.relation_with_head",
//                   //           ],
//                   //         },
//                   //         then: "$$this",
//                   //         else: "$$mem",
//                   //       },
//                   //     },
//                   //   },
//                   // },
//                   else: { $concatArrays: ["$$value", ["$$this"]] },
//                 },
//               },
//             },
//           },
//         },
//       },
//     ],
//     { upsert: true }
//   ).exec((err, ff) => {
//     if (err) {
//       console.log("error", err);
//       res.status(500).send({
//         error: "error on adding family but inhabitant saved succesfully",
//       });
//       return;
//     }
//     res.send({ message: "Inhabitant registered successfully!" });
//   });
// };
const saveFamilyDetails = (req, res, inhabitant_id) => {
  const { family_number, relation_with_head } = req.body;
  Family.updateOne(
    { _id: family_number },
    {
      $addToSet: {
        members: { _id: ObjectId(inhabitant_id), relation_with_head },
      },
      $set: {
        family_head: {
          $cond: [true, inhabitant_id, "$family_head"],
        },
      },
    },
    { upsert: true }
  ).exec((err, ff) => {
    if (err) {
      console.log("error", err);
      res.status(500).send({
        error: "error on adding family but inhabitant saved succesfully",
      });
      return;
    }
    res.send({ message: "Inhabitant registered successfully!" });
  });
};

exports.inhabitantList = (req, res) => {
  Inhabitant.find({}).exec((err, list) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ list });
  });
};

const getData = (req) => ({
  name: req.body.name,
  father_name: req.body.father_name,
  mother_name: req.body.mother_name,
  spouse_name: req.body.spouse_name,
  bank_details: {
    bank_name: req.body.bank_name,
    bank_account_number: req.body.bank_account_number,
    bank_ifsc_code: req.body.bank_ifsc_code,
  },
  gender: req.body.gender,
  adhar_card: req.body.adhar_card,
  age: req.body.age,
  caste: req.body.caste,
  date_of_birth: req.body.date_of_birth,
  is_pensioner: req.body.is_pensioner,
  marital_status: req.body.marital_status,
  pan_card: req.body.pan_card,
  pension_number: req.body.pension_number,
  pension_type: req.body.pension_type,
  family_number: req.body.family_number,
});

exports.addInhabitant = (req, res) => {
  const inhabitant = new Inhabitant(getData(req));

  inhabitant.save(async (err, inhabitant) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    saveFamilyDetails(req, res, inhabitant._id);
  });
};

exports.updateInhabitant = async (req, res) => {
  Inhabitant.updateOne(
    { _id: req.params.inhabitantID },
    { $set: getData(req) }
  ).exec((err, ff) => {
    if (err) {
      console.log("error", err);
      res.status(500).send({ message: err });
      return;
    }
    saveFamilyDetails(req, res, req.params.inhabitantID);
  });
};

exports.inhabitantDetails = async (req, res) => {
  Inhabitant.aggregate([
    { $match: { _id: ObjectId(req.params.inhabitantID) } },
    {
      $lookup: {
        from: "inhabitants",
        localField: "father_name",
        foreignField: "_id",
        as: "father",
      },
    },
    {
      $unwind: {
        path: "$father",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "inhabitants",
        localField: "mother_name",
        foreignField: "_id",
        as: "mother",
      },
    },
    {
      $unwind: {
        path: "$mother",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "inhabitants",
        localField: "spouse_name",
        foreignField: "_id",
        as: "spouse",
      },
    },
    {
      $unwind: {
        path: "$spouse",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "families",
        localField: "family_number",
        foreignField: "_id",
        as: "family",
      },
    },
    {
      $unwind: {
        path: "$family",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        family: 1,
        name: 1,
        marital_status: 1,
        gender: 1,
        adhar_card: 1,
        age: 1,
        date_of_birth: 1,
        pan_card: 1,
        pension_type: {
          $toInt: "$pension_type",
        },
        pension_number: 1,
        children: 1,
        caste: 1,
        is_pensioner: 1,
        "father._id": 1,
        "father.name": 1,
        "spouse._id": 1,
        "spouse.name": 1,
        "mother._id": 1,
        "mother.name": 1,
        bank_name: "$bank_details.bank_name",
        bank_account_number: "$bank_details.bank_account_number",
        bank_ifsc_code: "$bank_details.bank_ifsc_code",
        family_number: "$family._id",
        relation_with_head: "$family.relation_with_head",
      },
    },
  ]).exec((err, inhabitant) => {
    if (err) {
      console.log("req manvir singh njn", err);
      res.status(500).send({ message: "man" });
      return;
    }
    console.log("manvir", inhabitant);
    res.send({ inhabitant: inhabitant[0] });
  });
};

exports.lookUpInhabitant = (req, res) => {
  Inhabitant.find(
    {
      name: { $regex: new RegExp(req.query.key, "gi") },
    },
    { name: 1, father_name: 1 }
  ).exec((err, inhabitants) => {
    if (err) {
      console.log("req manvir singh njn", err);
      res.status(500).send({ message: "man" });
      return;
    }
    res.send({ options: inhabitants });
  });
};
