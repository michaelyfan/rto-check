export interface DateRange {
	start: Date;
	end: Date;
}

export interface GetComplianceResult {
	period: DateRange;
	isCompliant: boolean;
	includedWeeks: DateRange[];
}

function localMidnight(d: Date): Date {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, days: number): Date {
	const r = new Date(d);
	r.setDate(r.getDate() + days);
	return r;
}

function startOfWeekSunday(d: Date): Date {
	const dt = localMidnight(d);
	const day = dt.getDay(); // 0 = Sunday
	return addDays(dt, -day);
}

function formatLocalDateKey(d: Date): string {
	// YYYY-MM-DD local
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

/**
 * calculationDate: Date object representing the date to make the calculation for (local time)
 * inOfficeDays: array of Date objects representing days the employee was in the office
 */
export function getCompliance(calculationDate: Date, inOfficeDays: Date[], numWeeks: number): GetComplianceResult {
	if (!(calculationDate instanceof Date) || Number.isNaN(calculationDate.getTime())) {
		throw new Error('calculationDate must be a valid Date');
	}

	// Normalize calculationDate to local midnight
	const calc = localMidnight(calculationDate);

	// Find the Sunday of the week containing calculationDate
	const calcWeekSunday = startOfWeekSunday(calc);

	// The "previous full week" ends the day before that Sunday (Saturday)
	const previousFullWeekEnd = addDays(calcWeekSunday, -1); // Saturday

	// build alignment period
	const weeks = 12;
	const totalDays = weeks * 7;
	const alignmentPeriodEnd = previousFullWeekEnd;
	const alignmentPeriodStart = addDays(alignmentPeriodEnd, -totalDays + 1); // inclusive start (Sunday)

	// build the weeks
	const weekRanges: Array<{ range: DateRange; count: number }> = [];
	for (let i = 0; i < weeks; i++) {
		const start = addDays(alignmentPeriodStart, i * 7);
		const end = addDays(start, 6);
		weekRanges.push({ range: { start, end }, count: 0 });
	}

	// Normalize inOfficeDays to unique local dates
	const uniqueLocalDates = new Set<string>();
	for (const d of inOfficeDays || []) {
		if (!(d instanceof Date) || Number.isNaN(d.getTime())) continue;
		const local = localMidnight(d);
		const key = formatLocalDateKey(local);
		uniqueLocalDates.add(key);
	}

	// Count attendance per week (only consider dates inside alignment period)
	for (const key of uniqueLocalDates) {
		// parse key back to local date
		const [y, m, day] = key.split('-').map((s) => parseInt(s, 10));
		const date = new Date(y, m - 1, day);
		if (date < alignmentPeriodStart || date > alignmentPeriodEnd) continue;
		// find which week
		const weekIndex = Math.floor((Math.floor((date.getTime() - alignmentPeriodStart.getTime()) / (1000 * 60 * 60 * 24))) / 7);
		if (weekIndex >= 0 && weekIndex < weekRanges.length) {
			weekRanges[weekIndex].count += 1;
		}
	}

	// If excluding weeks, exclude them here
	// tie-breaker: earlier weeks first.
	const sortedByCount = weekRanges
		.map((w, idx) => ({ idx, count: w.count, startTime: w.range.start.getTime() }))
		.sort((a, b) => (a.count - b.count) || (a.startTime - b.startTime));

	const excludedIndices = new Set<number>(sortedByCount.slice(0, 4).map((s) => s.idx));

	const includedWeeks: DateRange[] = [];
	let totalIncludedDays = 0;
	for (let i = 0; i < weekRanges.length; i++) {
		if (!excludedIndices.has(i)) {
			includedWeeks.push(weekRanges[i].range);
			totalIncludedDays += weekRanges[i].count;
		}
	}

	console.log(totalIncludedDays);
	const isCompliant = totalIncludedDays >= 24; // TODO: generalize this to other week ranges

	return {
		period: { start: alignmentPeriodStart, end: alignmentPeriodEnd },
		isCompliant,
		includedWeeks,
	};
}

export default getCompliance;
