/**
 * RENT CALCULATION RULES:
 * 1. If person comes before or on 5th: Full month rent
 * 2. Until 20th of a month: collect rent from the joining date till end of the month
 *    Rent/day = (monthly rent) / (No. of days in the month)
 *    Rent = (days left) * (Rent/day)
 * 3. From 21st: Rent = Rent for the days left in current month + next month rent
 */

export interface RentCalculationResult {
  monthlyBaseRent: number;
  calculatedRent: number;
  rentPerDay: number;
  daysLeft: number;
  daysInMonth: number;
  joinDay: number;
  condition: "before_or_5th" | "until_20th" | "from_21st" | "short_term" | "default";
  paymentMonthDisplay: string;
  breakdownText: string;
}

export function calculateInitialRent(
  monthlyRent: number,
  checkInDateStr?: string,
  checkOutDateStr?: string,
  duration?: string
): RentCalculationResult {
  const safeBaseRent = Number(monthlyRent) || 0;

  if (!checkInDateStr) {
    return {
      monthlyBaseRent: safeBaseRent,
      calculatedRent: safeBaseRent,
      rentPerDay: safeBaseRent > 0 ? Math.round((safeBaseRent / 30) * 100) / 100 : 0,
      daysLeft: 30,
      daysInMonth: 30,
      joinDay: 1,
      condition: "default",
      paymentMonthDisplay: "",
      breakdownText: "Full monthly rent",
    };
  }

  // Parse YYYY-MM-DD
  const parts = checkInDateStr.split("-").map((p) => parseInt(p, 10));
  let d: Date;
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    d = new Date(parts[0], parts[1] - 1, parts[2]);
  } else {
    d = new Date(checkInDateStr);
  }

  if (isNaN(d.getTime())) {
    return {
      monthlyBaseRent: safeBaseRent,
      calculatedRent: safeBaseRent,
      rentPerDay: safeBaseRent > 0 ? Math.round((safeBaseRent / 30) * 100) / 100 : 0,
      daysLeft: 30,
      daysInMonth: 30,
      joinDay: 1,
      condition: "default",
      paymentMonthDisplay: "",
      breakdownText: "Full monthly rent",
    };
  }

  const year = d.getFullYear();
  const month = d.getMonth(); // 0 to 11
  const joinDay = d.getDate();

  // Days in check-in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysLeft = daysInMonth - joinDay + 1;
  const rentPerDay = daysInMonth > 0 ? safeBaseRent / daysInMonth : 0;
  const proratedStayRent = Math.round(daysLeft * rentPerDay * 100) / 100;

  // Short Term Stay Rule: calculate by actual days stayed between check-in and check-out
  const isShortTerm =
    duration === "Short Term" ||
    (Boolean(checkOutDateStr) && checkOutDateStr !== "0000-00-00" && duration !== "Long Term");

  if (isShortTerm && checkOutDateStr && checkOutDateStr !== "0000-00-00") {
    const outParts = checkOutDateStr.split("-").map((p) => parseInt(p, 10));
    let dOut: Date;
    if (outParts.length === 3 && !isNaN(outParts[0]) && !isNaN(outParts[1]) && !isNaN(outParts[2])) {
      dOut = new Date(outParts[0], outParts[1] - 1, outParts[2]);
    } else {
      dOut = new Date(checkOutDateStr);
    }

    if (!isNaN(dOut.getTime()) && dOut.getTime() > d.getTime()) {
      const diffTime = dOut.getTime() - d.getTime();
      const stayDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
      const shortTermRent = Math.round(stayDays * rentPerDay * 100) / 100;

      const inDisplay = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const outDisplay = dOut.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

      return {
        monthlyBaseRent: safeBaseRent,
        calculatedRent: shortTermRent,
        rentPerDay: Math.round(rentPerDay * 100) / 100,
        daysLeft: stayDays,
        daysInMonth,
        joinDay,
        condition: "short_term",
        paymentMonthDisplay: `${inDisplay} - ${outDisplay}`,
        breakdownText: `${stayDays} ${stayDays === 1 ? "day" : "days"} Short Term stay (${inDisplay} to ${outDisplay})`,
      };
    }
  }

  if (joinDay <= 5) {
    // Condition 1: On or before 5th -> Full month rent
    const curMonthName = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    return {
      monthlyBaseRent: safeBaseRent,
      calculatedRent: safeBaseRent,
      rentPerDay: Math.round(rentPerDay * 100) / 100,
      daysLeft,
      daysInMonth,
      joinDay,
      condition: "before_or_5th",
      paymentMonthDisplay: curMonthName,
      breakdownText: `Full month rent (${curMonthName})`,
    };
  } else if (joinDay <= 20) {
    // Condition 2: Until 20th -> Prorated rent from join date till end of month
    const curMonthName = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    return {
      monthlyBaseRent: safeBaseRent,
      calculatedRent: proratedStayRent,
      rentPerDay: Math.round(rentPerDay * 100) / 100,
      daysLeft,
      daysInMonth,
      joinDay,
      condition: "until_20th",
      paymentMonthDisplay: curMonthName,
      breakdownText: `${daysLeft === 1 ? "1 day rent" : `${daysLeft} days rent`} (${joinDay}th to ${daysInMonth}th ${curMonthName})`,
    };
  } else {
    // Condition 3: From 21st -> Days left in current month + next month rent
    const nextMonthDate = new Date(year, month + 1, 1);
    const nextMonthName = nextMonthDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const curMonthShort = d.toLocaleDateString("en-US", { month: "short" });
    const totalRent = Math.round((safeBaseRent + proratedStayRent) * 100) / 100;
    return {
      monthlyBaseRent: safeBaseRent,
      calculatedRent: totalRent,
      rentPerDay: Math.round(rentPerDay * 100) / 100,
      daysLeft,
      daysInMonth,
      joinDay,
      condition: "from_21st",
      paymentMonthDisplay: nextMonthName,
      breakdownText: `${daysLeft === 1 ? "1 day" : `${daysLeft} days`} in ${curMonthShort} (₹${proratedStayRent}) + ${nextMonthName} rent (₹${safeBaseRent})`,
    };
  }
}

