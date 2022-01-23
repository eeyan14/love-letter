import {cardAmounts, validateAmounts} from './types'

test("validateAmounts matches correctly", () => {
  expect(() => validateAmounts(cardAmounts)).not.toThrow()
})

test("validateAmounts error with incorrect array", () => {
  expect(() => validateAmounts([])).toThrow()
})
