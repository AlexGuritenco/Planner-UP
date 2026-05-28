// Idea - calculate the miliseconds to keep track of how much you got left
const MS_PER_DAY = 24 * 60 * 60 * 1000

const pad = (value) => String(value).padStart(2, '0')

// the function will reset the time, keeping only the things we use in the calendar
export function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// check if the input is a Date object or if we have a date to begin with
export function parseDueDate(value) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return startOfDay(value)
    }
    // check using Regex to see if the string is a valid date format
    if (typeof value === 'string') {
        const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
        if (isoMatch) {
            const [, year, month, day] = isoMatch
            return new Date(Number(year), Number(month) - 1, Number(day))
        }

        const usMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
        if (usMatch) {
            const [, month, day, year] = usMatch
            return new Date(Number(year), Number(month) - 1, Number(day))
        }

        const parsed = new Date(value)
        // and if its invalid -> return the current date
        if (!Number.isNaN(parsed.getTime())) {
            return startOfDay(parsed)
        }
    }

    return startOfDay(new Date())
}

// returns a formatted date string in YYYY-MM-DD format
export function serializeDueDate(date) {
    const normalized = startOfDay(date)
    return `${normalized.getFullYear()}-${pad(normalized.getMonth() + 1)}-${pad(normalized.getDate())}`
}

// this is the time the user sees, because by default its the US
// converts to the EU one: day, month, year
export function formatDueDate(value) {
    return parseDueDate(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

// to check how much longer we got till the deadline
// we get the value and get the difference in time
// then we check if its overdue, today, tomorrow, next week or later
export function getDueBucket(value, now = new Date()) {
    const dueDate = startOfDay(parseDueDate(value))
    const today = startOfDay(now)
    const diffDays = Math.round((dueDate.getTime() - today.getTime()) / MS_PER_DAY)

    if (diffDays < 0) {
        return 'Overdue'
    }

    if (diffDays === 0) {
        return 'Today'
    }

    if (diffDays === 1) {
        return 'Tomorrow'
    }

    if (diffDays <= 7) {
        return 'Next Week'
    }

    return 'Later'
}
