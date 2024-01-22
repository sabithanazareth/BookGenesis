import { validate } from "uuid";

const isEmpty = (para, paraName) => {
  if (typeof para === "string" && para.trim().length === 0)
    throw { text: `${paraName} cannot be empty`, code: "400 : BAD_USER_INPUT" };
};

const isValidId = (idParam) => {
  isEmpty(idParam, "Id");
  let id = idParam.trim();
  if (!validate(id)) throw { text: `Invalid Id`, code: "400 : BAD_USER_INPUT" };
  return id;
};

export { isEmpty, isValidId };
