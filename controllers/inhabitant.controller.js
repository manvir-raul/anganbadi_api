const db = require("../models/index");

const Inhabitant = db.inhabitant;

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
});

exports.addInhabitant = (req, res) => {
  const inhabitant = new Inhabitant(getData(req));

  inhabitant.save((err, inhabi) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "Inhabitant registered successfully!" });
  });
};

exports.updateInhabitant = async (req, res) => {
  await Inhabitant.findOneAndUpdate(
    { _id: req.params.inhabitantID },
    getData(req)
  );
};

exports.inhabitantDetails = (req, res) => {
  Inhabitant.findOne({ _id: req.params.inhabitantID }).exec(
    (err, inhabitant) => {
      if (err) {
        console.log("req manvir singh njn", err);
        res.status(500).send({ message: "man" });
        return;
      }
      res.send({ inhabitant });
    }
  );
};
