export enum PRODUCT_CATEGORY {
  HOUSE_HOLD = "HOUSE_HOLD",
  HEALTH = "HEALTH",
  SPORT = "SPORT",
  BEAUTY = "BEAUTY",
};

export enum PRODUCT_TYPE {
  PERSONAL = "PERSONAL",
  KITCHEN = "KITCHEN",
  HOUSE = "HOUSE",
  SUPPLEMENTS = "SUPPLEMENTS",
  FUNCTIONAL = "FUNCTIONAL",
  SUPPORT = "SUPPORT",
  DAY = "DAY",
  NIGHT = "NIGHT",
};

export const FORM_DEFAULT_VALUE: {
  NUMBER: number | null;
  STRING: string | null;
} = {
  NUMBER: null,
  STRING: null
}
