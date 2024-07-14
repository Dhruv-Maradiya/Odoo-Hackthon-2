export const formatNumber = number => {
  if (typeof number !== 'number') {
    number = Number(number)
  }

  if (Number.isNaN(number)) {
    number = 0
  }

  if (number - Math.floor(number) !== 0) {
    return Number(number.toFixed(2))
  }

  return number
}
