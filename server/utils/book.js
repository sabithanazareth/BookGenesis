import moment from "moment";
import { isEmpty } from "./index.js";
import ISBN from "isbn3";

const isValidGenre = (genre) => {
  isEmpty(genre, "Genre");
  genre = genre.trim();
  return genre.toLowerCase();
};

const isPrice = (minimum, maximum) => {
  if (isNaN(minimum) || isNaN(maximum))
    throw { text: `Price is not a number`, code: "400 : BAD_USER_INPUT" };
  minimum = Number(minimum);
  maximum = Number(maximum);
  if (minimum < 0 || maximum < 0)
    throw { text: `Price cannot be negative`, code: "400 : BAD_USER_INPUT" };
  if (minimum >= maximum)
    throw {
      text: `Maximum cannot be smaller or equal to minimum`,
      code: "400 : BAD_USER_INPUT",
    };
  return { minimum, maximum };
};

const isValidNumber = (limit, para) => {
  if (isNaN(limit))
    throw { text: `${para} is not a number`, code: "400 : BAD_USER_INPUT" };
  limit = Number(limit);
  if (limit <= 0)
    throw {
      text: `${para} cannot be 0 or negative`,
      code: "400 : BAD_USER_INPUT",
    };
  if (!Number.isInteger(limit))
    throw {
      text: `${para} is not a whole number`,
      code: "400 : BAD_USER_INPUT",
    };
  return limit;
};

const validTitle = (title, para) => {
  let correctTitle = "";
  isEmpty(title, para);
  title = title.trim().split(" ");
  for (let n in title) {
    n = title[n].charAt(0).toUpperCase() + title[n].slice(1).toLowerCase();
    correctTitle += n + " ";
  }
  return correctTitle.trim();
};

const isArray = (genres, para) => {
  if (genres.length === 0)
    throw {
      text: `You must supply at least one ${para}`,
      code: "400 : BAD_USER_INPUT",
    };
  let genreInvalidFlag = false;
  let genreFlag = false;

  for (let i in genres) {
    if (genres[i].trim().length === 0) {
      genreInvalidFlag = true;
      break;
    }
    // if (genres[i].match(/[^a-zA-z-/\s]/gi)) {
    //   genreFlag = true;
    //   break;
    // }
    genres[i] = genres[i].trim();
    genres[i] =
      genres[i].charAt(0).toUpperCase() + genres[i].slice(1).toLowerCase();
  }
  if (genreInvalidFlag)
    throw {
      text: `One or more items in ${para} is an empty string`,
      code: "400 : BAD_USER_INPUT",
    };
  // if (genreFlag)
  //   throw "Genres must be at least 5 characters long and only letters a-z or A-Z.";
  return genres;
};

const checkPubDate = (pub, birthDate) => {
  isEmpty(pub, "Publication Date");
  pub = pub.trim();
  let date = moment(pub, ["MM/DD/YYYY", "M/D/YYYY"]);
  let valid = moment(pub, ["MM/DD/YYYY", "M/D/YYYY"], true).isValid();

  if (!valid)
    throw {
      text: `Invalid Publication Date.`,
      code: "400 : BAD_USER_INPUT",
    };
  else {
    const month = date.format("MM");
    const day = date.format("DD");
    const year = date.format("YYYY");
    const current = moment();

    const before = date.isSameOrBefore(current);
    if (!before)
      throw {
        text: `Invalid Publication Date. - you have entered a date ahead of today's.`,
        code: "400 : BAD_USER_INPUT",
      };

    birthDate = moment(birthDate, ["MM/DD/YYYY", "M/D/YYYY"]);
    const after = date.isAfter(birthDate);
    const formatBirth = birthDate.format("MM/DD/YYYY");
    if (!after)
      throw {
        text: `Publication date is on or before Author's birthdate. Auth birthdate - ${formatBirth}`,
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
  return pub.trim();
};

const isLeapYear = (year) => {
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) return 1;
  else return 0;
};

const validIsbn = (isbn) => {
  isEmpty(isbn, "ISBN");
  isbn = isbn.trim();
  const validate = ISBN.parse(isbn);
  if (validate === null)
    throw {
      text: `Invalid ISBN.`,
      code: "400 : BAD_USER_INPUT",
    };
  else if (validate.isIsbn10 || validate.isIsbn13) return isbn;
  else
    throw {
      text: `Invalid ISBN.`,
      code: "400 : BAD_USER_INPUT",
    };
};

const isBookPrice = (price) => {
  if (isNaN(price))
    throw { text: `Price is not a number`, code: "400 : BAD_USER_INPUT" };
  price = Number(price);
  if (price <= 0)
    throw {
      text: `Price cannot be 0 or negative`,
      code: "400 : BAD_USER_INPUT",
    };
  return price;
};

export {
  isValidGenre,
  isPrice,
  isValidNumber,
  validTitle,
  isArray,
  checkPubDate,
  validIsbn,
  isBookPrice,
};
