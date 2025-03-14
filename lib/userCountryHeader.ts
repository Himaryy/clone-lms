import { pppCoupons } from "@/data/pppCoupons";
import { headers } from "next/headers";

const COUNTRY_HEADER_KEY = "x-user-country";

export function setUserHeaderCountry(
  headers: Headers,
  country: string | undefined
) {
  if (country == null) {
    headers.delete(COUNTRY_HEADER_KEY);
  } else {
    headers.set(COUNTRY_HEADER_KEY, country);
  }
}

async function getUserCounty() {
  const head = await headers();
  const country = head.get(COUNTRY_HEADER_KEY);

  return country;
}

export async function getUserCoupon() {
  const country = await getUserCounty();

  if (country == null) return;

  const coupon = pppCoupons.find((coupon) =>
    coupon.countryCodes.includes(country)
  );

  if (coupon == null) return;

  return {
    stripeCouponId: coupon.stripeCouponId,
    discountPercantage: coupon.discountPercentage,
  };
}
