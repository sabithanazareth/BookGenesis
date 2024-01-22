import { isEmpty } from "./index.js";
import moment from "moment";

const isValidTerm = (term) => {
  isEmpty(term, "SearchTerm");
  term = term.trim();
  return term.toLowerCase();
};

const validName = (name) => {
  isEmpty(name, "Name");
  if (name.trim().match(/[^a-zA-z]/gi))
    throw {
      text: `Name should contain only letters.`,
      code: "400 : BAD_USER_INPUT",
    };
  name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  return name.trim();
};

const checkDate = (dateOfBirth) => {
  isEmpty(dateOfBirth, "Date");
  let date = moment(dateOfBirth, ["MM/DD/YYYY", "M/D/YYYY"]);
  let valid = moment(dateOfBirth, ["MM/DD/YYYY", "M/D/YYYY"], true).isValid();

  if (!valid)
    throw {
      text: `Invalid Birthdate.`,
      code: "400 : BAD_USER_INPUT",
    };
  else {
    const month = date.format("MM");
    const day = date.format("DD");
    const year = date.format("YYYY");
    const current = moment();
    const isBetween = date.isSameOrBefore(current);
    if (!isBetween)
      throw {
        text: `Invalid Birthdate - you have entered a date ahead of today's.`,
        code: "400 : BAD_USER_INPUT",
      };

    if (isLeapYear(year)) {
      if (month == "02" && day == "29")
        throw {
          text: `Date is not valid because its not a leap year.`,
          code: "400 : BAD_USER_INPUT",
        };
    }
  }
  return dateOfBirth.trim();
};

const isLeapYear = (year) => {
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) return 1;
  else return 0;
};

const validCity = (name) => {
  let correctName = "";
  isEmpty(name, "Hometown City");
  if (name.trim().match(/[^a-zA-z'-\s]/gi))
    throw {
      text: `Hometown City can contain letters, space, hypen and apostrophes.`,
      code: "400 : BAD_USER_INPUT",
    };
  name = name.trim().split(" ");
  for (let n in name) {
    n = name[n].charAt(0).toUpperCase() + name[n].slice(1).toLowerCase();
    correctName += n + " ";
  }
  return correctName.trim();
};

const usStates = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const validState = (state) => {
  isEmpty(state, "Hometown State");
  state = state.toUpperCase().trim();
  if (!usStates.includes(state))
    throw {
      text: `You have not entered a valid state.`,
      code: "400 : BAD_USER_INPUT",
    };
  return state;
};

// -----------------------------------------------------------------
const userlength = (para) => {
  if (para.trim().length < 5)
    throw "The username must be at least 5 characters long";
};

const passwordlength = (para) => {
  if (para.trim().length < 8)
    throw "The password should be 8 characters minimum.";
};

const passwordCase = (para) => {
  if (para.trim().match(/[\s]/gi)) throw "Password should not contain spaces.";
};

const passwordCheck = (para) => {
  if (
    para
      .trim()
      .match(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/gm) ===
    null
  )
    throw "The password should be 8 characters minimum, with at least one lowercase letter, one uppercase letter, one number and one special character contained in it";
};

const validateUser = (name, username, password) => {
  exists(username);
  exists(name);
  exists(password);

  isEmpty(name, "Name");
  isEmpty(password, "Password");

  isString(name, "Name");
  isString(username, "Username");
  isString(password, "Password");

  userlength(username);
  userCase(username);

  passwordlength(password);
  passwordCase(password);
  passwordCheck(password);

  name = name.trim();
  username = username.trim().toLowerCase();
  password = password.trim();
  return { name };
};

export { isValidTerm, validName, checkDate, validCity, validState };
